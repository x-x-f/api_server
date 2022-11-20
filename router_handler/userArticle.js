//文章的路由模块的处理函数
//导入数据库操作模块
const db = require("../db/index");
//获取文章的处理函数模块
exports.getUserArticleList = (req, res) => {
  // console.log(req.params.id)
  //定义查询用户信息的sql语句
  const sql =
    "select Id,title,content,cover_img,pub_date,cate_id,state,visit_number from ev_articles where author_id=? && is_delete=0";
  console.log(req.auth.id);
  //调用db.query()执行sql语句
  db.query(sql, req.auth.id, (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    console.log(results);
    //用户信息获取成功
    res.send({
      status: 0,
      message: "获取文章信息成功!",
      data: results,
    });
  });
};
//标记删除文章的处理函数模块
exports.deleteUserArticle = (req, res) => {
  console.log(req.params.id);
  //定义查询用户信息的sql语句
  const sql = "update ev_articles set is_delete=1 where Id=?";
  console.log(req.auth.id);
  //调用db.query()执行sql语句
  db.query(sql, [req.params.id], (err, results) => {
    //执行sql语句失败
    if (err) return res.cc("啊哦！服务器遇到了问题！");
    if (results.affectedRows !== 1)
      return res.cc("删除失败！可能已被删除或者不存在！");
    res.cc("删除文章成功！", 0);
  });
};
