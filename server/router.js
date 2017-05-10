var express = require('express');
var router = express.Router();
var Ut = require('./search');

router.get('/api/getWxPostList', function(req, res, next) {
    let wxId = req.query.wxid;
    Ut.getWxUrl(wxId).then(rs=>{
        if(rs.success){
            return Ut.getWxPostInfo(rs);
        }else{
            return rs;
        }
    }).then(rs=>{
        if(rs.success){
            res.send({
                code:200,
                msg:'获取成功',
                data:rs,
                success:true
            });
        }else{
            res.send({
                code:2001,
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

module.exports = router;