import * as express  from "express";

const router = express()

router.get("/server",(req,res)=>{res.json({"message":"Server is running on 4000"})})

export {router}