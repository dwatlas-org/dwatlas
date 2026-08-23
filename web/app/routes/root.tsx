import { Outlet, NavLink } from "react-router";

export function RootRoute() {
  return (
    <div className="p-6">
      <nav className="flex gap-4 mb-6">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          About
        </NavLink>
        <NavLink
          to="/panels"
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Panels
        </NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
