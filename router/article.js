//文章的路由模块
//导入express
const express = require("express");
//创建路由对象
const router = express.Router();

const article_handler = require("../router_handler/article");

//获取文章列表的路由
router.get("/get", article_handler.getArticleList);
//获取文章热门的路由
router.get("/getHot", article_handler.getArticleHotList);
//获取文章列表的路由
router.get("/search", article_handler.getArticleSearch);
//获取文章作者
router.get("/getAuthor/:id", article_handler.getArticleAuthor);
//获取具体某一篇文章的路由（根据id）
router.get("/getArticle/:id", article_handler.getArticle);

module.exports = router;
