export type Post = {
    id: string;
    content: string;
    data?: { id: string; content: string; created_at: Date } | null;
    created_at: Date;
}

export type ResponsePosts = {
    mutate: (data: Post) => Promise<void>;
    id?: string;
    data?: Post | null;
    loading: boolean;
    error: Error | null;
    message: string;
    status: string;
}