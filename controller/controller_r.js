const UserSchema = require('../db_userschema/schema');
const generator = require('generate-password');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const path = require('path');
const key = require('../key');
const alert = require('alert-node');
const bcrypt = require('bcrypt')
const formidable = require('formidable');
const cloudinary = require('cloudinary');
let mag = "";

cloudinary.config({
    cloud_name: 'dwbu43ohq',
    api_key: '173321429679684',
    api_secret: 'WNOVFI64ogPnfnmQ4NJrTK6LFCs'
});



SALT_WORK_FACTOR = 10;




module.exports = {
    adminlogin,
    reg,
    adminlog,
    subadmin_page,
    subadmin_save,
    user_page,
    user_save,
    show_subadmindata,
    show_userdata,
    deletedata,
    modifydata,
    modifysave,
    newpass,
    //forgotpass,
    linkmail,
    findrole,
    forgotpage,
    logout,
    adchange,
    subadchange,
    hashpass,
    adminchangepage,
    adminchange,
    dashboard, bylinkpage, bylinkchange, imgup, imgupload
}

function adminlogin(req, res) {
    let profile = req.pic;
    let name = req.name;
    console.log(profile);
    res.render('index.html', { profile, name });
}

function adminlog(req, res) {
    let email = req.body.email;
    let password = req.body.pass;
    console.log(email);
    console.log(password);
    UserSchema.findOne({ 'email': email }, function (err, data) {
        if (err) {
            console.log(err);
        } else if (data == null) {
            console.log('username & password is wrong');
            mag = "Please Enter Valid Information"
            res.render('login.html',{mag});
        }
        else {
            data.comparePassword(password, function (err, isMatch) {
                if (err) throw err;
                else {
                    console.log('Password:', isMatch);
                    if (isMatch == false) {
                        res.render('login.html',{mag});
                    }
                }
                let o_id = data.id;
                let role = data.role;
                console.log('id:', o_id);
                console.log('role : ' + role);
                if ((role == 'admin') || (role == 'subadmin')) {
                    jwt.sign({ 'id': o_id, 'role': role }, key.secretkey, { expiresIn: '60m' }, (err, token) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("TOKEN SEND >>>>>>>>>>>>>>>>" + token);
                            let profile = req.pic;
                            let name = req.name;
                            res.cookie('token', token).redirect('/');

                        }
                    })
                } else {
                    mag = "User can not login from admin pannel"
                    res.render('login.html',{mag});
                }
            })
        }


    })

}

function reg(req, res) {
    res.render('register.html');
}


function subadmin_page(req, res) {
    res.render('usersave.html');
}

function subadmin_save(req, res) {
    let Name = req.body.name;
    let Age = req.body.age;
    let email = req.body.email;
    console.log(Name);
    console.log(">>>>>>>:", Age);
    console.log(email);
    if ((Age == '') || (Name == '') || (email == '')) {

        res.json("please enter valid information");
    } else {

        let password = generator.generate({
            length: 10
        });
        console.log(password);
        let schemaName = new UserSchema({ 'name': Name, 'age': Age, 'email': email, 'password': password, 'role': 'subadmin' });
        schemaName.save(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                mail(email, password);
                let profile = req.pic;
                let name = req.name;
                res.render('index.html', { profile, name });

            }
        })
    }
}

function user_page(req, res) {
    res.render('user_page.html');
}

function user_save(req, res) {
    let name = req.body.name;
    let age = req.body.age;
    let email = req.body.email;
    console.log(name);
    console.log(age);
    console.log(email);
    if ((age == '') || (name == '') || (email == '')){
        res.json("please enter valid information");
       
    } else {
        
        let password = generator.generate({
            length: 10
        });
        console.log(password);
        let schemaName = new UserSchema({ 'name': name, 'age': age, 'email': email, 'password': password, 'role': 'user' });
        schemaName.save(function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                mail(email, password);
                res.redirect('/');

            }
        })
    }
}
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'manishpant203@gmail.com',
        pass: 'manishhpant111@'
    }
});

