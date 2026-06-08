

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const mongodbConnect = require("./config/mongodb");

const app = express();

// ===== Middleware =====
app.set("trust proxy", 1);

app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "accessToken", "refreshToken", "userid", "admin"],
    credentials: true,
  })
);

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongodbConnect();
  isConnected = true;
};

app.get("/", (req, res) => {
  res.send("🚀 Backend is running!");
});

app.use("/api", require("./src/routes/index"));

// Chạy local: node index.js
if (require.main === module) {
  const port = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
      });
    })
    .catch((err) => {
      console.error("❌ DB connection failed:", err);
      process.exit(1);
    });
}

// Export cho Vercel serverless
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};