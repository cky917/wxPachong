const request = require('request');
const cheerio = require('cheerio');

let verify = {};

/**
通过第三方接口,解决搜狗微信验证码
@param {string} html ,从html获取验证码等信息
@param {string} url  ,验证成功后重新访问的url即公众号链接
*/
verify.solveVerifycode = function(html,url) {
    console.log('识别验证码');
    return new Promise((resolve,reject)=>{
        verify.getBase64Img(html).then(base64=>{
            return verify.identifyCode(base64);
        }).then(verifycode=>{
            return verify.virifyCode(verifycode);
        }).then(rs=>{
            if(rs){
                //验证成功重新进入页面
                request(url, function (err, response, html) {
                    if (err){
                        reject(err);
                    }
                    //搜狗微信的验证码即使输入成功,有的时候也需要输入几次验证码,所以重复调用solve_verifycode方法
                    if (html.indexOf('为了保护你的网络安全，请输入验证码') != -1) {
                        return verify.solveVerifycode(html, url);
                    }
                    resolve({success:true,html:html});
                });
            }
        }).catch(err=>{
            reject(err);
        });
    });
};

//获取base64格式的验证码图片
verify.getBase64Img = function(html){
    return new Promise((resolve,reject)=>{
        var $ = cheerio.load(html);
        var imgUrl = `http://mp.weixin.qq.com/mp/verifycode?cert=${(new Date).getTime() + Math.random()}`;
        verify.cert = imgUrl.split('=')[1];
        var jar = request.jar();
        request.get({ url: imgUrl, encoding: 'base64', jar: jar }, function (err, response, body) {
            if (err){
                console.log(err)
                reject(err);
            }
            var cookieString = jar.getCookieString(imgUrl);
            verify.codeCookie = cookieString;
            resolve(body);
        });
    });
};

//通过第三方接口识别验证码,并返回
verify.identifyCode = function(base64){
    return new Promise((resolve,reject)=>{
        var form = {
            img_base64: base64,
            typeId:34,
            showapi_appid:'37185',
            showapi_sign:'4218dd3bd9174ee4ba3b24e0bfeacee8',
        };
        var opts = {
            url: 'http://route.showapi.com/184-5',
            method: 'POST',
            formData: form,
            json: true,
        };
        verify.requestJson(opts).then(data=>{
            if (data.showapi_res_code == 0) {
                console.log('识别base64验证码成功：'+data.showapi_res_body.Result)
                resolve(data.showapi_res_body.Result);
            }else{
                reject({ msg:data.showapi_res_error,code:data.showapi_res_code });
            }
        }).catch(err=>{
            console.error(err);
            reject(err);
        });
    });
}
//验证验证码是否正确
verify.virifyCode = function(verifycode,codeCookie){
    return new Promise((resolve,reject)=>{
        var verifycode_url = `http://mp.weixin.qq.com/mp/verifycode?cert=${encodeURIComponent(verify.cert)}&input=${encodeURIComponent(verifycode)}`;
        var form = {
            input: encodeURIComponent(verifycode),
            cert: encodeURIComponent(verify.cert)
        };
        var options = {
            url: verifycode_url,
            json: true,
            formData: form,
            method: 'post',
            headers: { "Cookie": verify.codeCookie }
        };
        verify.requestJson(options).then(rs=>{
            console.log('验证码识别成功');
            resolve(true);
        }).catch(err=>{
            console.error(err);
            reject(err);
        });
    });
};

/**
request的ajax获取方法,某些网站反爬,可以自定义头部
  var options = {
    url: url,
    json:true,
    method : 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 
       (KHTML, like Gecko) Chrome/54.0.2840.87 Safari/537.36',
      'X-Requested-With':'XMLHttpRequest'
    }
  };
*/
verify.requestJson = function(options) {
    return new Promise((resolve,reject)=>{
        console.log(options)
        request(options, function (error, response, body) {
            console.dir(error, response, body)
            if (error){
                console.error(error);
                reject(error);
            }
            if (response.statusCode != 200){
                reject("statusCode" + response.statusCode);
            }
            resolve(body);
        });
    });
};

module.exports = verify.solveVerifycode;