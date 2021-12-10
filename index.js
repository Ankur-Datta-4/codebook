require("dotenv").config()
const express=require("express")
const {generateFile}=require("./generateFile")
const {executeCpp}=require('./executeCpp')
const App=express();
const cors=require("cors");
const connectDB=require("./db");
const {NotebookModel}=require("./Models")
const fs=require("fs")
const path=require("path")
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
    const {bookName,description="",author,epath,language="cpp", code,exec}=req.body;
    if(code==undefined){
        return res.status(400).json({success:false,error:"no code"})
    }
    let generatedPath;
    let temp_path=epath;
    let output;
    let status=1;
    let jobId=null;
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
    jobId=record._id;
        console.log(record);
    }
    
    

    //execute Cpp
    if(exec){

        output=await executeCpp(generatedPath)
    }
    
    return res.status(200).json({success:true,generatedPath,output,id:jobId})
    }catch(err){
        console.log(err)
        return res.status(400).json({success:false,error:err})
    }
})


App.get("/:id",async(req,res)=>{

    const id=req.params.id;
    //get path for the id
    try{
    const record= await NotebookModel.findById(id);
    
    

    return res.status(200).json({meta:record.meta, title:record.bookName})

    }catch(e){
    return res.status(200).json({error:e})
    
    }
    //read the file contents

    //output

})


App.patch("/:id",async(req,res)=>{
    try{
        const id=req.params.id;
        const data=req.body.meta;
        const title=req.body.title;
        const flag=await NotebookModel.updateOne({_id:id},{$set: {meta:data,bookName:title}})
        //await NotebookModel.updateOne({_id:id},{$set:{}})
        return res.status(200).json({success:true, msg:"successfully saved"})
    }catch(e){
        console.log(e)
        console.log("inside patch")
        return res.status(400).json({error:e})
    }
})

App.delete("/del",async(req,res)=>{

    try{
        await NotebookModel.deleteMany({})
        return res.status(200).json({deleted:true})
    }catch(e){console.log(e)}
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