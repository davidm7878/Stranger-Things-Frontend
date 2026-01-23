import { Routes, Route } from "react-router";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Error404 from "./Error404";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<h1>Welcome to Stranger Things Academy</h1>} />
        <Route path="/teams" element={<h1>Teams</h1>} />
        <Route path="/players" element={<h1>Players</h1>} />
        <Route path="/account" element={<h1>Account</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
}

export default App;
