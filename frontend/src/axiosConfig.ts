import axios from "axios";

export const createApi = (accessToken: string) => {
  return axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
