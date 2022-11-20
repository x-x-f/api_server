//导入express
const express = require("express");

//创建一个服务器实例
const app = express();

//导入验证数据规则的包
const joi = require("joi");

//使用cors,允许跨域资源共享
const cors = require("cors");
app.use(cors());

//解析post提交过来的表单数据
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//一定要在路由之前，封装res.cc函数
app.use((req, res, next) => {
  //为res添加一个cc函数
  //status默认值为1，表示失败的情况
  //err的值，可能是一个错误对象，或错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

//一定要在路由之前配置Token的中间件
const expressJWT = require("express-jwt");
//导入全局配置文件
const config = require("./config");
app.use(
  expressJWT
    .expressjwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] })
    .unless({ path: [/\/api\//, /\/public\//] })
);
// app.use(expressJWT.expressjwt({ secret: config.jwtSecretKey,algorithms: ["HS256"] }).unless({path: ["/my/article/",/\/api\//,/\/public\//]}))
//托管静态资源
app.use("/public", express.static("./public"));

//导入并使用用户路由模块(用户注册与登录)
const userRouter = require("./router/user");
app.use("/api", userRouter);

//导入并使用用户路由模块(用户基本信息)
const userinfoRouter = require("./router/userinfo");
app.use("/my", userinfoRouter);
//导入并使用文章分类路由模块
const artCateRouter = require("./router/artcate");
app.use("/api/article", artCateRouter);
//导入并使用文章的路由模块
const articleRouter = require("./router/article");
app.use("/api/article", articleRouter);

//导入并使用图片上传的路由模块
const imageRouter = require("./router/image");
app.use("/my/images", imageRouter);

//导入文章处理的路由模块
const article_contentRouter = require("./router/articles_Content");
app.use("/my/article", article_contentRouter);

//导入用户文章处理的路由模块
const Userarticle_Router = require("./router/userArticle");
app.use("/my/UserArticle", Userarticle_Router);

//定义错误级别中间件
app.use((err, req, res, next) => {
  //数据验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc("格式不正确！");
  //这次错误是由(身份认证失败)token解析失败导致的
  if (err.name === "UnauthorizedError")
    return res.cc("无效token,身份信息已失效！");
  if (err.name === "socket") return res.cc("socket错误！");
  //未知错误
  res.cc(err);
});

//调用app.listen方法，指定端口号并启动web服务器
app.listen("5005", (err) => {
  if (!err) console.log("服务器启动成功！");
});
