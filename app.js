require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./db/db");
const cron = require("node-cron");
const MarketPlace = require("./models/marketPlace");

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// CORS Setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://reimagined-couscous-drab.vercel.app",
  "https://milliondollarinfluencer.com/",
  "https://milliondollarinfluencer.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));

// Serve static files with CORS headers
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path, stat) => {
      const origin = res.req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
    },
  })
);

// Routers
const authRouter = require("./routes/auth");
const influencerRouter = require("./routes/influencer");
const pixelRouter = require("./routes/pixels");
const marketPlaceRouter = require("./routes/marketplace");

app.get("/", (req, res) => {
  res.send(
    "<h1 style='display: flex; justify-content: center;  align-items: center; height: 200px'>Welcome to Million Dollar Backend</h1>"
  );
});

app.use("/api/v1", authRouter);
app.use("/api/v1", influencerRouter);
app.use("/api/v1", pixelRouter);
app.use("/api/v1", marketPlaceRouter);

// DB and Server Start
const PORT = process.env.PORT || 3334;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("DB Connected");
    app.listen(PORT, () => {
      console.log(`Server Listening at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

// Cron Job
cron.schedule("*/5 * * * *", async () => {
  try {
    console.log("Running MarketPlace status update job...");
    const now = new Date();

    const result = await MarketPlace.updateMany(
      { timer: { $lte: now }, status: true },
      { $set: { active: false } }
    );

    console.log(`Updated ${result.modifiedCount} expired marketplace items.`);
  } catch (error) {
    console.error("Error updating marketplace status:", error);
  }
});
