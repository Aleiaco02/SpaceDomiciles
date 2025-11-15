import express, { Router } from "express";
import cors from "cors";

import "dotenv/config";
import notFound from "./middlewares/notFound.js";
import errorsHandler from "./middlewares/errorServer.js";

// import router;
import certificatesRouter from "./routers/certificatesRouter.js";
import galaxiesRouter from "./routers/galaxiesRouter.js";
import stacksRouter from "./routers/stacksRouter.js";
import CustomersRouter from "./routers/CustomersRouter.js";
import InvoicesStackRouter from "./routers/InvoicesStackRouter.js";
import invoicesRouter from "./routers/invoiceRouter.js";

const app = express();

// middleware bodyparser
app.use(express.json());

// middleware static
app.use(express.static("public"));

// middleware cors
app.use(
  cors({
    origin: process.env.FE_APP,
  })
);

app.get("/api", (req, res) => {
  res.send("Server ok!");
});

// router customers
app.use("/api/customers", CustomersRouter);

//router invoices stack
app.use("/api/invoices_stack", InvoicesStackRouter);

// router certicates
app.use("/api/certificates", certificatesRouter);

// router tabella galaxies
app.use("/api/galaxies", galaxiesRouter);

// router tabella stacks
app.use("/api/stacks", stacksRouter);

// router tabella invoice
app.use("/api/invoices", invoicesRouter);

// utilizzo middleware gestione errori
app.use(errorsHandler);
app.use(notFound);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
