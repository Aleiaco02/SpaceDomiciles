import { Router } from "express";
import { index, show, store, update, destroy } from "../controllers/InvoicesStackController.js";

const InvoicesStackController = Router();

InvoicesStackController.get('/', index);
InvoicesStackController.get('/:id', show);
InvoicesStackController.post('/', store);
InvoicesStackController.put('/:id', update);
InvoicesStackController.delete('/:id', destroy);

export default InvoicesStackController;
