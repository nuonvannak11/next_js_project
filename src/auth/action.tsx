export const setUser = (user: any) => ({
  type: "SET_USER",
  payload: user,
});

const clearCookie = () => {
  document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
};

export const logout = () => {
  clearCookie();
  return {
    type: "LOGOUT",
  };
};
