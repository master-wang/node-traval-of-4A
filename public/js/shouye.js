$(function(){

    var vm=new Vue({
        delimiters: ['${', '}'],
        el:'#app',
        data:{
            cap:1,
            userInfo:{},
            postForm:{
                title:"",
                type:"",
                desc:"",
                phone:"",
                u_id:""
            },
            faultformlist:[]
        },
        methods: {
            //退出登录
            login_out(){
                var that=this;
                $.ajax({
                    type:'get',
                    url:'/api/user/logout',
                    success:function(result){
                        console.log(result);
                        that.loginOut_tip=result.message;
                        that.userInfo=null;
                        localStorage.setItem('userInfo',null);
                        if(!result.code){
                            alert("退出登录成功！");
                            setTimeout(function(){
                                window.location.href="/"
                            },1000);
                        }
                    }
                });
            },
            //网页刷新 先获取本地存储的数据
            getuserInfo_bylocal(){
                this.userInfo=JSON.parse(localStorage.getItem('userInfo'));
                if(this.userInfo){
                    this.login_stadus='ok';
                }else{
                    alert("你好！还未登录，请先登录！")
                    window.location.href="/"
                }
            },
            goBaoxiu(){
                this.cap=1
            },
            BaoxiuList(){
                this.cap=2
                var that = this;
                axios.get('/api/fault/getList')
                    .then(data=>{
                        console.log(data);
                        that.faultformlist=data.data.faultformlist
                    })
                    .catch(err=>console.log(err));
            },
            postFaultForm(){
                this.postForm.u_id=this.userInfo._id
                var that=this;
                if(this.postFaultForm.title==""||this.postFaultForm.type==""||this.postFaultForm.desc==""||this.postFaultForm.phone==""){
                    alert("不能为空！")
                }else{
                    $.ajax({
                        type:'post',
                        url:'/api/fault/add',
                        data:that.postForm,
                        dataType:'json',
                        success:function(result){
                            console.log(result);
                            alert("提交成功，等待上门处理！")
                            that.postForm={}
                        }
                    });
                }
            },
            
        },
        created(){
             this.getuserInfo_bylocal()
            // this.getCherryList()
        }
    });
});