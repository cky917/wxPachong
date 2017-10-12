const request    = require('request');
const cheerio    = require('cheerio');
const verifyCode = require('./verify');
const Ut         = {};
const AV         = require('leancloud-storage');
const ONEDAYTIME = 60 * 60 * 24 * 1000;
/**
根据微信号搜索公众号,并获取搜素到的第一个公众号链接
@param {string} wxId 微信号
*/
Ut.getWxUrl = function (wxId) {
    var encodeWxId = encodeURIComponent(wxId);
    var url = `http://weixin.sogou.com/weixin?type=1&query=${encodeWxId}&ie=utf8&_sug_=y&_sug_type_=1`;
    return new Promise((resolve,reject)=>{
        request(url, function (err, response, html) {
            if (err){
                reject({msg:err});
            }
            if (html.indexOf('<title>302 Found</title>') != -1){
                reject({msg:'302'});
            }
            if (html.indexOf('您的访问过于频繁') != -1){
                resolve({success:false,url:url,html:html});
            }
            var $ = cheerio.load(html);
            //公众号页面的临时url
            var wechatObj = $($("#sogou_vr_11002301_box_0 a")[0]);
            var wechatNum = wechatObj.attr('href') || '';
            var wechatName =$($("#sogou_vr_11002301_box_0 [uigs=account_name_0]")[0]).text();
            resolve({
                success:true,
                url:wechatNum.replace(/amp;/g, ''),
                wxName:wechatName
            });
        });
    });
};

/**
获取最近10条图文信息列表
@param {string} url 根据getWxUrl方法得到的公众号链接
*/
Ut.getWxPostInfo = function (data) {
    let url = data.url;
    let wxName = data.wxName;
    return new Promise((resolve,reject)=>{
        Ut.requestSync(url).then(rs=>{
            if(rs.err){
                reject({msg:' 获取图文信息列表失败 ' + rs.err});
            }
            if(rs.html.indexOf('为了保护你的网络安全，请输入验证码') != -1) {
                return verifyCode(rs.html,url);
            }else{
                return {success:true,html:rs.html};
            }
        }).then(rs=>{
            if(rs.success){
                var articles = [];
                //文章数组,页面上是没有的,在js中,通过正则截取出来
                var msgList = rs.html.match(/var msgList = ({.+}}]});?/);
                if(!msgList){
                    reject({msg:`-没有搜索到 ${publicNum} 的文章,只支持订阅号,服务号不支持!`});
                }
                //返回的最近20条，第二项是最近10条
                msgList = msgList[1];
                msgList = msgList.replace(/(&quot;)/g, '\\\"').replace(/(&nbsp;)/g, '');
                msgList = JSON.parse(msgList);
                if (msgList.list.length == 0){
                   reject({msg:`-没有搜索到 ${publicNum} 的文章,只支持订阅号,服务号不支持!`});
                }
                msgList.list.forEach( function(element, index) {
                    let post = element;
                    post.articleUrl = 'http://mp.weixin.qq.com' + post.app_msg_ext_info.content_url.replace(/(amp;)|(\\)/g, '');
                    post.wxName = wxName;
                    articles.push(element);
                });
                resolve({
                    articles:articles,
                    success:true
                });
            }else{
                resolve(rs);
            }
        }).catch(err=>{
            reject(err);
        });
    });
};
//获取已保存的文章列表
Ut.getPostList = function(wxId){
    return new Promise((resolve,reject)=>{
        let query = new AV.Query('PostList');
        query.equalTo('wxId', wxId);
        query.find().then(function (rs) {
            if(rs[0]){
                let result = rs[0].attributes;
                result.postList = JSON.parse(result.postList)
                resolve({success:true,data:result});
            }else{
                reject({success:false,data:rs});
            }
        }).catch(err=>{
            console.error(err);
        });
    })
}

//获取获取最近更新文章列表
Ut.getNearlyPostList = function(){
    return new Promise((resolve,reject)=>{
        let result = [];
        let query = new AV.Query('PostList');
        query.find().then(function (rs) {
            let postList = rs;
            postList.forEach(item=>{
                let myPostList = JSON.parse(item.attributes.postList).articles;
                result = result.concat(Ut.getPostUnder24Hours(myPostList))
            });
            result.sort((a,b)=>{
                return b.comm_msg_info.datetime - a.comm_msg_info.datetime;
            });
            resolve({success:true,data:result});
        }).catch(err=>{
            console.error(err);
            resolve({success:true,data:result});
        });
    })
}
//让request模块返回一个Promise对象
Ut.requestSync = function(url){
    return new Promise((resolve,reject)=>{
        let options = {
            url:url,
            headers: {
              "x-forwarded-for":"10.111.198.90"
            }
        }
        request(options,function (err, response, html){
            resolve({err:err,response:response,html:html});
        });
    });
};

Ut.getPostUnder24Hours = function(postList){
    let now = + new Date();

    return postList.filter(item=>{
        let creatTime = item.comm_msg_info.datetime * 1000;
        return now - creatTime < ONEDAYTIME * 3;
    });
}
module.exports = Ut;