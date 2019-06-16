var mongoose=require('mongoose');
//用户表结构
module.exports = new mongoose.Schema({
    username:String,//用户名
    password:String,//密码
    sex:String,//性别
    name:String,//名字
    age:String,//年龄
    head_img:{//头像
        type:String,
        default:'/public/upimgs/touxiang.jpg'
    },
    isAdmin:{//是否是管理员
        type:Boolean,
        default:false
    }
});