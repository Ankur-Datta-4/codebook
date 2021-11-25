const {exec}=require("child_process")

const fs=require("fs")
const path=require('path')


const outputPath=path.join(__dirname,"outputs")
if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive:true})
}

const executeCpp=(filePath)=>{

    const jobId=path.basename(filePath).split(".")[0];
    const outPath=path.join(outputPath,`${jobId}.exe`); 
    return new Promise((resolve,reject)=>{1
      exec(`g++ ${filePath} -o ${outPath} && cd ${outputPath} && ${jobId}.exe`,
      (error,stdout,stderr)=>{
          if(error){
              reject({error,stderr});

          }
          if(stderr){
              reject(stderr)
          }
          resolve(stdout);
      })

    })
}

module.exports={
    executeCpp
}