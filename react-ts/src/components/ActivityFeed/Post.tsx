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

interface PostProps extends PostType {
    onChipClick?: (tag: string) => void;
}
export default function Post({
    title,
    content,
    createdAt,
    tags,
    createdBy,
    ...props
}: PostProps) {
    return (
        <Grid item md={6} sm={12}>
            <Card>
                <CardHeader
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
            </Card>
        </Grid>
    );
}
