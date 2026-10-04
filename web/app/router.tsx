import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./components/root-layout";
import { TopbarLayout } from "./components/topbar-layout";
import { SidebarLayout } from "./components/sidebar-layout";

import { AboutPage } from "./features/pages/AboutPage";
import { AnalysesPage } from "./features/pages/AnalysesPage";
import { AnalysisArticlePage } from "./features/pages/AnalysisArticlePage";
import { ContactPage } from "./features/pages/ContactPage";
import { DataTreePage } from "./features/pages/DataTreePage";
import { FAQPage } from "./features/pages/FAQPage";
import { GlossaryPage } from "./features/pages/GlossaryPage";
import { MethodologyPage } from "./features/pages/MethodologyPage";
import { ResearchesPage } from "./features/pages/ResearchesPage";

import { Index } from "./features/index";
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
          {
            path: "pages",
            children: [
              {
                path: "about",
                Component: AboutPage,
              },
              {
                path: "methodology",
                Component: MethodologyPage,
              },
              {
                path: "researches",
                Component: ResearchesPage,
              },
              {
                path: "data-tree",
                Component: DataTreePage,
              },
              {
                path: "analyses",
                Component: AnalysesPage,
              },
              {
                path: "analyses/:analysisId",
                Component: AnalysisArticlePage,
              },
              {
                path: "glossary",
                Component: GlossaryPage,
              },
              {
                path: "faq",
                Component: FAQPage,
              },
              {
                path: "contact",
                Component: ContactPage,
              },
            ],
          },
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
