import express from "express";
import dotenv from "dotenv";
import mongoInstance from "./src/configs/mongoose.config.js";
import userRoutes from "./src/routes/userRoutes.js";
import pollRoutes from "./src/routes/pollRoutes.js";
import voteRoutes from "./src/routes/voteRoutes.js";

const app = express();
dotenv.config();

app.use(express.json());

const startServer = async () => {
  try {
    await mongoInstance.connect(process.env.MONGODB_URI);
    console.log("MongoDB server started");
  } catch (error) {
    console.error("Error starting server:", error);
    throw error;
  }
};
startServer();

app.use("/api/users", userRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server run at http://localhost:${PORT}`);
});