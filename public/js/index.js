
$(function(){

    var vm=new Vue({
        delimiters: ['${', '}'],
        el:'#app',
        data:{
            lo_re_cp:"login",
            login_stadus:"no",
            register_userInfo:{
                username:"",
                password:"",
                repassword:""
            },
            login_userInfo:{
                username:"",
                password:""
            },
            update_userInfo:{},
            userInfo:{},
            travalList:[],
            update_travalInfo:{},
            addcomInfo:"",
            seachSight:""
        },
        methods: {
            //注册
            User_resister(){
                var that=this;
                $.ajax({
                    type:'post',
                    url:'/api/user/register',
                    data:that.register_userInfo,
                    dataType:'json',
                    success:function(result){
                        alert(result.message);
                        if(!result.code){
                            setTimeout(function(){
                                that.lo_re_cp = "login"
                            },1000);
                        }
                    }
                });
            },
            //登录
            User_login(){
                var that=this;
                $.ajax({
                    type:'post',
                    url:'/api/user/login',
                    data:that.login_userInfo,
                    dataType:'json',
                    success:function(result){
                        console.log(result);
                        alert(result.message);
                        that.lo_re_cp = "ok"
                        that.login_stadus='ok';
                        that.userInfo=result.userInfo;
                        that.update_userInfo = result.userInfo;
                        localStorage.setItem('userInfo',JSON.stringify(result.userInfo));
                    }
                });
            },
            upUserInfo(){
                var that=this;
                let x = document.getElementById('updateImg').files[0];
                if(this.update_userInfo.password==''||this.update_userInfo.sex==''||this.update_userInfo.name==''||this.update_userInfo.age==''){
                    alert("不能为空！");
                }else{
                    if(!x){
                        alert("照片未选择！")
                    }else{
                        if($('#updateImg')[0].files.length>1){
                            alert("图片最多可以上传1张！");
                        }else{
                            var formData = new FormData();
                            for(var index = 0; index < $('#updateImg')[0].files.length; index++){
                                formData.append('file', $('#updateImg')[0].files[index]);
                            }
                            formData.append('password', that.update_userInfo.password);
                            formData.append('sex', that.update_userInfo.sex);
                            formData.append('name', that.update_userInfo.name);
                            formData.append('age', that.update_userInfo.age);
                            formData.append('id', that.update_userInfo._id);
                            console.log(formData);
                            $.ajax({
                                type:'post',
                                url:'/api/user/updateUserInfo',
                                data:formData,
                                dataType: 'JSON',  
                                cache: false,  
                                processData: false, 
                                contentType: false,
                                success:function(result){
                                    alert("修改成功！")
                                    that.cherryAddStadus="ok"
                                    that.userInfo=result.userInfo;
                                    that.update_userInfo = result.userInfo;
                                    localStorage.setItem('userInfo',JSON.stringify(result.userInfo));
                                    console.log(result);
                                }
                            });
                        }
                    }
                }
            },
            //退出登录
            login_out(){
                var that=this;
                $.ajax({
                    type:'get',
                    url:'/api/user/logout',
                    success:function(result){
                        console.log(result);
                        alert("退出登录成功！")
                        that.login_stadus='no';
                        that.lo_re_cp = "login"
                        that.userInfo=null;
                        localStorage.setItem('userInfo',null);
                    }
                });
            },
            getTravalList(){
                this.cab=4
                var that = this;
                $.ajax({
                    type:'get',
                    url:'/api/traval/getAllList',
                    success:function(result){
                        that.travalList = result.travalList
                        console.log(result.travalList)
                    }
                });
            },
            getAllSightListBySeach(){
                var that = this;
                if(this.seachSight==""){
                    this.getTravalList()
                }else{
                    $.ajax({
                        type:'get',
                        url:'/api/traval/mohuchaxun?title='+that.seachSight,
                        success:function(result){
                            that.travalList = result.travalList
                            console.log(result.travalList)
                        }
                    });
                }
            },
            getTravalInfoById(_id,views){
                var that = this;
                $.ajax({
                    type:'get',
                    url:'/api/traval/addViews?_id='+_id+"&views="+views,
                    success:function(result){
                        that.getTravalList()
                    }
                });
                this.cab=6
                $.ajax({
                    type:'get',
                    url:'/api/traval/getTravalInfoById?_id='+_id,
                    success:function(result){
                        that.update_travalInfo = result.update_travalInfo
                        console.log(result.update_travalInfo)
                    }
                });
            },
            addComment(_Id){
                var that = this;
                if(!this.userInfo){
                    alert("你还没登录，请先登录！")
                    return
                }
                if(this.addcomInfo==''){
                    alert("评论不能为空！");
                    
                }else{
                    $.ajax({
                        type:'post',
                        url:'/api/traval/comment',
                        data:{
                            _Id,
                            messageContent:that.addcomInfo,
                            username:that.userInfo.username,
                            img:that.userInfo.head_img
                        },
                        dataType:'json',
                        success:function(result){
                            console.log(result);
                            that.addcomInfo='';
                            that.update_travalInfo = result.newContent
                        }
                    });
                }
            },
            //网页刷新 先获取本地存储的数据
            getuserInfo_bylocal(){
                this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
                this.update_userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if(this.userInfo){
                    this.login_stadus='ok';
                }else{
                    this.login_stadus='no';
                }
            },
            
        },
        created(){
            this.getuserInfo_bylocal()
            this.getTravalList()
        }
    });

    console.log(vm)
});