import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface SearchBarTagsProps {
  onChange?: (value: string[]) => void;
  optionTags: { name: string }[];
  label?: string;
  freeSolo?: boolean;
}

export default function SearchBarTags(props: SearchBarTagsProps) {
  return (
    <Autocomplete
      sx={{ marginBottom: "10px" }}
      multiple
      id="tags-filled"
      options={props.optionTags.map((option) => option.name)}
      defaultValue={[]}
      freeSolo={props.freeSolo ?? true}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} placeholder="Search tags" />
      )}
      onChange={(event, value) => {
        console.log(value);
        props.onChange && props.onChange(value);
      }}
    />
  );
}
