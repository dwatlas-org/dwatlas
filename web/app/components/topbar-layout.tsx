import { Outlet, NavLink } from "react-router";
import { cn } from "@/lib/utils";

export function TopbarLayout() {
  return (
    <>
      <div className="typeset typeset-docs">
        <header className="w-full bg-[#F0F0F0]">
          <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href="/"
                className="no-underline text-xl font-bold tracking-tight text-stone-900"
              >
                DeliveryWorker
                <span className="text-orange-500 font-bold">Atlas</span>
              </a>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#264370]">
              <NavLink
                to="/"
                className={cn(({ isActive }: { isActive: boolean }) =>
                  isActive ? "font-bold" : "",
                )}
              >
                Home
              </NavLink>
              <NavLink
                to="/panels"
                className={cn(
                  ({ isActive }: { isActive: boolean }) =>
                    isActive ? "font-bold" : "",
                  "no-underline",
                )}
              >
                Data Panels
              </NavLink>
              <NavLink
                to="/about"
                className={cn(
                  ({ isActive }: { isActive: boolean }) =>
                    isActive ? "font-bold" : "",
                  "no-underline",
                )}
              >
                About
              </NavLink>
              <NavLink
                to="/register"
                className={cn(
                  ({ isActive }: { isActive: boolean }) =>
                    isActive ? "font-bold" : "",
                  "no-underline",
                )}
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className={cn(
                  ({ isActive }: { isActive: boolean }) =>
                    isActive ? "font-bold" : "",
                  "no-underline",
                )}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className={cn(
                  ({ isActive }: { isActive: boolean }) =>
                    isActive ? "font-bold" : "",
                  "no-underline",
                )}
              >
                Sign Up
              </NavLink>
              {/*<a href="#" className="hover:text-[#264370]-900 transition-colors">Sobre nós</a>
            <a href="#" className="hover:text-blue-900 transition-colors">Pesquisas</a>
            <a href="#" className="hover:text-blue-900 transition-colors">Metodologia</a>
            <a href="#" className="hover:text-blue-900 transition-colors">Árvore de dados</a>
            <a href="#" className="hover:text-blue-900 transition-colors">Análises</a>
            <a href="#" className="hover:text-blue-900 transition-colors">Glossário</a>
            <a href="#" className="hover:text-blue-900 transition-colors">FAQ</a>
            <a href="#" className="hover:text-blue-900 transition-colors">Contato</a>*/}
            </nav>

            <div className="flex items-center gap-4">
              <div className="relative">
                <select className="appearance-none bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer">
                  <option>PT-BR</option>
                  <option>EN</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-500">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
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
