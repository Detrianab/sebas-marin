const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createLovableAiGatewayRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  let resolveRunId: (value: string | undefined) => void = () => {};
  let resolved = false;
  const ready = new Promise<string | undefined>((resolve) => { resolveRunId = resolve; });
  const publish = (value?: string) => {
    if (!runId && value?.trim()) runId = value.trim();
    if (!resolved) { resolved = true; resolveRunId(runId); }
  };
  if (runId) publish(runId);
  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      try {
        const response = await fetch(input, { ...init, headers });
        publish(response.headers.get(RUN_ID_HEADER) ?? undefined);
        return response;
      } catch (error) { publish(); throw error; }
    },
    getRunId: () => runId,
    waitForRunId: () => runId ? Promise.resolve(runId) : ready,
  };
}

export function getLovableAiGatewayRunId(request: Request) {
  return request.headers.get(RUN_ID_HEADER)?.trim() || undefined;
}

export function gatewayHeaders(init?: HeadersInit) {
  const headers = new Headers(init);
  headers.set("Access-Control-Expose-Headers", RUN_ID_HEADER);
  return headers;
}

export async function withRunId(response: Response, gateway: ReturnType<typeof createLovableAiGatewayRunIdFetch>) {
  if (!response.body) return response;
  const reader = response.body.getReader();
  const first = reader.read();
  const runId = await gateway.waitForRunId();
  const headers = gatewayHeaders(response.headers);
  if (runId) headers.set(RUN_ID_HEADER, runId);
  const body = new ReadableStream({
    async start(controller) {
      try {
        const chunk = await first;
        if (!chunk.done) controller.enqueue(chunk.value);
        while (!chunk.done) {
          const next = await reader.read();
          if (next.done) break;
          controller.enqueue(next.value);
        }
        controller.close();
      } catch (error) { controller.error(error); }
    },
    cancel: (reason) => reader.cancel(reason),
  });
  return new Response(body, { status: response.status, headers });
}