import {
  GoogleMap,
  LoadScript,
  StreetViewPanorama,
  Marker,
} from "@react-google-maps/api";

export default function StreetViewMap() {

  const center = {
    lat: -6.301693,
    lng: 106.652214,
  };

  return (
    <div className="street-view-container">

      <LoadScript googleMapsApiKey="MASUKKAN_API_KEY_LU">

        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          center={center}
          zoom={18}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >

          {/* MARKER */}
          <Marker position={center} />

          {/* STREET VIEW */}
          <StreetViewPanorama
            position={center}
            visible={true}

            options={{
              addressControl: true,
              linksControl: true,
              panControl: true,
              enableCloseButton: false,
              fullscreenControl: true,
              motionTracking: true,
              motionTrackingControl: true,
              zoomControl: true,
            }}
          />

        </GoogleMap>

      </LoadScript>

    </div>
  );
}