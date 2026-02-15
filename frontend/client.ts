import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "ta87y5fo",
  dataset: "production",
  useCdn: false,
  apiVersion: "2025-11-09",
});
