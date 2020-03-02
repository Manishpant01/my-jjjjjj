const UserSchema = require('../db_userschema/schema');
const generator = require('generate-password');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const key = require('../key');

module.exports = {
    adminlogin, reg, adminlog, subadmin_page, subadmin_save, user_page, user_save,show_subadmindata,show_userdata,deletedata,modifydata,modifysave
}

function adminlogin(req, res) {
    res.render('login.html');
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
            res.render('login.html');
        }
        else {
            data.comparePassword(password, function (err, isMatch) {
                if (err) throw err;
                else {
                    console.log('Password:', isMatch);
                    if (isMatch == false) {
                        res.render('login.html');
                    }
                }
                let o_id = data.id;
                let role = data.role;
                let mag = role
                console.log('id:', o_id);
                console.log('role : ' + role);
                if ((role == 'admin') || (role == 'subadmin')) {
                    jwt.sign({ 'id': o_id }, key.secretkey, { expiresIn: '60m' }, (err, token) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("TOKEN SEND >>>>>>>>>>>>>>>>" + token);

                            res.cookie('token', token).render('index.html', { mag });
                        }
                    })
                } else {
                    res.render('login.html');
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
            mail(email, password);
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
    console.log(name);
    console.log(age);
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
            mail(email, password);
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

function mail(email, password) {

    let mailOptions = {
        from: 'manishpant203@gmil.com',
        to: email,
        subject: 'Thanku for register',
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
    UserSchema.find({'role':'subadmin'},(err,data)=>{
        if(err){}
        else{
            console.log(data)
            let juser=data
            res.render('subadmin.html',{juser})
        }
    })
    
}


function show_userdata(req,res){
    UserSchema.find({'role':'user'},(err,data)=>{
        if(err){}
        else{
            console.log(data)
            let juser=data
            res.render('subadmin.html',{juser})
        }
    })

}

function deletedata(req,res){
    let id =  req.params.id;
    console.log(id);
    UserSchema.findByIdAndUpdate({ '_id': id }, { $set: { 'is_deleted': 'true' } }, (err, data) => {
        if (err) {
            res.json("err")
        }
        else {
           res.redirect('/viewsubadmin')
        }
    })


}

function modifydata(req,res){
    let id = req.params.id;
    console.log(id);
    UserSchema.findOne({ '_id': id }, (err, data) => {
        if (err){
            console.log(err);
        }else{
            id=data.id
            name = data.name;
            console.log(name);
            age = data.age;
            email = data.email;
            is_deleted = data.is_deleted
            res.render('modify.html',{name,email,age,id,is_deleted})
        }
        
 })

} 

 function modifysave (req, res) {
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
    UserSchema.findByIdAndUpdate({'_id': id },{$set:{'name':name , 'age':age ,'email':email,'is_deleted':is_deleted}},(err,data)=>{
        if(err){ 
            console.log(err);
        }else{
            console.log (data);
            res.redirect('/viewsubadmin')
        }
    })

 }


