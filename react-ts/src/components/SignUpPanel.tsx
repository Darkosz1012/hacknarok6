import React, { useState } from "react";

import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Alert,
} from "@mui/material";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { useSignIn } from "react-auth-kit";
import { Redirect } from "react-router";

import { SIGN_UP_MUTATION } from "../queries/login";

export default function SignUp() {
    const signIn = useSignIn();
    const [redirect, setRedirect] = useState(false);
    const [mutateFunction, { error }] = useMutation(SIGN_UP_MUTATION, {
        onCompleted: (data) => {
            console.log(data); // the response
            data = data.signUp;
            if (
                signIn({
                    token: data.accessToken,
                    expiresIn: 60,
                    tokenType: "Bearer",
                    authState: {},
                    // refreshToken: data.refreshToken, // Only if you are using refreshToken feature
                    // refreshTokenExpireIn: 60,
                })
            ) {
                setRedirect(true);
            } else {
                //Throw error
            }
        },
        onError: (error) => {
            console.log(error); // the error if that is the case
        },
    });

    if (redirect) return <Redirect to="/" />;

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // eslint-disable-next-line no-console
        console.log({
            email: data.get("email"),
            password: data.get("password"),
        });
        mutateFunction({
            variables: {
                username: data.get("username"),
                email: data.get("email"),
                password: data.get("password"),
            },
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                {error && <Alert severity="error">{error.message}</Alert>}
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                autoComplete="given-name"
                                name="username"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
