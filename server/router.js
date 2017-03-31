var express = require('express');
var router = express.Router();
var Ut = require('./search');

router.get('/getWxPostList', function(req, res, next) {
    let wxId = req.query.wxid;
    Ut.getWxUrl(wxId).then(rs=>{
        return Ut.getWxPostInfo(rs.data);
    }).then(rs=>{
        res.send({
            code:200,
            msg:'获取成功',
            data:rs,
            success:true
        });
    }).catch(err=>{
        console.log(err);
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