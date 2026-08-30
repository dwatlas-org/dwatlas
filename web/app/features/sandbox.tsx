import { EChartsSandbox } from "./sandbox/echarts/EChartsSandbox";
import { RechartsSandbox } from "./sandbox/recharts/RechartsSandbox";
import { LeafletDrilldownMap } from "./sandbox/leaflet/LeafletDrilldownMap";
import { LeafletSandbox } from "./sandbox/leaflet/LeafletSandbox";

export function Sandbox() {
  if (!import.meta.env.DEV) {
    throw new Error("Sandbox is not available outside of development mode");
  }

  return (
    <section className="space-y-16">
      <div>
        <h3 className="text-2xl font-bold">dev sandbox</h3>

        <p>Comparison of chart libraries using the same dataset.</p>
      </div>

      <EChartsSandbox />

      <hr className="my-12" />

      <RechartsSandbox />

      <hr className="my-12" />

      <LeafletSandbox />
    </section>
  );
}
