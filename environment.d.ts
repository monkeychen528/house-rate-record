declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_EDGE_CONFIG: string;
            NEXT_PUBLIC_KV_REST_API_TOKEN: string;
            NEXT_PUBLIC_KV_REST_API_URL: string;
            NODE_ENV: 'development' | 'production';
        }
    }
}

export { }