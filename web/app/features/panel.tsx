import {
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";

type Panel = {
  id: number;
  topic: string;
  metrics: {
    name: string;
    value: number | string;
  }[];
  graph: {};
};

export async function panelsLoader(): Promise<Panel[]> {
  return [
    {
      id: 1,
      topic: "sociodemographic profile",
      metrics: [
        { name: "total users", value: 200 },
        { name: "males", value: 100 },
        { name: "females", value: 100 },
      ],
      graph: {},
    },
    {
      id: 2,
      topic: "vehicles and platforms",
      metrics: [
        { name: "scooters", value: 300 },
        { name: "bikes", value: 200 },
      ],
      graph: {},
    },
  ];
}

export function Panel() {
  const panels = useLoaderData<typeof panelsLoader>();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Data Panels</h2>

      <ul className="list-disc pl-5 mb-4">
        {panels.map((panel) => (
          <div key={panel.id}>
            <h4 className="font-bold">{panel.topic}</h4>
            <ul className="list-disc pl-5 mb-4">
              {panel.metrics.map((metric) => (
                <li key={metric.name}>
                  {metric.name}: {metric.value}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="text-red-600">
        <h3 className="font-bold">Error {error.status}</h3>
        <p>{error.statusText || error.data}</p>
      </div>
    );
  }

  return (
    <div className="text-red-600">
      <h3 className="font-bold">Unexpected Error</h3>
      <p>
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </p>
    </div>
  );
}
