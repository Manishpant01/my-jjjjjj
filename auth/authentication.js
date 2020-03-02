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

module.exports  = {
    checktoken
}