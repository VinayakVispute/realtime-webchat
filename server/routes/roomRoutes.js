const { createRoom } = require("../controllers/RoomController");
const express = require("express");
const router = express.Router();

router.post("/", createRoom);

module.exports = router;
