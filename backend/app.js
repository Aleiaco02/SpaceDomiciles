import express from "express";
import cors from "cors";
import 'dotenv/config';


const app = express();

// middleware bodyparser
app.use(express.json());

// middleware static
app.use(express.static('public'));

// middleware cors
app.use(cors({
    origin: process.env.FE_APP
}));

app.get("/", (req, res) => {
    res.send("Server ok!");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});