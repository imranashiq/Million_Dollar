require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./db/db");
app.use(express.json());
const cron = require("node-cron");
const MarketPlace = require("./models/marketPlace");
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

const corsOptions = {
  origin: ["http://localhost:5173", "https://reimagined-couscous-drab.vercel.app"], // Your frontend domain
  methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true, // Enable if using cookies/tokens
};

app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT;
const authRouter = require("./routes/auth");
const influencerRouter = require("./routes/influencer");
const pixelRouter = require("./routes/pixels");
const marketPlaceRouter=require("./routes/marketplace")


app.get("/", (req, res) => {
  res.send(
    "<h1 style='display: flex; justify-content: center;  align-items: center; height: 200px'>Welcome to Million Dollar Backend</h1>"
  );
});
pixelRouter
app.use("/api/v1", authRouter);
app.use("/api/v1", influencerRouter);
app.use("/api/v1", pixelRouter);
app.use("/api/v1", marketPlaceRouter);


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

cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("Running MarketPlace status update job...");

    const now = new Date();

    // Find and update expired marketplace listings
    const result = await MarketPlace.updateMany(
      { timer: { $lte: now }, status: true }, // Find active listings with expired time
      { $set: { active: false } } // Update status to false
    );

    console.log(`Updated ${result.modifiedCount} expired marketplace items.`);
  } catch (error) {
    console.error("Error updating marketplace status:", error);
  }
});