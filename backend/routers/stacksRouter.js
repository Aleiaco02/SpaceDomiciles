import { Router } from "express";
import {
  index,
  showSingle,
  showPlanetsStacks,
  store,
  update,
  destroy,
} from "../controllers/stacksControllers.js";

const router = Router();

router.get("/", index);
router.get("/planet/:slug", showPlanetsStacks);
router.get("/:slug", showSingle);
router.post("/", store);
router.put("/:id", update);
router.delete("/:id", destroy);

export default router;
