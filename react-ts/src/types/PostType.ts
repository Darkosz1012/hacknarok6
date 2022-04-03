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
    img: string;
    tags: {
        name: string;
    }[];
    grade: number;
    iLike: boolean;
    iUnlike: boolean;
};
