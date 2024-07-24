const express = require("express");
const { login, signup, getProfile } = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
// router.post("/profile", auth, getProfile)

module.exports = router;