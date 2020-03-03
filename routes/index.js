const express = require('express');
const router = express.Router();
const controller = require('../controller/controller_r');
const authentication = require('../auth/authentication');

router.get('/',controller.adminlogin);
router.post('/adminlog',controller.adminlog);
router.get('/subadminpage',authentication.checktoken,controller.subadmin_page);
router.post('/subadminsave',authentication.checktoken,controller.subadmin_save);
router.get('/userpage',authentication.checktoken,controller.user_page);
router.post('/usersave',authentication.checktoken,controller.user_save);
router.get('/viewsubadmin',authentication.checktoken,controller.show_subadmindata);
router.get('/viewuser',authentication.checktoken,controller.show_userdata);
router.get('/delete/:id',authentication.checktoken,authentication.checkauth,controller.deletedata);
router.get('/modify/:id',authentication.checktoken,authentication.checkauth,controller.modifydata);
router.post('/modifysave',authentication.checktoken,controller.modifysave);
router.get('/forgotpass',authentication.checktoken,controller.forgotpage);
router.post('/forgot',controller.newpass,controller.forgotpass);

module.exports = router;
