declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: number;
    DB_NAME: string;
    DB_PASSWORD: string;
    DB_USERNAME: string;
    DB_CLUSTER_URL: string;
    JWT_KEY: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    FRONTEND_URLS: string;
  }
}
