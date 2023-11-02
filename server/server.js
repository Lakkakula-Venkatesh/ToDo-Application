const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "../.env" });
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);

const PORT = 8000

app.listen(PORT, () => {});

app.use("/api/auth", authRoutes);

mongoose.connect(
  "mongodb+srv://lakkakulavenkatesh8726:v42TMqcthrTZW9R7@cluster0.067gl2s.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Database connection established succesfully");
});
