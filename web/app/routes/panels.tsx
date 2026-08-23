import {
  useLoaderData,
  useFetcher,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";

type Panel = {
  id: string;
  title: string;
};

export async function panelsLoader(): Promise<Panel[]> {
  return [
    { id: "1", title: "Metrics Panel" },
    { id: "2", title: "System Logs" },
  ];
}

export async function panelsAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const title = formData.get("title");

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Title is required" };
  }

  return { success: true, newPanel: { id: Date.now().toString(), title } };
}

export function PanelsRoute() {
  const panels = useLoaderData<typeof panelsLoader>();
  const fetcher = useFetcher<typeof panelsAction>();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Panels Management</h2>

      <ul className="list-disc pl-5 mb-4">
        {panels.map((panel) => (
          <li key={panel.id}>{panel.title}</li>
        ))}
        {fetcher.data?.newPanel && (
          <li className="text-green-600">
            {fetcher.data.newPanel.title} (Added)
          </li>
        )}
      </ul>

      <fetcher.Form method="post" className="flex gap-2">
        <input
          name="title"
          placeholder="Panel title"
          defaultValue=""
          className="border p-1 rounded"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="border px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Panel"}
        </button>
        {fetcher.data?.error && (
          <span className="text-red-600">{fetcher.data.error}</span>
        )}
      </fetcher.Form>
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
