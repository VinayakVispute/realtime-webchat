const { createGroup } = require("../controllers/groupController");
const express = require("express");
const router = express.Router();

router.post("/", createGroup);

module.exports = router;
