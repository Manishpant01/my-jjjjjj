const UserSchema = require('../db_userschema/schema');
const generator = require('generate-password');
const nodemailer = require('nodemailer');

module.exports = {
    adminlogin, reg, adminlog, subadmin_page, subadmin_save, user_page, user_save
}

function adminlogin(req, res) {
    res.render('login.html');
}

function adminlog(req, res) {
    let email = req.body.email;
    var password = req.body.pass;
    console.log(email);
    console.log(password);
    UserSchema.findOne({ 'email': email }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            data.comparePassword(password, function (err, isMatch) {
                if (err) throw err;
                else {
                    console.log('Password:', isMatch);
                    res.render('index.html');
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
    console.log(Age);
    console.log(email);

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
            mail(email,password);
            res.render('index.html');
           
        }
    })
}

function user_page(req, res) {
    res.render('user_page.html');
}

function user_save(req, res) {
    let name = req.body.name;
    let age = req.body.age;
    let email = req.body.email;
    console.log(Name);
    console.log(Age);
    console.log(email);
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
            mail(email,password);
            res.render('index.html');
            
        }
    })
}
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'manishpant203@gmail.com',
        pass: 'manishhpant111@'
    }
});

function mail(email,password) {

    let mailOptions = {
        from: 'manishpant203@gmil.com',
        to: email,
        subject: 'Thanku for register',
        html: 'your email is'+ email + 'your password is'+ password
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
};







