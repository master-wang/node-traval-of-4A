var express=require('express');
var router=express.Router();
var User=require('../models/user');
var Traval = require('../models/traval')
var responData;
//上传图片的 multer 配置
const multer = require('multer');
const path = require('path');
const lastdir = path.resolve(__dirname, '..');
var Bod_imgs = [];
var B_path = '/public/upimgs/';

var imgpath = '/public/upimgs/';
var user_img = ''
var storage = multer.diskStorage({
    destination: path.join(lastdir,'/public/upimgs'),

    filename: function (req, file, cb) {
        var str = file.originalname.split('.');
        var imgname = Date.now()+'.'+str[1];
        //处理单张图片
        user_img = imgname;
        //imgpath = imgpath + imgname;
        //处理多张图片
        B_path = B_path + imgname;
        Bod_imgs.push(B_path);
        B_path = '/public/upimgs/';

        cb(null, imgname);
    }
})
var upload = multer({ storage: storage });//存储器

router.use(function(req,res,next){
    responData={
        code:0,
        message:''
    }
    next();
})

router.post('/user/register',function(req,res){
    var username = req.body.username;
    var password= req.body.password;
    var repassword = req.body.repassword;
    console.log(username+"---"+password+"--"+repassword);
    if(username == ''){
        responData.code=1;
        responData.message='账号不能为空';
        res.json(responData);
        return;
    }
    if(password == ''){
        responData.code=2;
        responData.message='密码不能为空';
        res.json(responData);
        return;
    }
    if(password != repassword){
        responData.code=3;
        responData.message='2次密码不一致';
        res.json(responData);
        return;
    }

    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            responData.code=4;
            responData.message='用户已被注册';
            res.json(responData);
        return;
        }
        var user = new User({
            username:username,
            password:password,
            sex:"",
            name:"",
            age:"",
            head_img:"/public/upimgs/touxiang.jpg"
        });
        return user.save();
    }).then(function(newUserInfo){
        
        responData.message='注册成功,即将返回登录界面';
        res.json(responData);
    })


    
});
router.post('/user/login',function(req,res){
    var username = req.body.username;
    var password= req.body.password;
    if(username == '' || password == ''){
        responData.code = 1;
        responData.message = '用户名和密码不能为空';
        res.json(responData);
        return;
    }
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responData.code = 2;
            responData.message = '用户名或密码错误';
            res.json(responData);
            return;
        }
        responData.message = '登陆后台成功';
        responData.userInfo=userInfo;
        responData.isAdmin='true'
        //登录成功设置cookies
        req.cookies.set('userInfo',JSON.stringify(
            {
                _id:userInfo._id,
                username:userInfo.username,
            }
        ));
        console.log(req.cookies.get('userInfo'));
        res.json(responData);
        return
    })
    
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responData.code = 2;
            responData.message = '用户名或密码错误';
            res.json(responData);
            return;
        }
        responData.message = '首页登陆成功';
        responData.userInfo=userInfo;
        responData.isAdmin='false'
        //登录成功设置cookies
        req.cookies.set('userInfo',JSON.stringify(
            {
                _id:userInfo._id,
                username:userInfo.username,
            }
        ));
        console.log(req.cookies.get('userInfo'));
        res.json(responData);
    })

})
//修改个人信息
router.post('/user/updateUserInfo',upload.single('file'),function(req,res){
    
    var password = req.body.password;
    var sex = req.body.sex;
    var name = req.body.name;
    var age = req.body.age;
    var _id = req.body.id;

    console.log("---------------------------------------------------");
    console.log(password+"---"+sex+"--"+name+"--------"+age);
    responData.message = '上传成功';
    responData.imgpath = imgpath +user_img;
    console.log("更新个人头像路径："+responData.imgpath);
    imgpath=imgpath +user_img;
    User.update({
        _id:_id
    },{
        password : password,
        sex : req.body.sex,
        name : name,
        age :age,
        head_img:imgpath
    }).then(function(info){
        imgpath = '/public/upimgs/';
        user_img = '';
        Bod_imgs = [];
        return User.findOne({
            _id:_id
        })
    }).then(function(info){
        console.log(info);
        responData.message = '文字上传成功';
        responData.userInfo = info
        res.json(responData);
    });
    
})
//获取所有的用户的信息
router.get('/user/getAllList',function(req,res){
    User.find().sort({_id:-1}).then(function(usersList){
        console.log(usersList,"11111111111111111111");
        responData.message = '请求公告数据成功！';
        responData.usersList = usersList;
        res.json(responData);
    })
})
router.get('/user/getUserInfoById',function(req,res){
    var id=req.query._id || '';
    User.findOne({
        _id:id
    }).then(function(update_userInfo){
        responData.message = '删除成功，获取新的用户列表';
        responData.update_userInfo = update_userInfo;
        res.json(responData);
    })
})
router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',null);
    responData.message = '退出成功！';
    res.json(responData);
})
//删除user
router.get('/user/delete',function(req,res){
    var id=req.query._id || '';
    console.log(id);
    User.remove({
        _id:id
    }).then(function(){
        return User.find().sort({_id:-1});
    }).then(function(usersList){
        console.log(usersList,"11111111111111111111");
        responData.message = '删除成功，获取新的用户列表';
        responData.usersList = usersList;
        res.json(responData);
    })
    
})