function mail(email, password) {

    let mailOptions = {
        from: 'manishpant203@gmil.com',
        to: email,
        subject: 'Your Password is successfully Changed',
        html: 'your email is:' + email + 'your password is:' + password
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};


function show_subadmindata(req, res) {
    UserSchema.find({ 'role': 'subadmin' }, (err, data) => {
        if (err) { }
        else {
            console.log(data)
            let juser = data
            res.render('subadmin.html', { juser })
        }
    })

}


function show_userdata(req, res) {
    UserSchema.find({ 'role': 'user' }, (err, data) => {
        if (err) { }
        else {
            console.log(data)
            let juser = data
            res.render('subadmin.html', { juser })
        }
    })

}

function deletedata(req, res) {
    let id = req.params.id;
    console.log(id);
    UserSchema.findByIdAndUpdate({ '_id': id }, { $set: { 'is_deleted': 'true' } }, (err, data) => {
        if (err) {
            res.json("err")
        }
        else {
            let role = data.role;
            console.log(role);
            if (role == 'subadmin') {
                res.redirect('/viewsubadmin')
            } else {
                res.redirect('/viewuser')
            }
        }
    })


}

function modifydata(req, res) {
    let id = req.params.id;
    console.log(id);
    UserSchema.findOne({ '_id': id }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            id = data.id;
            name = data.name;
            console.log(name);
            age = data.age;
            email = data.email;
            is_deleted = data.is_deleted
            res.render('modify.html', { name, email, age, id, is_deleted })
        }

    })

}

function modifysave(req, res) {
    let name = req.body.name;
    let age = req.body.age;
    let email = req.body.email;
    let id = req.body.id;
    let is_deleted = req.body.is_deleted;
    console.log(name);
    console.log(age);
    console.log(email);
    console.log(id);
    console.log(is_deleted);
    if ((age == '') || (name == '')) {
        res.json("Enter valid informatio")
    } else {
       
        UserSchema.findByIdAndUpdate({ '_id': id }, { $set: { 'name': name, 'age': age,  'is_deleted': is_deleted } }, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let role = data.role;

                console.log(role);
                if (role == 'subadmin') {
                    res.redirect('/viewsubadmin')
                } else {
                    res.redirect('/viewuser')
                }
            }
        })
    }

}

function forgotpage(req, res) {
    res.render('forgotpass.html');
}

// function forgotpass(req, res) {

//     let email = req.body.email;
//     console.log(email);
//     let passw = req.pass
//     console.log(passw);
//     let newpass = req.newpassword
//     console.log(newpass);
//     let role = req.role
//     console.log(role);
//     if (role == 'user') {

//         UserSchema.findOneAndUpdate({ 'email': email }, { $set: { 'password': newpass } }, (err, data) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log(data);
//                 mail(email, passw);
//                 res.redirect('/');
//             }

//         })
//     } else {
//         alert('Only user Can Change');
//         res.redirect('/');
//     }
// }

function findrole(req, res, next) {
    let mail = req.body.email;
    console.log(mail);
    UserSchema.findOne({ 'email': mail }, (err, data) => {

        if (data == null) {
            alert('You Enter a wrong mail');
            res.redirect('/');
        } else {
            let mail = data.email;
            req.email = mail;
            console.log(mail);
            role = data.role;
            console.log(role);
            req.role = role;
            let id = data.id;
            req.O_id = id;
            next()
        }
    })
}


function newpass(req, res, next) {
    var newpassword
    let pass = generator.generate({
        length: 10
    });


    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(pass, salt, function (err, hash) {
            if (err) return next(err);

            newpassword = hash;
            req.pass = pass;
            req.newpassword = newpassword;
            console.log(newpassword);

            next();

        })
    })
}
function logout(req, res) {
    res.clearCookie('token').redirect('/')
}


function adchange(req, res) {
    res.render('adchange.html',{mag});
}

function subadchange(req, res) {
    let name = req.body.name;
    console.log(name);
    let pass = req.body.pass;

    console.log(pass);
    let email = req.body.email;
    let hashpass = req.newpassword;
    console.log(hashpass);
    UserSchema.findOneAndUpdate({ 'email': email }, { $set: { 'password': hashpass } }, (err, data) => {
        if (err) {
            console.log(err);
        } else if(data == null){
            console.log('username & password is wrong');
            let mag = "Enter valid information"
            res.render('adchange.html',{mag});
        }else{
            console.log(data);
            mail(email, pass);
            res.render('changesucc.html');
        }
    })
}

function hashpass(req, res, next) {
    let passw = req.body.pass;
    console.log(passw)
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(passw, salt, function (err, hash) {
            if (err) return next(err);

            newpassword = hash;
            req.newpassword = newpassword;
            console.log(newpassword);

            next();

        })
    })
}

