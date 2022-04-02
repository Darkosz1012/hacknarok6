import { Icon, LatLng, Point } from 'leaflet';
import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'  
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PushPinTwoToneIcon from '@mui/icons-material/PushPinTwoTone';
import pinIcon from '../resources/pinIcon2.svg';
import { Fab, Box } from '@mui/material';

function AddButton(props: any) {
  const [active, setActive] = useState(false);

  const map = useMap();

  const handleAdd = () => {
    setActive(false);

    const location = map.getCenter();
    // SZYMON TUTAJ :OOOO
    console.log(location);
  };

  const handleMoveToUser = () => {
    
  };

  return (
    <Box>
    <Box sx={{ position: 'absolute', bottom: '3rem', right: '3rem', display:'flex', flexDirection:'column-reverse', justifyContent: 'space-between', height:'11rem'}}>
      <Fab sx={{ width: '5rem', height: '5rem' }} color={active ? 'error' : 'primary'} onClick={(e => {
        e.stopPropagation();
        setActive(!active);
      })}>
        {!active && <AddIcon sx={{width:'50%', height:'50%'}}></AddIcon>}
        {active && <CloseIcon sx={{width:'50%', height:'50%'}}></CloseIcon>}
      </Fab>
      {active && <Fab sx={{ width: '5rem', height: '5rem' }} color={'success'} onClick={(e => handleAdd())}>
        {active && <CheckIcon sx={{width:'50%', height:'50%'}}></CheckIcon>}
      </Fab>}
        {active && <Fab sx={{ width: '5rem', height: '5rem' }} onClick={(e => {
          handleAdd();
          handleMoveToUser();
        })}>
        {active && <CheckIcon sx={{width:'50%', height:'50%'}}></CheckIcon>}
      </Fab>}
      </Box>
      {active && <PushPinTwoToneIcon sx={{ position: 'absolute', top: '50%', left: '50%', zIndex:'1000'}}></PushPinTwoToneIcon>}
    </Box>
  )
}

function UserMarker(props: any) {
    const userIcon = new Icon({
        iconUrl: pinIcon,
        iconSize: new Point(40, 40),  
      });

    const map = useMap();

    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        props.setPosition(e.latlng);
        map.flyTo(e.latlng, 15);
      });
    }, [map]);

    return !props.position ? null :(
        <Marker position={props.position} icon={userIcon}></Marker>
    );
}

function MainMap(props: any) {
  const [position, setPosition] = useState<LatLng | undefined>();
  
    return (
        <MapContainer style={{height: "calc(100vh - 4rem)", marginTop:"4rem"}} center={[52.1064618,18.5525723]} zoom={7}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        <UserMarker position={position} setPosition={setPosition}/>
          <AddButton></AddButton>
        </MapContainer>
    );                                                                                                          
}   

export default MainMap;
