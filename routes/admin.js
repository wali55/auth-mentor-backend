const express = require("express");
const { adminDashboard } = require("../controllers/admin");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, roleMiddleware("ADMIN"), adminDashboard);

module.exports = router;