var AV = require('leancloud-storage');
var Ut = require('./search');
var schedule = require('node-schedule');
var PostList = AV.Object.extend('PostList');

function scheduleRecurrenceRule(){
    var rule  = new schedule.RecurrenceRule();  
    //每隔6小时抓取一次
    rule.hour =[1,10,16,22];
    rule.minute = 0;
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
        let wxPostResultList = [];
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
            //查询存储的数据id
            let queryIdList = [];
            wxPostResultList = rs;
            for(let i = 0;i < wxIdLen; i++){
                let query = new AV.Query('PostList');
                query.equalTo('wxId', wxIdList[i]);
                queryIdList.push(query.find());
            }
            return Promise.all(queryIdList);
        }).then(rs=>{
            //根据查询到的Id进行数据更新或者新建
            let saveWxPostList = [];
            for(let i = 0;i < wxIdLen; i++){
                let qeuryId = rs[i][0] ? rs[i][0].id :'';
                let post = AV.Object.createWithoutData('PostList', qeuryId);
                post.set('postList', JSON.stringify(wxPostResultList[i]));
                post.set('wxId',wxIdList[i]);
                saveWxPostList.push(post.save());
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