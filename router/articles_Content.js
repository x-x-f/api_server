//文章的处理的路由模块
//导入express
const express = require('express')
//创建路由对象
const router = express.Router()

const article_handler = require('../router_handler/articles_Content')

//添加文章到草稿箱的路由
router.post('/add', article_handler.addArticle_Draft)
//获取草稿箱文章(作者id)的路由
router.get('/get/:id', article_handler.getArticle_Draft)
//获取草稿箱文章(文章id)的路由
router.get('/delete/:id', article_handler.deleteArticle_Draft)
//发布文章的路由
router.post('/release', article_handler.releaseArticle)
 
module.exports = router