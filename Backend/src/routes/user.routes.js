const express = require('express');
const { authRegister, authlogin, authlogOut, updateProfile } = require('../controllers/auth.controller');
const multer = require('multer');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.post('/register',upload.single("image"),authRegister)
router.post('/login',authlogin)

router.get('/log-out',authlogOut)

router.patch('/update-profile/:id',upload.single("profilePic"),authMiddleware,updateProfile)



module.exports = router;