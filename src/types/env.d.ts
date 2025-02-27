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
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    CLIENT_REFRESH_TOKEN: string;
    USER_EMAIL: string;
    REDIRECT_URI: string;
    CLIENT_ID2: string;
    CLIENT_SECRET2: string;
    REDIRECT_LINK_2: string;
    FROM_EMAIL: string;
    APP_PASSWORD: string;
  }
}
