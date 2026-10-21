import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { AREA_HEX, AREA_NOME, ZONE, type Zona } from "@/lib/aree";
import { isChiusa, type Segnalazione } from "@/lib/data";

function Vola({ zona }: { zona: Zona }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(ZONE[zona].centro, ZONE[zona].zoom, { duration: 0.8 });
  }, [zona, map]);
  return null;
}

export default function LeafletMap({
  items,
  height = 460,
  zona = "tutte",
}: {
  items: Segnalazione[];
  height?: number;
  zona?: Zona;
}) {
  return (
    <MapContainer
      center={ZONE[zona].centro}
      zoom={ZONE[zona].zoom}
      scrollWheelZoom
      style={{ height, width: "100%" }}
      className="rounded-2xl border"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Vola zona={zona} />
      {items.map((s) => (
        <CircleMarker
          key={s.id}
          center={[s.lat, s.lng]}
          radius={s.urgenza === "alta" ? 9 : 6}
          pathOptions={{
            color: "#ffffff",
            weight: 2,
            fillColor: AREA_HEX[s.area],
            fillOpacity: isChiusa(s) ? 0.35 : 0.9,
          }}
        >
          <Popup>
            <b>
              {s.id} · {s.categoria}
            </b>
            <br />
            {AREA_NOME[s.area]} · {s.stato}
            <br />
            <span className="text-xs text-muted-foreground">
              {new Date(s.data).toLocaleDateString("it-IT")} · urgenza {s.urgenza}
            </span>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
