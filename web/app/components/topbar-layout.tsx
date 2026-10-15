import { Outlet, NavLink } from "react-router";
import { cn } from "@/lib/utils";

export function TopbarLayout() {
  return (
    <>
      <div className="typeset typeset-docs">
        <header className="w-full bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NavLink
                to="/"
                className="no-underline text-xl font-bold tracking-tight text-slate-900"
              >
                DeliveryWorker
                <span className="text-orange-500 font-bold">Atlas</span>
              </NavLink>
            </div>

            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#1e3a8a]">
              <NavLink
                to="/pages/about"
                className={({ isActive }) =>
                  cn(
                    "no-underline transition-colors hover:text-slate-900",
                    isActive ? "text-slate-900 font-bold" : "text-[#1e3a8a]",
                  )
                }
              >
                About us
              </NavLink>
              <NavLink
                to="/pages/researches"
                className={({ isActive }) =>
                  cn(
                    "no-underline transition-colors hover:text-slate-900",
                    isActive ? "text-slate-900 font-bold" : "text-[#1e3a8a]",
                  )
                }
              >
                Research
              </NavLink>
              <NavLink
                to="/pages/methodology"
                className={({ isActive }) =>
                  cn(
                    "no-underline transition-colors hover:text-slate-900",
                    isActive ? "text-slate-900 font-bold" : "text-[#1e3a8a]",
                  )
                }
              >
                Methodology
              </NavLink>
              <NavLink
                to="/pages/data-tree"
                className={({ isActive }) =>
                  cn(
                    "no-underline transition-colors hover:text-slate-900",
                    isActive ? "text-slate-900 font-bold" : "text-[#1e3a8a]",
                  )
                }
              >
                Data tree
              </NavLink>
              <NavLink
                to="/pages/analyses"
                className={({ isActive }) =>
                  cn(
                    "no-underline transition-colors hover:text-slate-900",
                    isActive ? "text-slate-900 font-bold" : "text-[#1e3a8a]",
                  )
                }
              >
                Analyses
              </NavLink>
              <NavLink
                to="/pages/glossary"
                className={({ isActive }) =>
                  cn(
                    "no-underline transition-colors hover:text-slate-900",
                    isActive ? "text-slate-900 font-bold" : "text-[#1e3a8a]",
                  )
                }
              >
                Glossary
              </NavLink>
              <NavLink
                to="/pages/faq"
                className={({ isActive }) =>
                  cn(
                    "no-underline transition-colors hover:text-slate-900",
                    isActive ? "text-slate-900 font-bold" : "text-[#1e3a8a]",
                  )
                }
              >
                FAQ
              </NavLink>
              <NavLink
                to="/pages/contact"
                className={({ isActive }) =>
                  cn(
                    "no-underline transition-colors hover:text-slate-900",
                    isActive ? "text-slate-900 font-bold" : "text-[#1e3a8a]",
                  )
                }
              >
                Contact
              </NavLink>
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="appearance-none bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold rounded-md py-1.5 pl-3 pr-7 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer transition-colors">
                  <option value="EN-GB">EN-GB</option>
                  <option value="PT-BR">PT-BR</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="w-full bg-[#1A2744] text-stone-300">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-start items-start gap-12 pb-12 border-b border-white/10">
              <div className="max-w-xs">
                <span className="text-xl font-bold tracking-tight text-white">
                  DeliveryWorker
                  <span className="text-orange-500 font-bold">Atlas</span>
                </span>
                <p className="mt-4 text-xs text-white leading-relaxed">
                  Dados e pesquisa sobre trabalhadores de entrega por
                  aplicativo. Aberto, livre e reutilizável.
                </p>
              </div>

              <div className="flex flex-wrap pt-11 gap-x-15 gap-y-4 text-xs font-medium text-white">
                <a
                  href="#"
                  className="no-underline hover:text-white transition-colors"
                >
                  CONTATO
                </a>
                <a
                  href="#"
                  className="no-underline hover:text-white transition-colors"
                >
                  Equipe
                </a>
                <a
                  href="#"
                  className="no-underline hover:text-white transition-colors"
                >
                  Feedback
                </a>
                <a
                  href="#"
                  className="no-underline hover:text-white transition-colors"
                >
                  Imprensa
                </a>
                <a
                  href="#"
                  className="no-underline hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-white gap-4">
              <p>2026 DeliveryWorkerAtlas - Dados sob licença CC BY 4.0.</p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="no-underline hover:text-stone-300 transition-colors"
                >
                  Política de privacidade
                </a>
                <a
                  href="#"
                  className="no-underline hover:text-stone-300 transition-colors"
                >
                  Impresso
                </a>
                <a
                  href="#"
                  className="no-underline hover:text-stone-300 transition-colors"
                >
                  Acessibilidade
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
