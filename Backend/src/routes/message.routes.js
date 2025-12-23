const express = require('express');
const { getUserForSidebar, getUserMessage, getMessageAsSeen, sendMessage, sendImage } = require('../controllers/message.controller');
const  {authMiddleware}  = require('../middleware/auth.middleware');

const router = express.Router();
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()});


router.get('/getUserSidebar',authMiddleware ,getUserForSidebar)
router.get('/:userId',authMiddleware,getUserMessage)
router.put('/mark/:id',authMiddleware,getMessageAsSeen)

router.post('/send/:id',authMiddleware,sendMessage)
router.post('/sendImage/:id',authMiddleware,upload.single("image"),sendImage) 




module.exports = router;