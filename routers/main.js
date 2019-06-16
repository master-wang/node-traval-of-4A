
var express=require('express');
var router=express.Router();


router.get('/',function(req,res){

    res.render('main/index');
    
})
router.get('/admin',function(req,res){

    res.render('main/admin');
    
})

module.exports = router;