import multer from "multer";

const storage=multer.diskStorage({//storing file in diskstorage
    destination:function(req,file,cb){//req for json data, file for file input and cb for call back
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)//this will return the file name
    }
})

export const upload=multer({
    storage,
})