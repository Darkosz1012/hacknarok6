import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface MediaCardProps {
  onShow?: () => void;
  place: {
    name: string;
    countPosts: number;
  };
}

export default function MediaCard(props: MediaCardProps) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={"https://loremflickr.com/320/240/" + props.place.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {props.place.name}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => props.onShow?.call(null)}
        >
          Show posts{" "}
          {props.place.countPosts ? `(${props.place.countPosts})` : ""}
        </Button>
      </CardActions>
    </Card>
  );
}
