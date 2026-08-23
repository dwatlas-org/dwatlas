import { Outlet, NavLink } from "react-router";

export function Root() {
  return (
    <>
      <header className="flex flex-row p-6 gap-5">
        <h2 className="text-2xl font-bold">DeliveryWorkerAtlas</h2>
        <nav className="flex gap-4 mt-1.5">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/panels"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Data Panels
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            About
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Sign Up
          </NavLink>
        </nav>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </>
  );
}
