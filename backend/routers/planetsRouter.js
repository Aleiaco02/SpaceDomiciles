import {Router} from "express";
import {index, show, store, update, patch, destroy} from "../controllers/planetsController.js";

const planetsRouter = Router();

planetsRouter.get("/", index);
planetsRouter.get("/:id", show);
planetsRouter.post("/", store);
planetsRouter.put("/:id", update);
planetsRouter.patch("/:id", patch);
planetsRouter.delete("/:id", destroy);

export default planetsRouter;