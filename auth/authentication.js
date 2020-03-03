const jwt = require('jsonwebtoken');
const key = require('../key');




function checktoken(req, res,next) {
    let token = req.cookies.token;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.....>>>>>>>>>>>>>>>>>token :' + token);

    if (!token) {
        res.render('login.html');
    } else {
        jwt.verify(token, key.secretkey, function (err, data) {
              if(err){
                  console.log(err);
              }else{
                  console.log(data);
                  next();
              }
        })
    }
}

function checkauth (req,res,next){
    let token = req.cookies.token;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>:'+token);
    if(token.role == 'admin'){
        next()
    }else{
        res.render('auth.html')
    }
}

module.exports  = {
    checktoken,checkauth
}