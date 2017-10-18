const AV = require('leancloud-storage');
const Ut = require('./search');
const schedule = require('node-schedule');
const PostList = AV.Object.extend('PostList');
const Save = {}

Save.scheduleRecurrenceRule = () => {
    let rule  = new schedule.RecurrenceRule(); 
    //在指定的小时抓取一次
    rule.hour =[1,7,11,14,16,20];
    rule.minute = 26;
    // doSearch();
    schedule.scheduleJob(rule, function(){
        Save.doSearch();
    });
}

Save.doSearch = () => {
    let wxIdListQuery = new AV.Query('wxIdList');
    let runTime = 0;

    wxIdListQuery.find().then(rs=>{ //获取配置的微信Id列表
        let wxIdList = rs; 
        console.log('定时任务开始执行:' + new Date());
        //为了防止多次出现验证码，延时一分钟分别拉取
        let interval = setInterval(function(){
            
            let wxId = wxIdList[runTime].attributes.wxId;
            console.log(`开始爬取${wxId}的文章`);

            getWxPostAndSave(wxId).then(rs=>{
                if(rs.success){
                    console.log(rs.msg);
                }
            }).catch(err=>{
                console.error('定时获取文章失败：'+ err + new Date());
            });
            if(runTime === wxIdList.length -1){
                clearInterval(interval);
                runTime = 0;
            }else{
                runTime += 1;
            }
            console.log(runTime);
        }, 1000 * 60);
    });
}

//爬取微信文章并存入leancloud
function getWxPostAndSave(wxId){
    return new Promise((resolve,reject)=>{
        let wxPostResult= null;
        //获取微信文章
        Ut.getWxUrl(wxId).then(rs=>{
            if(rs.success){
                return Ut.getWxPostInfo(rs);
            }
        }).then(rs=>{
            //查询存储的数据id
            let query = new AV.Query('PostList');
            query.equalTo('wxId', wxId);
            wxPostResult = rs;
            return query.find();
        }).then(rs=>{
            //根据查询到的Id进行数据更新或者新建
            let qeuryId = rs[0] ? rs[0].id :'';
            let post = AV.Object.createWithoutData('PostList', qeuryId);
            post.set('postList', JSON.stringify(wxPostResult) );
            post.set('wxId',wxId);
            return post.save();
        }).then(rs=>{
            resolve({success:true,msg:'保存成功'});
        }).catch(err=>{
            console.error(err);
            reject(err);
        });
    });
}

module.exports = Save;