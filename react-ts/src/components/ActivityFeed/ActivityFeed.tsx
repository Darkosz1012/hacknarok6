import * as React from "react";
import { Autocomplete, Pagination } from "@mui/material";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@mui/material/FormControl";
import Post from "./Post";
import SearchBarTags from "../searchBarTags/SearchBarTags";

export default function ActivityFeed() {
    const posts = [
        {
            title: "Post 1",
            body: "This is the first post",
            author: "John Doe",
            date: new Date(),
            tags: ["tag1", "tag2"],
        },
        {
            title: "Post 2",
            body: "This is the second post",
            author: "Jane Doe",
            date: new Date(),
            tags: ["tag1", "tag2"],
        },
        {
            title: "Post 3",
            body: "This is the third post",
            author: "John Doe",
            date: new Date(),
            tags: ["tag1", "tag2"],
        },
        {
            title: "Post 4",
            body: "This is the fourth post",
            author: "Jane Doe",
            date: new Date(),
            tags: ["tag1", "tag2"],
        },
        {
            title: "Post 5",
            body: "This is the fifth post",
            author: "Szymon Kania",
            date: new Date(),
            tags: ["tag1", "tag2"],
        },
    ];
    const [sort, setSort] = React.useState("1");
    const [page, setPage] = React.useState(1);
    const [count, setCount] = React.useState(10);
    const [tags, setTags] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent) =>
        setSort(event.target.value as string);

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => setPage(value);

    const toggleTag = (tag: string) => {
        if (tags.includes(tag)) {
            setTags(tags.filter((t) => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    };
    const handleSearchChange = (value: string[] | null) => {
        setTags(value ?? []);
    };

    const handleTagClick = (tag: string) => toggleTag(tag);

    return (
        <Grid container spacing={3} sx={{ padding: "2rem" }}>
            <Grid item container spacing={3}>
                <Grid item xs>
                    <SearchBarTags
                        onChange={handleSearchChange}
                        optionTags={[]}
                        label="Filter by tags"
                        limitTags={2}
                        value={tags}
                    />
                </Grid>
                <Grid item>
                    <FormControl sx={{ minWidth: 100 }}>
                        <InputLabel id="select-sort-label">Sort by</InputLabel>
                        <Select
                            labelId="select-sort-label"
                            id="select-sort"
                            variant="outlined"
                            value={sort}
                            label="Sort by"
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value={1}>Hot</MenuItem>
                            <MenuItem value={2}>New</MenuItem>
                            <MenuItem value={3}>Best</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid item container spacing={3}>
                {posts.map((post) => (
                    <Post
                        key={post.title}
                        {...post}
                        onChipClick={handleTagClick}
                    />
                ))}
            </Grid>
            <Grid
                item
                container
                spacing={3}
                justifyContent={"center"}
                sx={{ marginTop: "auto" }}
            >
                <Pagination
                    count={count}
                    page={page}
                    shape="rounded"
                    onChange={handlePageChange}
                />
            </Grid>
        </Grid>
    );
}
