//文章的路由模块
//导入express
const express = require("express");
//创建路由对象
const router = express.Router();

const userArticle_handler = require("../router_handler/userArticle");

//获取文章列表的路由
router.get("/getUserArticle", userArticle_handler.getUserArticleList);
//标记删除文章的路由
router.get("/deleteUserArticle/:id", userArticle_handler.deleteUserArticle);

module.exports = router;
