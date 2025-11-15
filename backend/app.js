import express, { Router } from "express";
import cors from "cors";
import 'dotenv/config';
import notFound from "./middlewares/notFound.js";
import errorsHandler from "./middlewares/errorServer.js";

//controllers
import CustomersRouter from "./routers/CustomersRouter.js";
import InvoicesStackRouter from "./routers/InvoicesStackRouter.js";

const app = express();

// middleware bodyparser
app.use(express.json());

// middleware static
app.use(express.static('public'));

// middleware cors
app.use(cors({
    origin: process.env.FE_APP
}));

app.get("/api", (req, res) => {
    res.send("Server ok!");
});

// uso del router
app.use("/api/customers", CustomersRouter);

app.use("/api/invoices_stack", InvoicesStackRouter);

// utilizzo middleware gestione errori
app.use(errorsHandler);
app.use(notFound);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});