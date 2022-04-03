import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import { useStore } from "../services/StoreService";

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider() {
  const { distanceRange, setDistanceRange } = useStore();

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (!(newValue instanceof Array)) setDistanceRange(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDistanceRange(Number(event.target.value));
  };

  const handleBlur = () => {
    if (distanceRange < 0) {
      setDistanceRange(0);
    } else if (distanceRange > 3000) {
      setDistanceRange(3000);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        Search distance [m]
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof distanceRange === "number" ? distanceRange : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            color="secondary"
            min={0}
            max={3000}
          />
        </Grid>
        <Grid item>
          <Input
            value={distanceRange}
            sx={{ minWidth: "51px" }}
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 0,
              max: 30000,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
