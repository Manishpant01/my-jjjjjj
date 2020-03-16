const express = require('express');
const router = express.Router();
const controller = require('../controller/controller_r');
const authentication = require('../auth/authentication');

router.get('/',authentication.checktoken,controller.adminlogin);
router.post('/adminlog',controller.adminlog);
router.get('/subadminpage',authentication.checktoken,authentication.checkauth,controller.subadmin_page);
router.post('/subadminsave',authentication.checktoken,controller.subadmin_save);
router.get('/userpage',authentication.checktoken,authentication.checkauth,controller.user_page);
router.post('/usersave',authentication.checktoken,controller.user_save);
router.get('/viewsubadmin',authentication.checktoken,controller.show_subadmindata);
router.get('/viewuser',authentication.checktoken,controller.show_userdata);
router.get('/delete/:id',authentication.checktoken,authentication.checkauth,controller.deletedata);
router.get('/modify/:id',authentication.checktoken,authentication.checkauth,controller.modifydata);
router.post('/modifysave',authentication.checktoken,controller.modifysave);
router.get('/forgotpass',controller.forgotpage);
router.post('/forgot',controller.newpass,controller.findrole,controller.linkmail);
router.get('/logout',authentication.checktoken,controller.logout);
router.get('/subadminchange',authentication.checktoken,authentication.checkauth,controller.adchange);
router.post('/subadchange',controller.hashpass,controller.subadchange);
router.get('/adminchangepage',authentication.checktoken,authentication.checkauth,controller.adminchangepage);
router.post('/adminchange',authentication.checktoken,controller.adminchange);
router.get('/dashboard',authentication.checktoken,controller.dashboard);
router.get('/linkchangepage/:id',controller.bylinkpage);
router.post('/linkchange',controller.bylinkchange);
router.get('/img',authentication.checktoken,controller.imgup);
router.post('/imgupload',authentication.checktoken,controller.imgupload) 

module.exports = router;
