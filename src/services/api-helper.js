import { getApiTokenFromLocalStorage } from "./local-storage";

export const getApiBaseUrl = (apiPath) => {
  const url = `${
    process.env.REACT_APP_API_URL ?? "http://localhost:8000/api/"
  }${apiPath}/`;
  return url;
};

export const addAuthHeader = (headers) => {
  const token = getApiTokenFromLocalStorage();
  if (token) {
    headers.set("Authorization", `Token ${token}`);
  }
  return headers;
};
