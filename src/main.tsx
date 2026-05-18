import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#e8888e",
          colorBgBase: "#1a1028",
          colorBgContainer: "#231d3a",
          colorBorder: "rgba(180, 160, 220, 0.15)",
          borderRadius: 8,
          fontFamily: '"PingFang SC", "Noto Sans SC", system-ui, sans-serif',
        },
      }}
    >
      <HashRouter>
        <App />
      </HashRouter>
    </ConfigProvider>
  </React.StrictMode>
);
