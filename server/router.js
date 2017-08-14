var express = require('express');
var AV = require('leancloud-storage');
var router = express.Router();
var Ut = require('./search');

router.get('/api/getWxPostList', function(req, res, next) {
    let wxId = req.query.wxid;
    Ut.getPostList(wxId).then(rs=>{
        if(rs.success){
            res.send({
                code:200,
                msg:'获取成功',
                data:rs.data.postList.articles,
                success:true
            });
        }else{
            res.send({
                code:200,
                msg:rs.msg,
                data:rs,
                success:false
            });
        }
    }).catch(err=>{
        if(err.msg){
            res.send({
                code:200,
                msg:err.msg,
                success:false
            });
        }else{
            res.send({
                code:500,
                msg:err||err.message,
                success:false
            });
        }
    });
});
/**
 * @Author      chenkeyi
 * @DateTime    2017-08-14
 * @description 获取配置的微信id列表
 */
router.get('/api/getWxIdList',(req,res,next)=>{
    let wxIdListQuery = new AV.Query('wxIdList');
    wxIdListQuery.find().then(rs=>{ //获取配置的微信Id列表
        let wxIdList = [];
        for (let item of rs) {
           wxIdList.push({ name:item.attributes.wxName, wxId:item.attributes.wxId});
        }
        res.send({
            code:200,
            msg:'获取成功',
            data:wxIdList,
            success:true
        });
    }).catch(err=>{
        res.send({
            code:500,
            msg:err||err.message,
            success:false
        });
    });
});

module.exports = router;