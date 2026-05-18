import api from "./client";

export const cbtApi = {
  generate: (text: string) =>
    api.post("/cbt/generate", { text }).then((r) => r.data),

  getTemplates: (emotionType?: string, riskLevel?: string, page = 1, pageSize = 20) =>
    api
      .get("/cbt/templates", {
        params: { emotion_type: emotionType, risk_level: riskLevel, page, page_size: pageSize },
      })
      .then((r) => r.data),

  feedback: (recordId: string, rating: number, comment?: string) =>
    api.post("/cbt/feedback", { record_id: recordId, rating, comment }).then((r) => r.data),
};
