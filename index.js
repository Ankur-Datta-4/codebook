require("dotenv").config()
const express=require("express")
const {generateFile}=require("./generateFile")
const {executeCpp}=require('./executeCpp')
const App=express();
const cors=require("cors");
const connectDB=require("./db");
const {NotebookModel}=require("./Models")

App.use(cors())
App.use(express.urlencoded({extended:true}))
App.use(express.json())
port=5000

App.get("/",async(req,res)=>{
    try{
        const data=await NotebookModel.find({})
        
    return res.status(200).json(data)
    }catch(e){
        return res.status(500).json({error:e})
    }    

})

App.post("/",async(req,res)=>{
    const {bookName,description="",author,epath,language="cpp", code}=req.body;
    if(code==undefined){
        return res.status(400).json({success:false,error:"no code"})
    }
    let generatedPath;
    let temp_path=epath;
    let output;
    let status=1;
    try{
    //generate File
        if(typeof epath==typeof undefined){
            temp_path=null;
            status=0;
        }
                
        generatedPath=await generateFile(temp_path,language,code);

    
    //record

    if(status===0){
        const record=await NotebookModel.create({bookName,description,author,language,Path:generatedPath})
    }
    
    //execute Cpp
    output=await executeCpp(generatedPath)
    
    }catch(err){
        console.log(err)
        return res.status(400).json({success:false,error:err})
    }
    return res.status(200).json({success:true,generatedPath,output})
})
const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        App.listen(port,console.log(`Server Started Listening at ${port}`));        
    }
    catch(e){
        console.log(e);
    }
}

start()