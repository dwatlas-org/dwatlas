import { createBrowserRouter } from "react-router";
import { Root } from "./features/root";
import { Index } from "./features/index";
// import { About } from "./routes/about"
import { ErrorBoundary } from "./features/error";
import { Panels, panelsLoader } from "./features/panels";
import { Signup, signupAction } from "./features/signup";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        index: true,
        Component: Index,
      },
      // {
      //   path: "about",
      //   Component: About,
      // },
      {
        path: "panels",
        Component: Panels,
        loader: panelsLoader,
      },
      {
        path: "signup",
        Component: Signup,
        action: signupAction,
      },
    ],
  },
]);
