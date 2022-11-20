//路由模块（用户的创建与登录）
//导入express
const express = require('express')
//创建路由对象
const router=express.Router()

//导入用户路由处理函数对应的模块
const user_handler=require('../router_handler/user')

//导入验证数据的中间件
const expressJoi=require('@escook/express-joi')
//导入需要验证规则的对象
const {reg_register_schema,reg_login_schema}=require('../schema/user')

//发送验证码
router.post('/send',user_handler.send)

//注册新用户
router.post('/register',expressJoi(reg_register_schema),user_handler.register)

//登陆
router.post('/login',expressJoi(reg_login_schema),user_handler.login)

//暴露路由模块
module.exports=router