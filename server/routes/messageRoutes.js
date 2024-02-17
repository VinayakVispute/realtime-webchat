const { createMessage } = require("../controllers/messageController");
const express = require("express");
const router = express.Router();

router.post("/create", createMessage);

module.exports = router;