function adminchangepage(req, res) {
    res.render('adminchange.html',{mag});
}


function adminchange(req, res) {
    let email = req.body.email;
    console.log(email);
    let oldpass = req.body.oldpass;
    console.log(oldpass);
    let newpass = req.body.pass;
    let hashpass = req.newpassword
    UserSchema.findOne({ 'email': email }, (err, data) => {
        if (err) {
            console.log(err)
        } else if (data == null) {
            console.log('username & password is wrong');
            let mag = "Enter valid information"
            res.render('adminchange.html',{mag});
        } else {
            data.comparePassword(oldpass, function (err, isMatch) {
                if (err) throw err;
                else {
                    console.log('Password:', isMatch);
                    if (isMatch) {
                        data.password = newpass;
                        data.save((err) => {
                            if (err) {

                            }
                            else {
                                let profile = req.pic;
                                let name = req.name;
                                res.render('index.html', { profile, name });
                            }
                        });
                    } else {
                        alert('Old Password Is Wrong');
                        res.redirect('/adminchangepage');
                    }
                }
            })
        }
    })
}
function dashboard(req, res) {
    let profile = req.pic;
    let name = req.name;
    res.render('index.html', { profile, name });
}

function linkmail(req, res) {
    let email = req.email;
    console.log(email);
    let role = req.role;
    console.log(role);
    console.log('email recived');
    let o_id = req.O_id;
    if ((role == 'admin') || (role == 'user')) {
        jwt.sign({ 'id': o_id }, key.secretkey, { expiresIn: '1d' }, (err, token) => {
            if (err) {
                console.log(err);
            } else {
                console.log(token);
                sendmail(email, token, function (err, result) {
                    if (err) {

                    }
                    else {

                        console.log(result);
                        res.redirect('/')
                        alert("Password Reset Link Has Been Send")
                        UserSchema.findByIdAndUpdate({ "_id": o_id }, { $set: { 'resetlink': token } }, (err, result) => {
                            if (err) {

                            } else {
                                console.log(result);
                            }
                        })
                    }
                })

            }
        })
    } else {
        alert('only User & Admin can change');
    }

}

function sendmail(email, link, cb) {

    let mailOptions = {
        from: 'manishpant203@gmil.com',
        to: email,
        subject: 'your password change requs',
        html: '<p>Click <a href="https://adminmanish.herokuapp.com/linkchangepage/' + link + '">here</a> to reset your password</p>'
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            cb(err)
        else
            cb(null, true);
    });


};

function bylinkpage(req, res) {
    let token = req.params.id;
    console.log(token);
    jwt.verify(token, key.secretkey, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            let id = data.id;
            console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP", id);
            res.render('bylinkchange.html', { id, token });
        }
    })

}

/* When User Click on Link via EMail */

function bylinkchange(req, res) {
    let email = req.body.id;
    console.log(email);
    let token = req.body.token;

    let pass = req.body.password;
    console.log(pass);
    UserSchema.findOne({ '_id': email }, (err, data) => {
        if (err) {

        }
        else {
            let token = data.resetlink;
            console.log("my token", token);
            if ((token == undefined) || (token == null)) {
                res.json('Link expired')

            } else {
                console.log(data);
                data.password = pass;
                data.resetlink = undefined;
                data.save((err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.redirect('/')
                        alert("Password Changed")
                    }
                })
            }
        }
    })

}

function imgup(req, res) {
    res.render('imgupload.html');
};


function imgupload(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file) {
        file.path = path.join(__dirname, '../public/images/') + file.name;
        console.log('>>>>>>>>>>>>>', path.join(__dirname, '../public/imgages/'));
    });

    form.on('file', function (name, file) {
        cloudinary.v2.uploader.upload(file.path, function (error, result) {
            console.log("my result", result);
            if (error) {
                console.log("error:", error);
            }
            else
                console.log("Result:", result);
            console.log(req.id);
            UserSchema.findOne({ '_id': req.id }, (err, data) => {
                if (err) {
                    console.log(err);
                }
                else if (data == null) {
                    alert("error");

                }
                else {
                    console.log('hello');
                    let url = result.url;
                    data.profilepic = url;
                    data.save((err) => {
                        if (err) {

                        }
                        else {
                            msg = "File Uploaded";
                            alert(msg);
                            res.redirect('/');
                        }
                    })

                }
            })

        });
    });


};





