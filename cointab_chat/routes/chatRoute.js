const express = require("express");
const Chat = require("../controller/chatcontroller");

const router = express.Router();

router.post('/chat', Chat.getChatResponse)
router.get('/chat', Chat.getChatHistory); 

module.exports = router;
