import { NavLink } from "react-router";

import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  return (
    <header id="navbar">
      <NavLink id="brand" to="/">
        <p>Stranger Things Academy</p>
      </NavLink>
      <nav>
        <NavLink to="/teams">Teams</NavLink>
        <NavLink to="/players">Players</NavLink>
        {token ? (
          <>
            <NavLink to="/account">Account</NavLink>
            <button onClick={() => logout()}>Log out</button>
          </>
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
      </nav>
    </header>
  );
}
