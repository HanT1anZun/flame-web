import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { useAnonymousLogin } from "./hooks/useAnonymousLogin";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Result from "./pages/Result";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Cbt from "./pages/Cbt";
import Crisis from "./pages/Crisis";

export default function App() {
  useAnonymousLogin();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cbt" element={<Cbt />} />
        <Route path="/crisis" element={<Crisis />} />
      </Route>
    </Routes>
  );
}
