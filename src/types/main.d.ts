export { }

declare global {
  interface JWTPayloadType {
    id: string;
    username: string
    name: string
    email: string
  };
}