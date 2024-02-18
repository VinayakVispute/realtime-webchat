const { createRoom } = require("../controllers/roomController");
const express = require("express");
const router = express.Router();

router.post("/", createRoom);

module.exports = router;
