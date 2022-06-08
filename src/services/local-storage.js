export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {};
  return user;
};

export const putUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const putApiTokenToLocalStorage = (token) => {
  localStorage.setItem("api-token", token);
};

export const getApiTokenFromLocalStorage = () => {
  return localStorage.getItem("api-token");
};

export const clearUserDataFromLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("api-token");
};
