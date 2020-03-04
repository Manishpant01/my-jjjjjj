const jwt = require('jsonwebtoken');
const key = require('../key');




function checktoken(req, res,next) {
    let token = req.cookies.token;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.....>>>>>>>>>>>>>>>>>token :' + token);
  
    if ((token == undefined) || (token== null)) {
        
        res.render('login.html');
    } else {
        jwt.verify(token, key.secretkey, function (err, data) {
              if(err){
                  res.render('login.html')
              }else{
                  console.log(data);
                  let type = data.role;
                  req.type = type;
                  next();
              }
        })
    }
}

function checkauth (req,res,next){
    let type = req.type;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>:'+type);
    if(type == 'admin'){
        next()
    }else{
        res.render('auth.html')
    }
}

module.exports  = {
    checktoken,checkauth
}