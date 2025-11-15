// import di express e proprietá di routing
import { Router } from "express";
import {
  index,
  show,
  store,
  update,
  patch,
  destroy,
} from "../controllers/certificatesController.js";
const certificatesRouter = Router();

// index
certificatesRouter.get("/", index);

// show
certificatesRouter.get("/:id", show);

// store
certificatesRouter.post("/", store);

// update
certificatesRouter.put("/:id", update);

// patch
certificatesRouter.patch("/:id", patch);

// delete
certificatesRouter.delete("/:id", destroy);

export default certificatesRouter;
