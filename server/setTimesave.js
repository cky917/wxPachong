const Ut = require('./search');
const schedule = require('node-schedule');
const wxIdList = require('../my.config').wxIdList
const Files = require('./files')
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
    let runTime = 0;
    console.log('定时任务开始执行:' + new Date());
    //为了防止多次出现验证码，延时一分钟分别拉取
    let interval = setInterval(function(){
        
        let wxId = wxIdList[runTime].wxId;
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
    }, 1000 * 10);
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
            wxPostResult = rs;
            let saveObj = {
                postList:JSON.stringify(wxPostResult),
                wxId
            }
            return Files.savePostToLocal(saveObj)
        }).then(rs=>{
            if(rs.success){
                resolve({success:true,msg:'保存成功'});
            }else{
                return Promise.reject(rs.msg)
            }
        }).catch(err=>{
            console.error(err);
            reject(err);
        });
    });
}

module.exports = Save;