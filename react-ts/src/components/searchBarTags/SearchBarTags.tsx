import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface SearchBarTagsProps {
  onChange?: (value: string[]) => void;
  optionTags: { name: string }[];
}

export default function SearchBarTags(props: SearchBarTagsProps) {
  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={props.optionTags.map((option) => option.name)}
      defaultValue={[]}
      freeSolo
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label="Search"
          placeholder="Reviews"
        />
      )}
      onChange={(event, value) => {
        console.log(value);
        props.onChange && props.onChange(value);
      }}
    />
  );
}
