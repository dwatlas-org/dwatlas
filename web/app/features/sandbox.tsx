import { SearchSandbox } from "./sandbox/search/SearchSandbox";

export function Sandbox() {
  if (!import.meta.env.DEV) {
    throw new Error("Sandbox is not available outside of development mode");
  }

  return (
    <section>
      <h3 className="text-2xl font-bold">dev sandbox</h3>
      <p>
        use this space for running experiments before estimating/implementing
        them.
      </p>

      <hr className="my-12" />

      <SearchSandbox />
    </section>
  );
}
