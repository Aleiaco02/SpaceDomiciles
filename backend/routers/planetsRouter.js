import {Router} from "express";
import {index,show,store,update,patch,destroy} from "../controllers/planetsController.js";

const router = Router();

router.get("/", index);
router.get("/:slug", show);
router.post("/", store);
router.put("/:id", update);
router.patch("/:id", patch);
router.delete("/:id", destroy);

export default router;