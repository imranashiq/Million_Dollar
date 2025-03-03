require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./db/db");


const PORT = process.env.PORT;
const authRouter = require("./routes/auth");


app.use(express.json());

app.use(morgan("dev"));
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send(
    "<h1 style='display: flex; justify-content: center;  align-items: center; height: 200px'>Welcome to Million Dollar Backend</h1>"
  );
});

app.use("/api/v1", authRouter);


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("DB Connected");
  } catch (error) {
    console.log(error);
  }
};

app.listen(PORT, async () => {
  console.log(`Server Listening at ${PORT}`);
  start();
});
