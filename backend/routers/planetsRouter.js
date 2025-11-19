import {Router} from "express";
import {index, showSingle, store, update, patch, destroy} from "../controllers/planetsController.js";

const router = Router();

router.get("/", index);
router.get("/single/:slug", showSingle);
router.post("/", store);
router.put("/:id", update);
router.patch("/:id", patch);
router.delete("/:id", destroy);

export default router;