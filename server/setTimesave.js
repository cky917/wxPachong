var AV = require('leancloud-storage');
var Ut = require('./search');
var schedule = require('node-schedule');
var PostList = AV.Object.extend('PostList');

function scheduleRecurrenceRule(){
    var rule = new schedule.RecurrenceRule();
    //每天6点和15点抓取一次
    rule.hour =[9,15];
    schedule.scheduleJob(rule, function(){
        let wxIdList = ['JavaScriptcn','cjscwe_2015','FeZaoDuKe'];
        console.log('定时任务开始执行:' + new Date());
        getWxPostAndSave(wxIdList).then(rs=>{
            if(rs.success){
                console.log(rs.msg);
            }
        }).catch(err=>{
            console.error('定时获取文章失败：'+err);
        });
        
    });
   
}

//爬取微信文章并存入leancloud
function getWxPostAndSave(wxIdList){
    return new Promise((resolve,reject)=>{
        let searchWxUrlList = [];
        let wxIdLen = wxIdList.length;
        //批量获取微信路径
        for(let i = 0;i < wxIdLen; i++){
            searchWxUrlList.push(Ut.getWxUrl(wxIdList[i]));
        }
        //批量获取微信文章
        Promise.all(searchWxUrlList).then(rs=>{
            let searchWxPostList = [];
            for(let i = 0;i < rs.length;i++){
                if(rs[i].success){
                    searchWxPostList.push(Ut.getWxPostInfo(rs[i]));
                }
            }
            return Promise.all(searchWxPostList);
        }).then(rs=>{
            let saveWxPostList = [];
            for(let i = 0;i < wxIdLen; i++){
                let postList = new PostList();
                postList.set('wxId',wxIdList[i]);
                postList.set('postList',JSON.stringify(rs[i]));
                saveWxPostList.push(postList.save());
            }
            return Promise.all(saveWxPostList);
        }).then(rs=>{
            resolve({success:true,msg:'保存成功'});
        }).catch(err=>{
            console.error(err);
            reject(err);
        });
    })
}

module.exports = scheduleRecurrenceRule;