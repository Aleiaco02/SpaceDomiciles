import { Router } from "express";
import { index, show, store, update, patch, destroy } from "../controllers/paymentsController.js";

const paymentsRouter = Router();

paymentsRouter.get("/", index);
paymentsRouter.get("/:id", show);
paymentsRouter.post("/", store);
paymentsRouter.put("/:id", update);
paymentsRouter.patch("/:id", patch);
paymentsRouter.delete("/:id", destroy);

export default paymentsRouter;