
$(function(){
    var vm=new Vue({
        delimiters: ['${', '}'],
        el:'#app',
        data:{
            cab:1,
            userInfo:{},
            update_userInfo:{},
            register_userInfo:{
                username:"",
                password:"",
                repassword:""
            },
            usersList:[],
            faultformlist:[],
            editUserId:0,
            tourInfo:{
                title:"",
                city:"",
                desc:"",
                price:""
            },
            update_travalInfo:{},
            travalList:[],
            travalComments:{}
        },
        methods: {
            
            //网页刷新 先获取本地存储的数据
            getuserInfo_bylocal(){
                this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
                this.update_userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if(this.userInfo){
                    this.login_stadus='ok';
                }else{
                    alert("你好！还未登录，请先登录！")
                    window.location.href="/"
                }
            },
            getuserList(){
                this.cab=2
                var that = this;
                $.ajax({
                    type:'get',
                    url:'/api/user/getAllList',
                    success:function(result){
                        that.usersList = result.usersList
                        console.log(result.usersList)
                    }
                });
            },
            userAdd(){
                this.cab=3
            },
            User_resister(){
                var that=this;
                $.ajax({
                    type:'post',
                    url:'/api/user/register',
                    data:that.register_userInfo,
                    dataType:'json',
                    success:function(result){
                        alert("添加成功！");
                    }
                });
            },
            deleteUserById(_id){
                var that = this;
                if(confirm("确定要删除吗？")){
                    $.ajax({
                        type:'get',
                        url:'/api/user/delete?_id='+_id,
                        success:function(result){
                            that.usersList = result.usersList
                            console.log(result.usersList)
                        }
                    });
                }
            },
            getUserInfoById(_id){
                var that=this;
                $.ajax({
                    type:'get',
                    url:'/api/user/getUserInfoById?_id='+_id,
                    success:function(result){
                        that.update_userInfo = result.update_userInfo
                        console.log(result.update_userInfo)
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
                                    that.update_userInfo = result.userInfo;
                                    localStorage.setItem('userInfo',JSON.stringify(result.userInfo));
                                    console.log(result);
                                }
                            });
                        }
                    }
                }
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
            travalAdd(){
                this.cab=5
            },
            addTraval(){
                var that=this;
                let x = document.getElementById('updateTravalImg').files[0];
                if(this.tourInfo.title==''||this.tourInfo.city==''||this.tourInfo.desc==''||this.tourInfo.price==''){
                    alert("不能为空！");
                }else{
                    if(!x){
                        alert("照片未选择！")
                    }else{
                        if($('#updateTravalImg')[0].files.length>1){
                            alert("图片最多可以上传1张！");
                        }else{
                            var formData = new FormData();
                            for(var index = 0; index < $('#updateTravalImg')[0].files.length; index++){
                                formData.append('file', $('#updateTravalImg')[0].files[index]);
                            }
                            formData.append('title', that.tourInfo.title);
                            formData.append('city', that.tourInfo.city);
                            formData.append('desc', that.tourInfo.desc);
                            formData.append('price', that.tourInfo.price);
                            formData.append('u_id', that.userInfo._id);
                            console.log(formData);
                            $.ajax({
                                type:'post',
                                url:'/api/traval/addTraval',
                                data:formData,
                                dataType: 'JSON',  
                                cache: false,  
                                processData: false, 
                                contentType: false,
                                success:function(result){
                                    alert("添加成功！")
                                }
                            });
                        }
                    }
                }
            },
            getTravalInfoById(_id){
                this.cab=6
                var that=this;
                $.ajax({
                    type:'get',
                    url:'/api/traval/getTravalInfoById?_id='+_id,
                    success:function(result){
                        that.update_travalInfo = result.update_travalInfo
                        console.log(result.update_travalInfo)
                    }
                });
            },
            commentsDao(_id){
                this.cab=7
                var that=this;
                $.ajax({
                    type:'get',
                    url:'/api/traval/getTravalInfoById?_id='+_id,
                    success:function(result){
                        that.travalComments = result.update_travalInfo
                        console.log(result.update_travalInfo)
                    }
                });
            },
            commentdelete(c){

                var that = this;
                $.ajax({
                    type:'post',
                    url:'/api/traval/commentdelete',
                    data:{
                        c,
                        _id:that.travalComments._id
                    },
                    dataType:'json',
                    success:function(result){
                        alert("删除成功！")
                        that.commentsDao(that.travalComments._id)
                    }
                });
            },
            editTraval(){
                var that=this;
                let x = document.getElementById('upTravalImg').files[0];
                if(this.update_travalInfo.title==''||this.update_travalInfo.city==''||this.update_travalInfo.desc==''||this.update_travalInfo.price==''){
                    alert("不能为空！");
                }else{
                    if(!x){
                        alert("照片未选择！")
                    }else{
                        if($('#upTravalImg')[0].files.length>1){
                            alert("图片最多可以上传1张！");
                        }else{
                            var formData = new FormData();
                            for(var index = 0; index < $('#upTravalImg')[0].files.length; index++){
                                formData.append('file', $('#upTravalImg')[0].files[index]);
                            }
                            formData.append('title', that.update_travalInfo.title);
                            formData.append('city', that.update_travalInfo.city);
                            formData.append('desc', that.update_travalInfo.desc);
                            formData.append('price', that.update_travalInfo.price);
                            formData.append('u_id', that.userInfo._id);
                            formData.append('_id', that.update_travalInfo._id);
                            console.log(formData);
                            $.ajax({
                                type:'post',
                                url:'/api/traval/editTraval',
                                data:formData,
                                dataType: 'JSON',  
                                cache: false,  
                                processData: false, 
                                contentType: false,
                                success:function(result){
                                    alert("修改成功！")
                                    that.cab=4
                                    that.getTravalList()
                                }
                            });
                        }
                    }
                }

            },
            deleteTravalById(id){
                var that = this;
                if(confirm("确定要删除吗？")){
                    $.ajax({
                        type:'get',
                        url:'/api/traval/delete?_id='+id,
                        success:function(result){
                            that.getTravalList()
                        }
                    });
                }
            },
            getCommentsList(){
                this.cab=7
            }
            
        },
        created(){
            this.update_userInfo = JSON.parse(localStorage.getItem('userInfo'));
            this.getuserInfo_bylocal()
            //this.getTuxinghua()
        },
        mounted() {
            //this.getTuxinghua()
        },
    });
    console.log(vm)
});