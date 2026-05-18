import api from "./client";

export const reportApi = {
  generate: (period: "weekly" | "monthly" = "weekly") =>
    api.post("/report/generate", { period }).then((r) => r.data),

  list: (page = 1, pageSize = 10) =>
    api.get("/report/", { params: { page, page_size: pageSize } }).then((r) => r.data),

  getDetail: (id: string) => api.get(`/report/${id}`).then((r) => r.data),
};
