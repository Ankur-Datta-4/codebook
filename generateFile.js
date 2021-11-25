const path=require('path')

const fs=require("fs")
const {v4: uuid}=require("uuid")
const dirCodes=path.join(__dirname,"codes")

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive:true})
}

const generateFile=async(existing_path,format,code)=>{
    
    if(existing_path!=null){
        await fs.writeFileSync(existing_path,code);
        return existing_path;
    }
    
    const jobId=uuid()
    const fileName=`${jobId}.${format}`;
    const filePath=path.join(dirCodes,fileName);
    await fs.writeFileSync(filePath,code);
   
    return filePath;

}

module.exports={
    generateFile
}