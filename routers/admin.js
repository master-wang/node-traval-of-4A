var express=require('express');
var router=express.Router();
var user = require('../models/users');
var category=require('../models/category');
var Content=require('../models/Content');

router.use(function(req,res,next){
    if(!req.userInfo.isAdmin){
        console.log(req.userInfo)
        res.send('你不是管理员！');
        return;
    }
    next();
});
router.get('/',function(req,res){
    console.log(req.userInfo)
    res.render('admin/index',{
        userInfo:req.userInfo
    });
})
router.get('/user',function(req,res){
    //分页操作
    var page = Number(req.query.page || 1);
    var limit = 10;
    var skip = 0;
    var pages = 0;
    user.count().then(function(counts){
        pages = Math.ceil(counts/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        skip = (page - 1 )*limit;

        user.find().skip(skip).limit(limit).then(function(users){
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                page:page,
                count:counts,
                pages:pages,
                limit:limit,
                kind:'user'
            });
        })
    })
})
router.get('/category',function(req,res){
    //分页操作
    var page = Number(req.query.page || 1);
    var limit = 10;
    var skip = 0;
    var pages = 0;
    category.count().then(function(counts){
        pages = Math.ceil(counts/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        skip = (page - 1 )*limit;

        category.find().sort({_id:-1}).skip(skip).limit(limit).then(function(categories){
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                page:page,
                count:counts,
                pages:pages,
                limit:limit,
                kind:'category'
            });
        })
    })
   
})
router.get('/category/add',function(req,res){
    res.render('admin/category_add',{
        userInfo:req.userInfo
    })
})
router.post('/category/add',function(req,res){
    var name = req.body.name || '';
    
    if(name == ''){
        var error='名称不能为空！'
        res.render('admin/error',{
            userInfo:req.userInfo,
            error:error
        });
        return;
    }
    category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                error:'该分类已存在！'
            });
            return Promise.reject();
        }else{
            return new category({
                name:name
            }).save();
        }
    }).then(function(rs){
        res.render('admin/success',{
            userInfo:req.userInfo,
            success:'分类添加成功！',
            url:'/admin/category'
        });
    })
})
router.get('/category/edit',function(req,res){
    var id=req.query.id || '';
    console.log(id);
    category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                error:'该分类信息不存在！'
            });
            return Promise.reject();
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    })
})
router.post('/category/edit',function(req,res){
    var id=req.query.id || '';
    console.log(id);
    var name = req.body.name || '';
    category.findOne({
        _id:id
    }).then(function(cate){
        if(!cate){
            res.render('admin/error',{
                userInfo:req.userInfo,
                error:'该分类信息不存在！'
            });
            return Promise.reject();
        } else {
            if(name == cate.name){
                res.render('admin/success',{
                    success:'修改成功！',
                    url:'/admin/category'
                });
                return Promise.reject();
            } else {
                //要修改的民成在数据库是否存在
                return category.findOne({
                    _id:{$ne:id},
                    name:name
                })
            }
            
        }
    }).then(function(samedata){
        console.log(samedata);
        if(samedata){
            res.render('admin/error',{
                userInfo:req.userInfo,
                error:'该同名分类已存在！'
            });
            return Promise.reject();
        } else {
            return category.update({
                _id:id
            },{
                name:name
            })
        }
    }).then(function(){
        res.render('admin/success',{
            success:'修改成功！',
            url:'/admin/category'
        });
    })
})
router.get('/category/delete',function(req,res){
    var id=req.query.id || '';
    category.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            success:'删除成功！',
            url:'/admin/category'
        });
    })
    
})
//内容首页
router.get('/content',function(req,res){
    var page = Number(req.query.page || 1);
    var limit = 10;
    var skip = 0;
    var pages = 0;
    Content.count().then(function(counts){
        pages = Math.ceil(counts/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        skip = (page - 1 )*limit;

        Content.find().sort({_id:-1}).skip(skip).limit(limit).populate(['category','user']).sort({addTime:-1}).then(function(contents){
        
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,
                page:page,
                count:counts,
                pages:pages,
                limit:limit,
                kind:'content'
            });
        })
    })
    
})
router.get('/content/add',function(req,res){
    category.find().sort({_id:-1}).then(function(categories){
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
         })
    })
    
})
router.post('/content/add',function(req,res){
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            error:'分类不能为空！'
        });
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            error:'标题不能为空！'
        });
        return;
    }
    
    new Content({
        category: req.body.category,
        title: req.body.title,
        description:req.body.description,
        content:req.body.content,
        user: req.userInfo._id.toString(),
    }).save().then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            success:'添加内容成功！',
            url:'/admin/content'
        });
    });
    
})
router.get('/content/edit',function(req,res){
    var id=req.query.id || '';
    console.log(id);
    var categories = [];

    category.find().sort({_id:-1}).then(function(rs){
        categories = rs;
        return Content.findOne({
            _id:id
        }).populate('category');
    }).then(function(content){
            if(!content){
                res.render('admin/error',{
                    userInfo:req.userInfo,
                    error:'该内容不存在！'
                });
                return Promise.reject();
            }else{
                res.render('admin/content_edit',{
                    userInfo:req.userInfo,
                    content:content,
                    categories:categories
                });
            }
        })
    
})
router.post('/content/edit',function(req,res){
    var id=req.query.id || '';

    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            error:'分类不能为空！'
        });
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            error:'标题不能为空！'
        });
        return;
    }
    
    Content.update({
        _id:id
    },{
        category: req.body.category,
        title: req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            success:'修改内容成功！',
            url:'/admin/content'
        });
    });
    
})
router.get('/content/delete',function(req,res){
    var id=req.query.id || '';
    Content.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            success:'删除成功！',
            url:'/admin/content'
        });
    })
})
module.exports = router;