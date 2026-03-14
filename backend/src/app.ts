import cors from "cors";
import express from "express";
import { env } from "./shared/config/env.js";

import complianceRoutes from "./adapters/inbound/http/routes/complianceRoutes.js";
import routeRoutes from "./adapters/inbound/http/routes/routeRoutes.js";
import bankingRoutes from "./adapters/inbound/http/routes/bankingRoutes.js";
import poolRoutes from "./adapters/inbound/http/routes/poolRoutes.js";

export const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/routes", routeRoutes);
app.use("/compliance", complianceRoutes);
app.use("/banking", bankingRoutes);
app.use("/pools", poolRoutes);