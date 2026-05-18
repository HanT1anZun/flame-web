import api from "./client";

export const riskApi = {
  check: (text: string) =>
    api.post("/risk/check", { text }).then((r) => r.data),

  getHotline: () => api.get("/risk/hotline").then((r) => r.data),
};
