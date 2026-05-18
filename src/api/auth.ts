import api from "./client";

export const authApi = {
  anonymous: (deviceId: string) => {
    const fd = new URLSearchParams();
    fd.append("device_id", deviceId);
    return api
      .post("/auth/anonymous", fd, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((r) => r.data);
  },

  register: (username: string, password: string) => {
    const fd = new URLSearchParams();
    fd.append("username", username);
    fd.append("password", password);
    return api
      .post("/auth/register", fd, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((r) => r.data);
  },

  login: (username: string, password: string) => {
    const fd = new URLSearchParams();
    fd.append("username", username);
    fd.append("password", password);
    return api
      .post("/auth/login", fd, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((r) => r.data);
  },
};
