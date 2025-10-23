export type SecurityDetails = {
  password?: string;
  username?: string;
  token?: {
    token_type?: string;
    access_token: string;
  };
  client_id?: string;
  client_secret?: string;
  scopes?: string;
};
