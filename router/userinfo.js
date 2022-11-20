//（获得用户基本信息）路由模块
//导入express
const express = require('express')

//创建路由对象
const router = express.Router()

//导入路由处理函数模块
const userinfo_handler = require('../router_handler/userinfo')
//导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
//导入需要验证规则的对象
const { update_userinfo_schma, update_password_schma, update_avatar_schma } = require('../schema/user')


//挂载路由

//获取用户基本信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo)
//更新用户的信息的路由
router.post('/userinfo', expressJoi(update_userinfo_schma), userinfo_handler.updateUserInfo)
//更新密码的路由
router.post('/updatepwd', expressJoi(update_password_schma), userinfo_handler.updatePassword)
//更新用户头像的路由
// router.post('/update/avatar', expressJoi(update_avatar_schma), userinfo_handler.updateAvatar)
router.post('/update/avatar', userinfo_handler.updateAvatar)


module.exports = router