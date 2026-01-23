import { Outlet } from "react-router";

import Navbar from "./Navbar";
import "./layout.css";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
