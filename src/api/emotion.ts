import api from "./client";

export const emotionApi = {
  analyze: (text?: string, imageFile?: File) => {
    const fd = new FormData();
    if (text) fd.append("text", text);
    if (imageFile) fd.append("image", imageFile);
    return api.post("/emotion/analyze", fd).then((r) => r.data);
  },

  analyzeText: (text: string) => {
    const fd = new URLSearchParams();
    fd.append("text", text);
    return api
      .post("/emotion/analyze-text", fd, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
      .then((r) => r.data);
  },

  getHistory: (page = 1, pageSize = 20) =>
    api
      .get("/emotion/history", { params: { page, page_size: pageSize } })
      .then((r) => r.data),

  getTrend: (days = 30) =>
    api.get("/emotion/trend", { params: { days } }).then((r) => r.data),

  getRecord: (id: string) =>
    api.get(`/emotion/${id}`).then((r) => r.data),
};
