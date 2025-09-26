const express = require("express");
const router = express.Router();
const {registerUser, loginUser, protectedRoute} = require("../controllers/auth");
const {authMiddleware} = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/protected", authMiddleware, protectedRoute);

module.exports = router;