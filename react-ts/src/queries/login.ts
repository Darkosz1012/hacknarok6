import { gql } from "@apollo/client";

export const SIGN_IN_MUTATION = gql`
    mutation SignIn($usernameOrEmail: String!, $password: String!) {
        signIn(usernameOrEmail: $usernameOrEmail, password: $password) {
            username
            accessToken
            refreshToken
        }
    }
`;

export const SIGN_UP_MUTATION = gql`
    mutation SignUp($username: String!, $email: String!, $password: String!) {
        signUp(username: $username, email: $email, password: $password) {
            username
            accessToken
            refreshToken
        }
    }
`;
