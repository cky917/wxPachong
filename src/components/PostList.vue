<template>
    <div class="post">
        <h1 class="post-box-title">{{ title }}-{{ wxName }}</h1>
        <div class="post-search">
            <input name="searchName" placeHolder="请输入您要搜索的微信号" v-model="searchName">
            <span v-on:click="doSearch">搜索</span>
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
            title: '文章列表',
            postList:[],
            wxName:'',
            searchName:'JavaScriptcn',
            apiUrl:'http://localhost:9001/getWxPostList'
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
                    alert(res.msg);
                }
            })
            .catch(function(response) {
                console.log(response)
            })
        },
        doSearch(){
            this.getCustomers();
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
            var hour = time.getHours();
            var minute = time.getMinutes();
            var second = time.getSeconds();

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
.post-search {
    margin-top: 10px;
}
.post-search{
    font-size: 0;
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
.post-search span:hover{
    background-color: #272822;
}
</style>
