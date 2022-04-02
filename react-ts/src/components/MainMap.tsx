import { Icon, LatLng, Point } from 'leaflet';
import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PushPinTwoToneIcon from '@mui/icons-material/PushPinTwoTone';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import pinIcon from '../resources/pinIcon2.svg';
import { Fab, Box } from '@mui/material';
import { PostMarker } from "./postMarker/postMarker";
import { gql, useQuery } from '@apollo/client';
import useInterval from 'use-interval';

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

function AddButton(props: any) {
  const [active, setActive] = useState(false);

  const map = useMap();

  const handleAdd = (location: LatLng) => {
    setActive(false);
    // SZYMON TUTAJ :OOOO
    console.log(location);
  };

  const handleMoveToUser = () => {
    map.flyTo(props.position, 15);
    handleAdd(props.position);
  };

  return (
    <Box>
      <Box sx={{ position: 'absolute', bottom: '3rem', right: '3rem', display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between', height: '17rem' }}>
        <Fab sx={{ width: '5rem', height: '5rem' }} color={active ? 'error' : 'primary'} onClick={(e => {
          e.stopPropagation();
          setActive(!active);
        })}>
          {!active && <AddIcon sx={{ width: '50%', height: '50%' }}></AddIcon>}
          {active && <CloseIcon sx={{ width: '50%', height: '50%' }}></CloseIcon>}
        </Fab>
        {active && <Fab sx={{ width: '5rem', height: '5rem' }} color={'success'} onClick={(e => handleAdd(map.getCenter()))}>
          <CheckIcon sx={{ width: '50%', height: '50%' }}></CheckIcon>
        </Fab>}
        {active && <Fab sx={{ width: '5rem', height: '5rem' }} onClick={(e => handleMoveToUser())}>
          <GpsFixedIcon sx={{ width: '50%', height: '50%' }}></GpsFixedIcon>
        </Fab>}
      </Box>
      {active && <PushPinTwoToneIcon sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: '1000' }}></PushPinTwoToneIcon>}
    </Box>
  );
}

function UserMarker(props: any) {

  const userIcon = new Icon({
    iconUrl: pinIcon,
    iconSize: new Point(40, 40),
  });

  const map = useMap();

  useEffect(() => {
    if (props.hasCentered || !props.position) return;

    console.log(props.hasCentered);

    map.flyTo(props.position, 13);

    props.setHasCentered(true)
  }, [props.position]);

  return !props.position ? null : (
    <Marker position={props.position} icon={userIcon}></Marker>
  );
}

function MainMap(props: any) {
  const [position, setPosition] = useState<LatLng | undefined>();
  const [hasCentered, setHasCentered] = useState(false);

  console.log('sranie doryja', position)

  useInterval(() => {
    navigator.geolocation.getCurrentPosition(location => {
      setPosition(new LatLng(location.coords.latitude, location.coords.longitude));
    });
  }, 1000);


  const { loading, error, data: placeData } = useQuery(GET_PLACES, {
    variables: {
      "where": {
        "coords_LTE": {
          "point": {
            "longitude": position?.lng,
            "latitude": position?.lat
          },
          "distance": 2000
        }
      }
    },
    pollInterval: 2000,
  })

  return (
    <MapContainer style={{ height: "calc(100vh - 4rem)", marginTop: "4rem" }} center={[52.1064618, 18.5525723]} zoom={7}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserMarker position={position} setPosition={setPosition} hasCentered={hasCentered} setHasCentered={setHasCentered} />
      <AddButton position={position}></AddButton>
      {!loading && !error && placeData.places.map((marker: any, index: number) => {
        console.log(marker);
        return (
          <PostMarker
            key={index}
            position={new LatLng(marker.coords.latitude, marker.coords.longitude)}
            children={<h1>{marker.name}</h1>}
          />
        )
      })}
    </MapContainer>
  );
}

export default MainMap;
