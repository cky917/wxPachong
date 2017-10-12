<template>
    <div class="post">
        <h1 class="post-box-title">{{ wxName }}</h1>
        <div class="post-nav">
            <el-menu :default-active="activeIndex" class="post-nav-list" mode="horizontal">
                <el-submenu index="1">
                    <template slot="title">推荐公众号</template>
                    <el-menu-item v-for="(searchItem,index) in wxNameList" @click="doSearch(searchItem.wxId,searchItem.name)" :index="'1-'+index" :key="searchItem.id" >{{ searchItem.name }}</el-menu-item>
                </el-submenu>
                <li class="post-search">
                    <input name="searchId" placeHolder="请输入公众微信号" v-model="searchId">
                    <span v-on:click="doSearch">搜索</span>
                </li>
            </el-menu>
        </div>
        <ul class="post-list" v-loading="loading" element-loading-text="拼命加载中">
            <li v-for="post in postList" class="post-item">
                <h3 class="post-title">
                    <a :href="post.articleUrl" target="_blank">{{ post.app_msg_ext_info.title}}</a>
                    <span class="post-time">{{ post.comm_msg_info.datetime|formatTime }}</span>
                    <span class="post-from">来自: {{ post.wxName }}</span>
                </h3>
                <p class="post-desc">{{ post.app_msg_ext_info.digest }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'postList',
    data () {
        return {
            title: '最近文章',
            postList:[],
            wxName:'最近三天文章',
            searchId:'',
            apiUrl:'/api/getWxPostList/',
            wxNameList:[],
            activeIndex: '1',
            dialogVisible:false,
            verifyHtml:'',
            wxPostList:{},
            loading:false,
        }
    },
    created () {
        this.getWxIdList()
    },
    methods: {
        getWxIdList () {
            this.loading = true;
            this.$http.get('/api/getWxIdList').then((response) => {
                let res = response.body;
                if(res.success){
                    let wxNameList = [{name:'最近三天文章',wxId:'all'}]
                    this.wxNameList = wxNameList.concat(res.data);
                    this.wxId = wxNameList[0].wxId;
                    
                    this.getNearlyPost();
                }else{
                    if(res.code == 2001){
                        this.openVerify(res.data);
                    }else{
                        this.showMsg(res.msg);
                    }
                }
            })
            .catch(function(response) {
                console.log(response)
                this.loading = false;
            })

            
        },
        doSearch(wxId,wxName){
            if(typeof wxId == 'string' && wxId != 'all'){
                this.searchId = wxId
            }
            this.getPostList(wxId,wxName);
        },
        openVerify(data){
            const h = this.$createElement;
            this.$msgbox({
                title: '消息',
                message: h('iframe',{ attrs: { src :data.url }},null),
            });
        },
        showMsg(msg){
            this.$alert(msg, '消息提示', {
                confirmButtonText: '确定',
            });
        },
        getPostList(wxId,wxName){
            this.loading = true;
            let searchUrl = `${this.apiUrl}?wxid=${wxId}`;
            let wxPostList = this.wxPostList[wxId];
            //缓存获取的文章列表
            if(wxPostList){
                this.postList = wxPostList;
                this.wxName = wxName;
                this.loading = false;
            }else{
                this.$http.get(searchUrl).then((response) => {
                    let res = response.body;
                    if(res.success){
                        this.postList = res.data;
                        this.wxName = res.data[0].wxName;
                        this.wxPostList[wxId] = res.data;
                    }else{
                        if(res.code == 2001){
                            this.openVerify(res.data);
                        }else{
                            this.showMsg(res.msg);
                        }
                    }
                    this.loading = false;
                })
                .catch(function(response) {
                    console.log(response)
                    this.loading = false;
                })
            }
        },
        /* 获取最近文章 */
        getNearlyPost:function(){
            this.loading = true;
            this.$http.get('/api/getNearlyPost').then((response) => {
                let res = response.body;
                if(res.success){
                    this.wxPostList[this.wxId] = this.postList = res.data;
                }else{
                    if(res.code == 2001){
                        this.openVerify(res.data);
                    }else{
                        this.showMsg(res.msg);
                    }
                }
                this.loading = false;
            })
            .catch(function(response) {
                console.log(response)
                this.loading = false;
            })
        }
    },
    filters: {
        formatTime: function (value) {
            if (!value){
                return '';
            }
            if(value.toString().length == 10){
                value = value * 1000;
            }
            function add0(m) {
                return m < 10 ? '0' + m : m
            }
            var time = new Date(parseInt(value));
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var day = time.getDate();

            return `${year}-${add0(month)}-${add0(day)}`;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  margin: 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0 10px;
}

a {
  color: #42b983;
}
button{
    border:none;
    outline: none;
}
.post-list{
    max-width: 800px;
    margin: 50px auto;
}
.post-box-title{
    background: #444;
    color: #fff;
    height: 100px;
    line-height: 100px;
}
.post-item{
    text-align: justify;
    padding:10px;
    border:1px solid #fff;
    transition:all .3s ease;
}
.post-item:hover{
    border-color:#ccc;
}
.post-item:hover a{
    color:#42b983;
}
.post-title{
    font-size: 18px;
    color: #333;
    line-height: 26px;
    margin: 0 0 8px 0;
}
.post-title a{
    text-decoration: none;
    color: #333;
    transition:all .3s ease;
}
.post-time,.post-from{
    font-size: 14px;
    color:#666;
}
.post-load-btn{
    background: #444;
    color: #fff;
    border-radius: 2px;
    margin-bottom: 40px;
    cursor: pointer;
}
.post-nav{
    background: #eef1f6;
}
.post-nav-list{
    max-width: 800px;
    margin: 0 auto;
}
.post-search {
    margin-top: 10px;
}
.post-search{
    font-size: 0;
    position: relative;
}
.post-search input{
    display: inline-block;
    font-size: 12px;
    width: 150px;
    height: 20px;
    text-indent: 3px;
}
.post-search span{
    display: inline-block;
    font-size: 12px;
    width: 40px;
    height: 20px;
    background: #444;
    color: #fff;
    padding: 2px;
    cursor: pointer;
}

</style>
