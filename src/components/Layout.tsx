import { Outlet, useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { path: "/", label: "焰火", icon: "🔥" },
  { path: "/analyze", label: "表达", icon: "✨" },
  { path: "/history", label: "轨迹", icon: "📋" },
  { path: "/profile", label: "我的", icon: "🧿" },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = location.pathname;

  const isTabPage = tabs.some((t) => t.path === currentTab);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Desktop top nav */}
      <header
        className="desktop-nav"
        style={{
          display: "none",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(26, 16, 40, 0.94)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(180, 160, 220, 0.15)",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            height: 56,
            gap: 8,
          }}
        >
          <span
            style={{ fontSize: 24, marginRight: 24, cursor: "pointer" }}
            className="flame"
            onClick={() => navigate("/")}
          >
            🔥
          </span>
          {tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              style={{
                background: "none",
                border: "none",
                color: currentTab === tab.path ? "#e8888e" : "#a69ec0",
                fontSize: 15,
                fontWeight: currentTab === tab.path ? 600 : 400,
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: 8,
                transition: "color 0.2s",
              }}
            >
              <span style={{ fontSize: 20, marginRight: 4 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main
        style={{
          flex: 1,
          maxWidth: 800,
          width: "100%",
          margin: "0 auto",
          padding: isTabPage ? "24px 16px 100px" : "24px 16px 100px",
        }}
      >
        <Outlet />
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        className="mobile-tabs"
        style={{
          display: "flex",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(22, 14, 34, 0.97)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(180, 160, 220, 0.2)",
          paddingBottom: "env(safe-area-inset-bottom, 0)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              color: currentTab === tab.path ? "#e8888e" : "#a69ec0",
              fontSize: 12,
              fontWeight: currentTab === tab.path ? 700 : 400,
              cursor: "pointer",
              padding: "10px 4px 14px",
              transition: "color 0.2s, text-shadow 0.2s",
              textShadow: currentTab === tab.path ? "0 0 12px rgba(232,136,142,0.4)" : "none",
            }}
          >
            <span style={{ fontSize: 28, marginBottom: 3, lineHeight: 1 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .mobile-tabs { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-tabs { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
