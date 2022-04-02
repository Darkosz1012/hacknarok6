export type PostType = {
    title: string;
    content: string;
    createdBy: {
        username: string;
        userId: string;
    };
    createdAt?: string;
    coords: {
        longitude: number;
        latitude: number;
    };
    tags: {
        name: string;
    }[];
};
