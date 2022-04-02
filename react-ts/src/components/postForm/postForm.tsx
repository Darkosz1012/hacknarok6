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
} from "@mui/material";
import SearchBarTags from "../searchBarTags/SearchBarTags";
import { top100Films } from "../searchBarTags/options";
import { useState } from "react";

interface PostFormProps {
  onSubmit?: (content: string, tags: string[], location: string) => void;
  locations?: string[];
}

export default function PostForm(props: PostFormProps) {
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([] as string[]);

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Post Form
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          Location
        </Typography>
        <Select
          sx={{ marginBottom: "10px", width: "100%" }}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          displayEmpty
        >
          <MenuItem value="">
            <em>Current</em>
          </MenuItem>
          {props.locations?.map((location) => {
            return <MenuItem key={location} value={location}> {location}</MenuItem>;
          })}
        </Select>

        <Typography gutterBottom variant="h6" component="div">
          Tags
        </Typography>
        <SearchBarTags
          optionTags={top100Films}
          label={"Tags"}
          onChange={(value) => {
            setTags(value);
          }}
        />

        <Typography gutterBottom variant="h6" component="div">
          Post content
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
            resize:'vertical'
          }}
          onChange={(e) => {setContent(e.target.value)}}
        />

      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={() => {
            console.log(content, tags, location);
            props.onSubmit?.call(null, content, tags, location);
          }}
        >
          Add post
        </Button>
      </CardActions>
    </Card>
  );
}
