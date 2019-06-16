var mongoose=require('mongoose');
//用户表结构
module.exports = new mongoose.Schema({
    u_id:{//谁的故障订单
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    title:String,
    type:String,
    desc:String,
    phone:String,
    is_fixed:{//是否已修理好
        type:Boolean,
        default:false
    },
    g_time:{//创建时间
        type:Date,
        default:new Date()
    },
});