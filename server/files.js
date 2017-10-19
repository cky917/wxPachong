'use strict'

const path  = require('path');
const fs = require('fs');
const saveDirUrl = path.resolve(__dirname,'../data/')
const Files = {};

Files.savePostToLocal = (postData) => {
    const wxId = postData.wxId
    const savePostUrl = `${saveDirUrl}/${wxId}.json`
    const savaObj = { updateTime: +new Date() ,result: postData};
    return new Promise((resolve,reject) => {
        try {
            fs.writeFile(savePostUrl,JSON.stringify(savaObj),function(err){
                if(err){
                    console.error(`写入 ${wxId}.json 失败 : ${err}`) 
                    resolve({success:false,msg:`写入 ${wxId}.json 失败 : ${err}`})
                }
                resolve({success:true})
            });
        } catch (err) {
            resolve({success:false,data:`写入 ${wxId}.json 失败 : ${err}`})
        }
        
    });
    
}

Files.readLocalPostById = (wxId) => {
    let localDataUrl = `${saveDirUrl}/${wxId}.json`
    return new Promise((resolve,reject) => {
        try {
            fs.access(localDataUrl, (err) => {
                if(err){ // 文件不存在
                    resolve({success:false,data:{}})
                }else{
                    let postData = fs.readFileSync(localDataUrl)
                    resolve({success:true,data:JSON.parse(postData)})
                }
            })
        } catch (error) {
            resolve({success:false,data:{}})
        }
    })
}

module.exports = Files;