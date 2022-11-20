//图片的路由模块
//导入express
const express = require('express')
//创建路由对象
const router=express.Router()

const image_handler= require('../router_handler/image')

//上传图片的路由
router.post('/image',image_handler.sendimage)

module.exports=router