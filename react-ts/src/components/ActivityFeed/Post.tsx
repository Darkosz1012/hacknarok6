import { Box, Grid } from "@mui/material";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ProfileAvatar from "../../util/ProfileAvatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import { PostType } from "../../types/PostType";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import * as React from "react";
import { styled } from "@material-ui/core";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useMutation, useQuery } from "@apollo/client";
import { Update } from "@mui/icons-material";
import { UPDATE_POST_LIKE } from "../../queries/posts";

interface PostProps extends PostType {
    onChipClick?: (tag: string) => void;
}
export default function Post({
    title,
    content,
    createdAt,
    tags,
    createdBy,
    iLike,
    iUnlike,
    likedByAggregate,
    ...props
}: PostProps) {
    const [rating, setRating] = React.useState(0);
    const [myRating, setMyRating] = React.useState<[boolean, boolean]>([
        iLike,
        iUnlike,
    ]);
    const [likeFunction, errors1] = useMutation(UPDATE_POST_LIKE, {
        variables: {
            update: {
                likedBy: [
                    {
                        connect: [
                            {
                                where: {
                                    node: {
                                        userId: 2,
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    });
    const [dislikeFunction, errors2] = useMutation(UPDATE_POST_LIKE, {
        variables: {
            update: {
                unlikedBy: [
                    {
                        connect: [
                            {
                                where: {
                                    node: {
                                        userId: 2,
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        },
    });
    const handlePostRating = (rating: string | null) => {
        console.log(rating);
        setMyRating(
            rating === "liked"
                ? [true, false]
                : rating === "disliked"
                ? [false, true]
                : [false, false]
        );
    };
    const RatingBootonGroup = styled(ToggleButtonGroup)(() => ({
        "&": {
            padding: "15px 0 15px 15px",
        },
        "& .MuiToggleButton-root": {
            padding: "0px",
            border: "none",
            backgroundColor: "transparent",
        },
    }));
    const PostCard = styled(Card)(() => ({
        "&": {
            display: "flex",
            justifyContent: "stretch",
        },
    }));
    const PostHeader = styled(CardHeader)(() => ({
        "&": {
            minHeight: 100,
        },
    }));
    return (
        <Grid item md={6} sm={12}>
            <PostCard>
                <RatingBootonGroup
                    orientation="vertical"
                    value={myRating[0] ? 1 : myRating[1] ? 0 : null}
                    exclusive
                    onChange={(_, value: string | null) =>
                        handlePostRating(value)
                    }
                >
                    <ToggleButton value="liked" aria-label="list">
                        <ArrowDropUpIcon
                            fontSize="large"
                            color={myRating[0] ? "success" : "disabled"}
                        />
                    </ToggleButton>
                    <Typography
                        sx={{
                            fontSize: "1rem",
                            textAlign: "center",
                        }}
                    >
                        {likedByAggregate.count}
                    </Typography>
                    <ToggleButton value="disliked" aria-label="module">
                        <ArrowDropDownIcon
                            fontSize="large"
                            color={myRating[1] ? "error" : "disabled"}
                        />
                    </ToggleButton>
                </RatingBootonGroup>
                <Box sx={{ flexGrow: 1 }}>
                    <PostHeader
                        avatar={<ProfileAvatar username={createdBy.username} />}
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={createdBy.username}
                        subheader={createdAt}
                    />
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: ".5rem",
                        }}
                    >
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.primary"
                            gutterBottom
                        >
                            {title}
                        </Typography>

                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                        >
                            {content}
                        </Typography>

                        <Box sx={{ fontSize: 14 }} color="text.primary">
                            {tags.map(({ name }) => (
                                <Chip
                                    variant="outlined"
                                    label={name}
                                    key={name}
                                    size="small"
                                    sx={{ marginRight: "0.5rem" }}
                                    onClick={() => {
                                        console.log("clicked", name);
                                        props.onChipClick?.call(null, name);
                                    }}
                                />
                            ))}
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Box>
            </PostCard>
        </Grid>
    );
}
