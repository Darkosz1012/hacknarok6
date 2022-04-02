import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface SearchBarTagsProps {
    onChange?: (value: string[]) => void;
    optionTags: { name: string }[];
    label?: string;
    freeSolo?: boolean;
    disableCloseOnSelect?: boolean;
    limitTags?: number;
    value?: string[];
}

export default function SearchBarTags({
    optionTags,
    onChange,
    label,
    value,
    ...props
}: SearchBarTagsProps) {
    return (
        <Autocomplete
            sx={{ marginBottom: "10px" }}
            multiple
            id="tags-filled"
            options={optionTags.map((option) => option.name)}
            defaultValue={[]}
            freeSolo
            disableCloseOnSelect
            limitTags={-1}
            renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                    <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                    />
                ))
            }
            value={value}
            renderInput={(params) => (
                <TextField {...params} placeholder="Search tags" />
            )}
            onChange={(event, value) => {
                console.log(value);
                onChange && onChange(value);
            }}
            {...props}
        />
    );
}
