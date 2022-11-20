//路由模块（文章分类）
//导入express
const express = require('express')
//创建路由对象
const router=express.Router()
//导入文章分类的路由处理函数模块
const artCate_handler=require('../router_handler/artcate')

//导入验证数据的中间件
const expressJoi=require('@escook/express-joi')
//导入需要验证规则的对象
const {add_cate_schma,delete_cate_schma,get_cate_schma,update_cate_schma}=require('../schema/artcate')



//获取文章分类的路由
router.get('/cates',artCate_handler.getArticleCates)

//新增文章分类的路由
router.post('/addcates',expressJoi(add_cate_schma),artCate_handler.addArticleCates)

//删除文章分类的路由
router.get('/deletecate/:id',expressJoi(delete_cate_schma),artCate_handler.deleteArticleCates)

//根据id获取文章分类的路由
router.get('/cates/:id',expressJoi(get_cate_schma),artCate_handler.getArticleCateById)

//根据id更新文章分类的路由
router.post('/updatecate',expressJoi(update_cate_schma),artCate_handler.updateArticleCateById)


module.exports=router