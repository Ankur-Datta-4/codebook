const mongoose=require("mongoose")

const noteBookSchema=new mongoose.Schema({
    bookName:String,
    description:{type:String, required:false},
    author:String,
    language:String,
    Path:{type:String},
    meta:{type:Array, default:[]}
})


const NotebookModel=mongoose.model("NoteBook",noteBookSchema);

module.exports={
    NotebookModel
}