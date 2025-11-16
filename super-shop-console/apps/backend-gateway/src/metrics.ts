import promClient from "prom-client";

promClient.collectDefaultMetrics();

export const httpRequestHistogram = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "code"],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2],
});

export const issueCreatedCounter = new promClient.Counter({
  name: "issue_created_total",
  help: "Total number of customer issues created",
});


