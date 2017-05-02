<template>
  <div class="postList">
    <h1>{{ title }}</h1>
    <ul class="post-list">
        <li v-for="post in postList" class="post-item">
          <a :href="post.articleUrl" target="_blank">{{ post.app_msg_ext_info.title}}</a>
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
      apiUrl:'http://localhost:9001/getWxPostList?wxid=JavaScriptcn'
    }
  },
  created () {
    this.getCustomers()
  },
  methods: {
        getCustomers () {
            console.log(1)
            this.$http.get(this.apiUrl)
                .then((response) => {
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
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
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
.post-item{
    border-bottom: 1px solid #ccc;
}
</style>
