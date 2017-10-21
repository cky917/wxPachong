const express = require('express');
const router = express.Router();
const search = require('./search');
const wxIdList = require('../my.config').wxIdList

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
    returnSuccess(res, {data:wxIdList});
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

function isWxIdInConfig(wxId){
    return wxIdList.some(item => item['wxId'] === wxId);
}
module.exports = router;