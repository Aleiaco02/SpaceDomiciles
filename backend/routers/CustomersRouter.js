import { Router } from "express";
import { index, show, store, update, destroy } from "../controllers/CustomersController.js";

const CustomersRouter = Router();

CustomersRouter.get('/', index);
CustomersRouter.get('/:id', show);
CustomersRouter.post('/', store);
CustomersRouter.put('/:id', update);
CustomersRouter.delete('/:id', destroy);


export default CustomersRouter;