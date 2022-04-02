import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon/ListItemIcon";
import SendIcon from "@mui/icons-material/Send";
import BaseActivityFeed from "./ActivityFeed/ActivityFeed";
import MainMap from "./MainMap";
import {
    Link as RouterLink,
    Route,
    BrowserRouter as Router,
    useLocation,
} from "react-router-dom";

import {
    CssBaseline,
    Drawer as MuiDrawer,
    Box,
    AppBar as MuiAppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    Container,
    ListItem,
} from "@mui/material";

import {
    Home as HomeIcon,
    GroupAdd as GroupAddIcon,
    AccountCircle as AccountCircleIcon,
    ConnectWithoutContact as ConnectWithoutContactIcon,
} from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSignOut } from "react-auth-kit";

function Copyright(props: any) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        ...(!open && {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9),
            },
        }),
    },
}));

const ActivityFeed = styled(BaseActivityFeed)({});

const mdTheme = createTheme();

function DashboardContent() {
    const { pathname } = useLocation();
    const [open, setOpen] = React.useState(true);
    const signOut = useSignOut();
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Router>
                <Box sx={{ display: "flex" }}>
                    <CssBaseline />
                    <AppBar position="absolute" open={open}>
                        <Toolbar
                            sx={{
                                pr: "24px", // keep right padding when drawer closed
                            }}
                        >
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                onClick={toggleDrawer}
                                sx={{
                                    marginRight: "36px",
                                    ...(open && { display: "none" }),
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                sx={{ flexGrow: 1 }}
                            >
                                Dashboard
                            </Typography>
                            <IconButton color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    <Drawer variant="permanent" open={open}>
                        <Toolbar
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                px: [1],
                            }}
                        >
                            <IconButton onClick={toggleDrawer}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <List component="nav">
                            <ListItem>
                                <ListItemButton component={RouterLink} to="/">
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Map" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    component={RouterLink}
                                    to="/nearby"
                                >
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Nearby" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton onClick={signOut}>
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Logout" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Drawer>
                    <Box
                        component="main"
                        sx={{
                            backgroundColor: (theme) =>
                                theme.palette.mode === "light"
                                    ? theme.palette.grey[100]
                                    : theme.palette.grey[900],
                            flexGrow: 1,
                            height: "100vh",
                            overflow: "auto",
                        }}
                    >
                        <Box sx={{ marginTop: "4rem" }}>
                            <Route
                                exact
                                path="/nearby"
                                component={ActivityFeed}
                            />
                            <Route path="/" component={MainMap} />
                        </Box>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
}

export default function Dashboard() {
    return <DashboardContent />;
}
