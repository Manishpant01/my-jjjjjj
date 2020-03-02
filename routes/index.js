const express = require('express');
const router = express.Router();
const controller = require('../controller/controller_r');

router.get('/',controller.adminlogin);
router.post('/adminlog',controller.adminlog);
router.get('/subadmin_page',controller.subadmin_page);
router.post('/subadmin_save',controller.subadmin_save);
router.get('/user_page',controller.user_page);
router.post('/user_page',controller.user_save);


module.exports = router;
