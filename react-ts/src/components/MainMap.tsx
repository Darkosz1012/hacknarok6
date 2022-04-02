import { Icon, LatLng, Point } from "leaflet";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Tooltip,
} from "react-leaflet";
import AddIcon from "@mui/icons-material/Add";
import pinIcon from "../resources/pinIcon2.svg";
import { Fab, Box } from "@mui/material";
import { PostMarker } from "./postMarker/postMarker";
import { gql, useQuery } from '@apollo/client';


const GET_PLACES = gql`
query Places($where: PlaceWhere, $options: PlaceOptions) {
  places(where: $where, options: $options) {
    name
    coords {
      longitude
      latitude
    }
  }
}`;

function AddButton() {
  return (
    <Box sx={{ position: "absolute", bottom: "3rem", right: "3rem" }}>
      <Fab sx={{ width: "5rem", height: "5rem" }}>
        <AddIcon sx={{ width: "50%", height: "50%" }}></AddIcon>
      </Fab>
    </Box>
  );
}

function UserMarker() {
  const userIcon = new Icon({
    iconUrl: pinIcon,
    iconSize: new Point(40, 40),
  });

  const [position, setPosition] = useState<LatLng | undefined>();

  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
    });
  }, [map]);

  return !position ? null : (
    <Marker position={position} icon={userIcon}></Marker>
  );
}

function MainMap(props: any) {

  const { loading, error, data:placeData } = useQuery(GET_PLACES, {
    variables: {
      "where": {
        "coords_LTE": {
          "point": {
            "longitude": 50,
            "latitude": 19
          },
          "distance": 5000000
        }
      }
    },
    pollInterval: 500,
  })

  useEffect(() => {
    error &&  console.error(error);
  }, [error])

  return (
    <MapContainer
      style={{ height: "100vh" }}
      center={[52.1064618, 18.5525723]}
      zoom={7}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <UserMarker /> */}
      {!loading && !error && placeData.places.map((marker: any, index: number) => {
        console.log(index, marker)
        return (
          <PostMarker
            key={index}
            position={new LatLng(marker.coords.latitude, marker.coords.longitude)}
            children={<h1>{marker.name}</h1>}
          />
        )
      })}

      <AddButton></AddButton>
    </MapContainer>
  );
}

export default MainMap;