//
router.post('/traval/addTraval',upload.single('file'),function(req,res){
    
    var title = req.body.title;
    var city = req.body.city;
    var desc = req.body.desc;
    var price = req.body.price;

    console.log("---------------------------------------------------");
    console.log(title+"---"+city+"--"+desc+"--------"+price);
    responData.message = '上传成功';
    responData.imgpath = imgpath +user_img;
    console.log("更新个人头像路径："+responData.imgpath);
    imgpath=imgpath +user_img;
    new Traval({
        title : title,
        city : city,
        desc : desc,
        price :price,
        u_id:req.body.u_id,
        img:imgpath
    }).save().then(function(info){
        imgpath = '/public/upimgs/';
        user_img = '';
        Bod_imgs = [];

        responData.message = '上传景点成功！';
        responData.traval = info
        res.json(responData);
    })
    
})
router.get('/traval/getAllList',function(req,res){
    Traval.find().sort({_id:-1}).then(function(travalList){
        console.log(travalList,"11111111111111111111");
        responData.message = '请求公告数据成功！';
        responData.travalList = travalList;
        res.json(responData);
    })
})
router.get('/traval/delete',function(req,res){
    var id=req.query._id || '';
    console.log(id);
    Traval.remove({
        _id:id
    }).then(function(){
        responData.message = '删除成功';
        res.json(responData);
    })
    
})
router.get('/traval/getTravalInfoById',function(req,res){
    var id=req.query._id || '';
    Traval.findOne({
        _id:id
    }).then(function(update_travalInfo){
        responData.message = '获取成功';
        responData.update_travalInfo = update_travalInfo;
        res.json(responData);
    })
})
router.get('/traval/mohuchaxun',function(req,res){
    var title=req.query.title || '';
    Traval.find({"title": {$regex: title, $options:'i'}}).then(function(list){
        responData.message = '获取成功';
        responData.travalList = list;
        res.json(responData);
    })
})
router.post('/traval/editTraval',upload.single('file'),function(req,res){
    
    var title = req.body.title;
    var city = req.body.city;
    var desc = req.body.desc;
    var price = req.body.price;
    var _id = req.body._id;

    console.log("---------------------------------------------------");
    console.log(title+"---"+city+"--"+desc+"--------"+price);
    responData.message = '上传成功';
    responData.imgpath = imgpath +user_img;
    console.log("更新个人头像路径："+responData.imgpath);
    imgpath=imgpath +user_img;
    Traval.update({
        _id:_id
    },{
        title : title,
        city : city,
        desc : desc,
        price :price,
        u_id:req.body.u_id,
        img:imgpath
    }).then(function(info){
        imgpath = '/public/upimgs/';
        user_img = '';
        Bod_imgs = [];

        responData.message = '上传景点成功！';
        responData.traval = info
        res.json(responData);
    })
    
})
router.get('/traval/addViews',function(req,res){

    var _id = req.query._id;
    var views = req.query.views;
    console.log(views)
    var newviews = Number(views)+1;
    console.log(newviews)
    Traval.update({
        _id:_id
    },{
        views:newviews
    }).then(function(info){
        console.log(info)
        responData.message = '文字上传成功';

        res.json(responData);
    })
    
})
router.post('/traval/comment',function(req,res){
    var _id = req.body._Id || '';
    var username = req.body.username || '';
    console.log(req.body.img)
    var postData = {
        img:req.body.img,
        username:username,
        content:req.body.messageContent,
        postTime:new Date(),
    };
    Traval.findOne({
        _id:_id
    }).then(function(content){
        content.comments.unshift(postData);
        return content.save();
    }).then(function(newContent){
        responData.message = '评论成功！';
        responData.newContent = newContent;
        res.json(responData);
    })

})
//删除评论
router.post('/traval/commentdelete',function(req,res){
    var c = req.body.c || '';
    var _id = req.body._id || '';
    c.postTime =new Date(c.postTime)
    Traval.findOne({
        _id:_id
    }).then(function(content){
        var length = content.comments.length;
        console.log(length,"555555555555555555555555");
        console.log(c)
        console.log("11111111111111111111")
        console.log(content.comments[0])
        console.log(c == content.comments[0],"ok???")
        console.log( content.comments[0].postTime.toString() == c.postTime.toString())
        for (var i = 0; i < length; i++) {
            if (
                content.comments[i].postTime.toString() == c.postTime.toString()
                ) {
                if (i == 0) {
                    console.log("0000000000")
                    content.comments.shift(); //删除并返回数组的第一个元素
                    return content.save();
                }
                else if (i == length - 1) {
                    console.log("11111")
                    content.comments.pop();  //删除并返回数组的最后一个元素
                    return content.save();
                }
                else {
                    console.log("endendende")
                    content.comments.splice(i, 1); //删除下标为i的元素
                    return content.save();
                }
            }
        }
    }).then(function(newContent){
        console.log("-----------------")
        console.log(newContent);
        responData.message = '删除评论成功！';
        responData.newContent = newContent;
        res.json(responData);
    })

})
module.exports = router;