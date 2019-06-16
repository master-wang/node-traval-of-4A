var mongoose=require('mongoose');
//公告表结构
module.exports = new mongoose.Schema({

    title:String,
    city:String,
    desc:String,
    price:String,
    img:String,
    u_id:{//发布人
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    comments: {//存储对这个item评论的数组
        type:Array,
        default:[]
    },
    views:{//浏览量
        type:Number,
        default:0
    }
});