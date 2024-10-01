import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  // Tooltip,
  // SVGOverlay,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MapMarker from "./MapMarker";
import { useDispatch, useSelector } from "react-redux";
import { mapRequest } from "../../../Redux/Actions/MapAction";
import { CountryData } from "./CountryData";
import "../ShipmentTable/Booking.css";
import { Tabs } from "antd";

// Define the position and coordinates
const position = [10.586958, -34.623453];

export default function Americas() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [selectImport, setSelectImport] = useState(true);
  const [selectExport, setSelectExport] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const dispatch = useDispatch();
  const handleMarkerClick = (id) => {
    setShowModal(true);
    setSelectedMarkerId(id);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedMarkerId(null);
  };
  useEffect(() => {
    dispatch(mapRequest());
  }, [dispatch]);

  const MapDatas = useSelector((state) => state.Map?.MapData?.countries);
  // const { loading } = useSelector((state) => state.Map?.MapData);

  // if (loading) {
  //   return <div>loading</div>;
  // }

  const filteredCountryData = MapDatas
    ? CountryData.filter((country) =>
        MapDatas.some((data) => data.country_code === country.countryCode)
      )
    : [];

  const tabs = [
    {
      label: "Import",
      key: 1,
    },
    {
      label: "Export",
      key: 2,
    },
  ];
  const onchangeTab = (key) => {
    setActiveTab(key);
    switch (key) {
      case 1:
        setSelectImport(true);
        setSelectExport(false);
        break;
      case 2:
        setSelectExport(true);
        setSelectImport(false);
        break;
      default:
        setSelectImport(true);
        setSelectImport(false);
    }
  };
  return (
    <div className="mb-5">
      <div className="d-flex mb-3 gap-3" style={{ justifyContent: "end" }}>
        <Tabs activeKey={activeTab} onChange={onchangeTab} items={tabs}></Tabs>
      </div>
      <MapContainer
        center={position}
        zoom={1.5}
        minZoom={1.5}
        style={{ height: "300px", position: "relative" }}
      >
        <TileLayer url="https://tile.openstreetmap.de/{z}/{x}/{y}.png" />

        {filteredCountryData.map((location, index) => {
          const mapData = MapDatas.find(
            (data) => data.country_code === location.countryCode
          );
          const markerNumber = mapData?.no_of_shipments || 0;
          const markerId = mapData.country_code;
          const markerStatus = mapData?.import_export;
          console.log("datamap", markerStatus);

          const numberIcon = L.divIcon({
            html: `<div style="color: white; font-size: 10px; background: red; border-radius: 50%; width: 35px; height: 35px; display: flex; justify-content: center; align-items: center;border:5px solid white">${markerNumber}</div>`,
            className: "",
            iconSize: [24, 24],
          });
          return (
            <>
              {selectImport && markerStatus === "IMPORT" && (
                <Marker
                  key={index}
                  position={[location.latitude, location.longitude]}
                  icon={numberIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(markerId),
                  }}
                ></Marker>
              )}
              {selectExport && markerStatus === "EXPORT" && (
                <Marker
                  key={index}
                  position={[location.latitude, location.longitude]}
                  icon={numberIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(markerId),
                  }}
                ></Marker>
              )}
            </>
          );
        })}
      </MapContainer>
      <MapMarker
        showModal={showModal}
        onClose={handleModalClose}
        markerId={selectedMarkerId}
      />
    </div>
  );
}
