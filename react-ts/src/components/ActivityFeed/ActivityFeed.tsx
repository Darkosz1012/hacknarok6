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
import { PostType } from "../../types/PostType";
import { useQuery, gql } from "@apollo/client";
import { GET_POSTS_QUERY } from "../../queries/posts";
type postsProps = {
    posts: PostType[];
};
export default function ActivityFeed() {
    const POSTS_PER_PAGE = 1;
    const [page, setPage] = React.useState(1);
    const [tags, setTags] = React.useState<string[]>([]);
    const [posts, setPosts] = React.useState<any[]>([]);
    const { loading, error } = useQuery(GET_POSTS_QUERY, {
        variables: {
            options: {
                limit: POSTS_PER_PAGE,
                offset: (page - 1) * POSTS_PER_PAGE,
            },
            where: {
                tags_SOME: {
                    ...(tags.length
                        ? {
                              name_IN: tags,
                          }
                        : { name_NOT_IN: tags }),
                },

                ...tags.reduce((acc, curr) => {
                    return {
                        OR: [
                            {
                                title_CONTAINS: curr,
                                OR: [acc],
                            },
                        ],
                    };
                }, {}),
            },
        },

        onCompleted: (data) => {
            console.log(data);
            setPosts(data.posts);
            setCount(data.postsAggregate.count);
        },
    });
    const [count, setCount] = React.useState(10);
    const [sort, setSort] = React.useState("1");

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
        setPage(1);
    };
    const handleSearchChange = (value: string[] | null) => {
        setTags(value ?? []);
        setPage(1);
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
                {!loading &&
                    !error &&
                    posts.map((post, index) => (
                        <Post
                            key={index}
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
