require("dotenv").config();
const express = require("express")
const cors = require("cors");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, console.log(`Server is running on port ${PORT}`));