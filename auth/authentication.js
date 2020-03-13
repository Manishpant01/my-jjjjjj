const jwt = require('jsonwebtoken');
const key = require('../key');
const UserSchema = require('../db_userschema/schema');




function checktoken(req, res, next) {
    let token = req.cookies.token;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.....>>>>>>>>>>>>>>>>>token :' + token);

    if ((token == undefined) || (token == null)) {

        res.render('login.html');
    } else {
        jwt.verify(token, key.secretkey, function (err, data) {
            if (err) {
                res.render('login.html')
            } else {
                console.log(data);
                let type = data.role;
                let id = data.id;
                req.id = id;
                req.type = type;
                UserSchema.findOne({ '_id': id }, (err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(result);
                        req.pic = result.profilepic;
                        req.name = result.name;
                        // let role = result.role;
                        
                        next();
                    }
                })

            }
        })
    }
}

function checkauth(req, res, next) {
    let type = req.type;
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>:' + type);
    if (type == 'admin') {
        next()
    } else {
        res.render('auth.html')
    }
}

module.exports = {
    checktoken, checkauth
}