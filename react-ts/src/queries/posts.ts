import { gql } from "@apollo/client";

export const GET_POSTS_QUERY = gql`
    query Query($options: PostOptions, $where: PostWhere) {
        postsAggregate(where: $where) {
            count
        }
        posts(options: $options, where: $where) {
            title
            content
            createdBy {
                username
                userId
            }
            createdAt
            coords {
                longitude
                latitude
            }
            tags {
                name
            }
        }
    }
`;
