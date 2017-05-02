<template>
    <div class="post">
        <h1 class="post-box-title">{{ title }}</h1>
        <ul class="post-list">
            <li v-for="post in postList" class="post-item">
                <h3 class="post-title">
                    <a :href="post.articleUrl" target="_blank">{{ post.app_msg_ext_info.title}}</a>
                    <span class="post-time">{{ post.comm_msg_info.datetime|formatTime }}</span>
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
            title: '文章列表-JavaScriptcn',
            postList:[],
            apiUrl:'http://localhost:9001/getWxPostList?wxid=JavaScriptcn'
        }
    },
    created () {
        this.getCustomers()
    },
    methods: {
        getCustomers () {
            this.$http.get(this.apiUrl).then((response) => {
                let res = response.body;
                if(res.success){
                    this.postList = res.data.articles;
                }else{
                    alert(res.msg);
                }
            })
            .catch(function(response) {
                console.log(response)
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
            var hour = time.getHours();
            var minute = time.getMinutes();
            var second = time.getSeconds();

            return `${year}-${add0(month)}-${add0(day)} ${add0(hour)}:${add0(minute)}:${add0(second)}`;
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
.post-time{
    font-size: 14px;
    color:#666;
}
</style>
