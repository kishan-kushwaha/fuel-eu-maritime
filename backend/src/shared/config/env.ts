import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/fuel_eu_maritime",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
