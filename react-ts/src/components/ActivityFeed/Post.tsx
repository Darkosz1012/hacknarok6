import { Grid } from "@mui/material";
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

type PostProps = {
    title: string;
    body: string;
    date: Date;
    tags: string[];
    author: string;
    onChipClick?: (tag: string) => void;
};
export default function Post({
    title,
    body,
    date,
    tags,
    author,
    ...props
}: PostProps) {
    return (
        <Grid item md={6} sm={12}>
            <Card>
                <CardHeader
                    avatar={<ProfileAvatar username={author} />}
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={author}
                    subheader={date.toLocaleString()}
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
                        {body}
                    </Typography>

                    <Typography
                        sx={{ fontSize: 14 }}
                        color="text.primary"
                        gutterBottom
                    >
                        {tags.map((tag) => (
                            <Chip
                                variant="outlined"
                                label={tag}
                                key={tag}
                                size="small"
                                sx={{ marginRight: "0.5rem" }}
                                onClick={() => {
                                    console.log("clicked", tag);
                                    props.onChipClick?.(tag);
                                }}
                            />
                        ))}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        </Grid>
    );
}
