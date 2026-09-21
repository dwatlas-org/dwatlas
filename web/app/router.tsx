import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./components/root-layout";
import { TopbarLayout } from "./components/topbar-layout";
import { SidebarLayout } from "./components/sidebar-layout";
import { Index } from "./features/index";
// import { About } from "./routes/about"
import { ErrorBoundary } from "./features/error";
import { Panel } from "./features/panel";
import { Signup, signupAction } from "./features/signup";
import { Registration, requestAction } from "./features/registration";
import { Sandbox } from "./features/sandbox";
import { defaultPanelSlug } from "./lib/panels";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        Component: TopbarLayout,
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
            path: "signup",
            Component: Signup,
            action: signupAction,
          },
          {
            path: "register",
            Component: Registration,
            action: requestAction,
          },
          {
            path: "sandbox",
            children: [
              {
                index: true,
                Component: Sandbox,
              },
            ],
          },
        ],
      },
      {
        path: "panels",
        Component: SidebarLayout,
        children: [
          {
            index: true,
            Component: () => (
              <Navigate to={`/panels/${defaultPanelSlug}`} replace />
            ),
          },
          {
            path: ":slug",
            Component: Panel,
          },
        ],
      },
    ],
  },
]);
