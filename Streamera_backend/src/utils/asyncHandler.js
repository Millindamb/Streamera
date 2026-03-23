//2nd Way(promises)
const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler}

//1st Way(try-catch)
//this is a wrapper function which can be used every where
// const asyncHandler=(fn)=>async(req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }catch(error){
//         res.status(error.code || 500).json({//sending a message in case of error for understanding
//             success:false,
//             message:error.message
//         })
//     }
// }

//syntax steps
//const asyncHandler=()=>{}
//const asyncHandler=()=>{()=>{}}
//const asyncHander=()=()=>{}