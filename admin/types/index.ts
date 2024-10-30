export type User = {
  _id: string;
  name: string;
  surname: string;
  password: string;
  email: string;
  confirmPassword: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
};


export type LoginType = {
    email: string;
    password: string;
}