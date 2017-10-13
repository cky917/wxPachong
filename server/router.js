var express = require('express');
var AV = require('leancloud-storage');
var router = express.Router();
var search = require('./search');

router.get('/api/getWxPostList' , function (req, res, next) {
    let wxId = req.query.wxid;

    search.getPostList(wxId).then(rs=>{
        if(rs.success){
            returnSuccess(res,{ data:rs.data.postList.articles });
        }else{
            returnFail(res,{ data:rs, msg:rs.msg, code:200 });
        }
    }).catch(err=>{
        if(err.msg){
            returnFail(res,{ msg:err.msg, code:200 });
        }else{
            returnFail(res,{ msg: err || err.message });
        }
    });
})

router.get('/api/getNearlyPost', function(req, res, next) {
    search.getNearlyPostList().then(rs=>{
        if(rs.success){
            returnSuccess(res, { data:rs.data });
        }else{
            returnFail(res, { data:rs, msg:rs.msg, code:200 });
        }
    }).catch(err=>{
        if(err.msg){
            returnFail(res, { msg:err.msg, code:200 });
        }else{
            returnFail(res, { msg: err || err.message });
        }
    });
});


/**
 * @Author      chenkeyi
 * @DateTime    2017-08-14
 * @description 获取配置的微信id列表
 */
router.get('/api/getWxIdList',(req, res, next)=>{
    let wxIdListQuery = new AV.Query('wxIdList');
    wxIdListQuery.find().then(rs=>{ //获取配置的微信Id列表
        let wxIdList = [];
        for (let item of rs) {
           wxIdList.push({ name:item.attributes.wxName, wxId:item.attributes.wxId});
        }
        returnSuccess(res, { data:wxIdList });
    }).catch(err=>{
        returnFail(res, { msg: err || err.message });
    });
});

function returnSuccess(res,opts){
    let defaultData = {
        code:200,
        msg:'获取成功',
        success:true
    }
    res.send(Object.assign(defaultData,opts));
}
function returnFail(res,opts){
    let defaultData = {
        code:500,
        msg:'获取失败',
        success:false
    }
    res.send(Object.assign(defaultData,opts));
}
module.exports = router;