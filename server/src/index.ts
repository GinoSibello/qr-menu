import express from "express";
import cors from "cors";
import { createServer } from "http";
import { env } from "./env";
import { initWs } from "./ws";
import { menuRouter } from "./routes/menu";
import { tablesRouter } from "./routes/tables";
import { ordersRouter } from "./routes/orders";
import { adminRouter } from "./routes/admin";
import { authRouter } from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/menu", menuRouter);
app.use("/api/tables", tablesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);
app.use("/api", adminRouter);

const httpServer = createServer(app);
initWs(httpServer);

httpServer.listen(env.port, () => {
  console.log(`API escuchando en http://localhost:${env.port}`);
});
