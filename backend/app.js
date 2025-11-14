import express from "express";
// import cors from "cors";

const app = express();
// app.use(cors());
app.use(express.json());

// middleware bodyparser
app.use(express.json());

// middleware static
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("Server ok!");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});