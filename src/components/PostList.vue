<template>
    <div class="post">
        <h1 class="post-box-title">{{ title }}-{{ wxName }}</h1>
        <div class="post-nav">
            <el-menu :default-active="activeIndex" class="post-nav-list" mode="horizontal" @select="handleSelect">
                <el-menu-item index="1" @click="">最近文章</el-menu-item>
                <el-submenu index="2">
                    <template slot="title">推荐公众号</template>
                    <el-menu-item v-for="(searchItem,index) in wxNameList" @click="doSearch(searchItem.wxId)" :index="'2-'+index" :key="searchItem.id" >{{ searchItem.name }}</el-menu-item>
                </el-submenu>
                <li class="post-search">
                    <input name="searchName" placeHolder="请输入您要搜索的微信号" v-model="searchName">
                    <span v-on:click="doSearch">搜索</span>
                </li>
            </el-menu>
        </div>
        <ul class="post-list">
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
            wxName:'',
            searchName:'JavaScriptcn',
            apiUrl:'/getWxPostList',
            wxNameList:[{name:'JavaScript',wxId:'JavaScriptcn'},
                        {name:'前端JavaScript',wxId:'cjscwe_2015'},
                        {name:'前端早读课',wxId:'FeZaoDuKe'}],
            activeIndex: '1',
            dialogVisible:false,
            verifyHtml:''
        }
    },
    created () {
        this.getCustomers()
    },
    methods: {
        getCustomers () {
            let searchUrl = `${this.apiUrl}/?wxid=${this.searchName}`;
            this.$http.get(searchUrl).then((response) => {
                let res = response.body;
                if(res.success){
                    this.postList = res.data.articles;
                    this.wxName = res.data.articles[0].wxName;
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
            })
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        doSearch(wxId){
            if(typeof wxId == 'string'){
                this.searchName = wxId
            }
            this.getCustomers();
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
