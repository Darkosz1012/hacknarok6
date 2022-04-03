import * as React from "react";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  MenuItem,
  Select,
  SxProps,
  Theme,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import SearchBarTags from "../searchBarTags/SearchBarTags";
import { useState } from "react";
import { LatLng } from "leaflet";
import { useQuery, gql } from "@apollo/client";


const GET_TAGS = gql`
  query Places($where: PlaceWhere) {
    tags {
      name
    }

    places(where: $where) {
      placeId
      name
      coords {
        longitude
        latitude
      }
    }
  }
`;

export interface PostData {
  title: string;
  content: string;
  tags: string[];
  location: LatLng;
  place?: string;
  img?:any;
}
interface PostFormProps {
  onSubmit?: (data: PostData) => void;
  locations?: { name: string; position: LatLng }[];
  currentLocation?: LatLng;
  sx?: SxProps<Theme>;
}

export default function PostForm(props: PostFormProps) {
  const [location, setLocation] = useState(
    JSON.stringify(props.currentLocation)
  );

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<any>(null);

  const { loading, error, data } = useQuery(GET_TAGS, {
    variables: {
      where: {
        coords_LTE: {
          point: {
            longitude: props.currentLocation?.lng,
            latitude: props.currentLocation?.lat,
          },
          distance: 5000000000000,
        },
      },
    },
  });

  const [tags, setTags] = useState([] as string[]);

  const changeLocation = (e: SelectChangeEvent<string>) => {
    setLocation(e.target.value);
  };

  return (
    <Card sx={props.sx}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Post Form
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          Location
        </Typography>
        <Select
          sx={{ marginBottom: "10px", width: "100%" }}
          onChange={changeLocation}
          value={location}
        >
          <MenuItem value={JSON.stringify(props.currentLocation)}>
            <em>
              Current - lat: {props.currentLocation?.lat}, lng:
              {props.currentLocation?.lng}
            </em>
          </MenuItem>
          {data?.places
            ?.map((location: any) => {
              return {
                name: location.name,
                position: {
                  lng: location.coords.longitude,
                  lat: location.coords.latitude,
                },
                placeId: location.placeId,
              };
            })
            .map((location: any) => {
              return (
                <MenuItem
                  key={location.name}
                  value={JSON.stringify({
                    ...location.position,
                    place: location.placeId,
                  })}
                >
                  <em>
                    {location.name} - lat: {location.position?.lat}, lng:
                    {location.position?.lng}
                  </em>
                </MenuItem>
              );
            })}
        </Select>

        <Typography gutterBottom variant="h6" component="div">
          Tags
        </Typography>
        <SearchBarTags
          optionTags={data?.tags ?? []}
          label={"Tags"}
          onChange={(value) => {
            setTags([...value]);
          }}
        />

        <Typography gutterBottom variant="h6" component="div">
          Title
        </Typography>

        <TextField
          fullWidth
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />

        <Typography gutterBottom variant="h6" component="div">
          Content
        </Typography>
        <TextareaAutosize
          minRows={6}
          placeholder="Write something..."
          style={{
            width: "100%",
            fontFamily: "Arial",
            marginBottom: "10px",
            padding: "10px",
            fontSize: "1rem",
            resize: "vertical",
          }}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <Button
          variant="contained"
          component="label"
        >
          Upload File
          <input
            type="file"
            hidden
            onChange={(e) => {
              if(e?.target?.files)
              setFile(e?.target?.files[0]);
            }}
          />
        </Button>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={() => {
            console.log(title, content, tags, location);
            const parsed = JSON.parse(location);
            const newLocation = new LatLng(parsed.lat, parsed.lng);

            props.onSubmit?.call(null, {
              title,
              content,
              tags,
              location: newLocation,
              place: parsed.place ?? null,
              img:file,
            });
          }}
        >
          Add post
        </Button>
      </CardActions>
    </Card>
  );
}
