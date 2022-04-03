import { Icon, LatLng, Point } from "leaflet";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PushPinTwoToneIcon from "@mui/icons-material/PushPinTwoTone";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import pinIcon from "../resources/pinIcon2.svg";
import {
  Fab,
  Box,
  AppBar,
  Dialog,
  IconButton,
  Toolbar,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import PostForm, { PostData } from "./postForm/postForm";
import { useMutation, gql } from "@apollo/client";
import axios from "axios";

const ADD_POST_MUTATION = gql`
  mutation createPost(
    $title: String!
    $content: String!
    $coords: PointInput!
    $tags: [String!]
    $place: String
  ) {
    createPost(
      title: $title
      content: $content
      coords: $coords
      tags: $tags
      place: $place
    ) {
      success
    }
  }
`;

function AddButton(props: any) {
  const [active, setActive] = useState(false);

  const map = useMap();

  const handleAdd = (location: LatLng) => {
    setActive(false);
    props.onAdd(location);
  };

  const handleMoveToUser = () => {
    map.flyTo(props.position, 15);
    handleAdd(props.position);
  };

  return (
    <Box>
    <Box sx={{ position: 'absolute', bottom: '3rem', right: '3rem', display:'flex', flexDirection:'column-reverse', justifyContent: 'space-between', height:'17rem'}}>
      <Fab sx={{ width: '5rem', height: '5rem' }} color={active ? 'error' : 'primary'} onClick={(e => {
        e.stopPropagation();
        setActive(!active);
      })}>
        {!active && <AddIcon sx={{width:'50%', height:'50%'}}></AddIcon>}
        {active && <CloseIcon sx={{width:'50%', height:'50%'}}></CloseIcon>}
      </Fab>
      {active && <Fab sx={{ width: '5rem', height: '5rem' }} color={'success'} onClick={(e => handleAdd(map.getCenter()))}>
        <CheckIcon sx={{width:'50%', height:'50%'}}></CheckIcon>
      </Fab>}
        {active && <Fab sx={{ width: '5rem', height: '5rem' }} onClick={(e => handleMoveToUser())}>
        <GpsFixedIcon sx={{width:'50%', height:'50%'}}></GpsFixedIcon>
      </Fab>}
      </Box>
      {active && <PushPinTwoToneIcon sx={{ position: 'absolute', top: '50%', left: '50%', zIndex:'1000'}}></PushPinTwoToneIcon>}
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
      map.locate().on("locationfound", function (e) {
        props.setPosition(e.latlng);
        map.flyTo(e.latlng, 15);
      });
    }, [map]);

    return !props.position ? null :(
        <Marker position={props.position} icon={userIcon}></Marker>
    );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function MainMap(props: any) {
  const [position, setPosition] = useState<LatLng | undefined>();
  const [addLocation, setAddLocation] = useState<LatLng | undefined>();

  const [openAdd, setOpenAdd] = useState(false);

  const onAdd = (location: LatLng) => {
    setAddLocation(location);
    setOpenAdd(true);
  };

  const [mutateFunction] = useMutation(ADD_POST_MUTATION, {
    onCompleted: (data) => {
      console.log(data);
      // TODO: refresh data
    },
    onError: (error) => {
      console.log(error); // the error if that is the case
    },
  });

  const handleAdd = (data: PostData) => {
    setOpenAdd(false);
    console.log(data)
    const formData = new FormData();
    formData.append('image',data.img);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    };
    axios.post("/upload",formData,config)
        .then((response) => {
            console.log("The file is successfully uploaded");
        }).catch((error) => {
    });
    mutateFunction({
      variables: {
        title: data.title,
        content: data.content,
        coords: {
          longitude: data.location.lng,
          latitude: data.location.lat,
        },
        tags: data.tags,
        place: data.place,
      },
    });
  };

  return (
    <MapContainer
      style={{ height: "calc(100vh - 4rem)", marginTop: "4rem" }}
      center={[52.1064618, 18.5525723]}
      zoom={7}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UserMarker position={position} setPosition={setPosition} />
      <AddButton position={position} onAdd={onAdd}></AddButton>

      <Dialog
        fullScreen
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
        }}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={() => {
                setOpenAdd(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <PostForm
          currentLocation={addLocation}
          sx={{ width: "100%", maxWidth: "600px", margin: " 20px auto" }}
          locations={[
            { name: "zabka", position: new LatLng(52.1064618, 18.5525723) },
          ]}
          onSubmit={handleAdd}
        />
      </Dialog>
    </MapContainer>
  );
}

export default MainMap;
