// import di express e proprietá di routing
import { Router } from "express";
import {
  index,
  show,
  store,
  update,
  patch,
  destroy,
} from "../controllers/invoicesController.js";
const invoicesRouter = Router();

// index
invoicesRouter.get("/", index);

// show
invoicesRouter.get("/:id", show);

// store
invoicesRouter.post("/", store);

// update
invoicesRouter.put("/:id", update);

// patch
invoicesRouter.patch("/:id", patch);

// delete
invoicesRouter.delete("/:id", destroy);

export default invoicesRouter;
