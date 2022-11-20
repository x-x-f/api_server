//文章的路由模块的处理函数
//导入数据库操作模块
const db = require("../db/index");
//获取文章列表的处理函数模块
exports.getArticleList = (req, res) => {
  console.log(req.query);
  var sql = "";
  //定义查询用户信息的sql语句
  const sql1 =
    "select Id,title,cover_img,pub_date,cate_id,author_id,visit_number from ev_articles where is_delete=0 && state=1";
  const sql2 =
    "select Id,title,cover_img,pub_date,cate_id,author_id,visit_number from ev_articles where is_delete=0 && state=1 order by Id Desc";
  const sql3 =
    "select Id,title,cover_img,pub_date,cate_id,author_id,visit_number from ev_articles where is_delete=0 && state=1 order by visit_number desc";
  if (req.query.main == 0) {
    sql = sql1;
  } else if (req.query.main == 1) {
    sql = sql2;
  } else if (req.query.main == 2) {
    sql = sql3;
  }
  //调用db.query()执行sql语句
  db.query(sql, (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行sql语句成功，但是查询结果可能为空
    if (results.length === 0) return res.cc("获取文章信息list失败！");
    // console.log(results)
    let curpage = Number(req.query.page); //当前页，前端传的页码
    let count = 2; //每页显示的数量
    let sumpage = Math.ceil(results.length / count); //返一个总页码
    if (curpage == "") {
      let data = results.splice(0, count); //利用数组方法截取数据
      //用户信息获取成功
      res.send({
        status: 0,
        message: "获取文章信息list成功!",
        sumpage: sumpage,
        data: data,
      });
    } else {
      let data = results.splice((curpage - 1) * 2, count); //利用数组方法截取数据
      res.send({
        status: 0,
        message: "获取文章信息list" + curpage + "成功!",
        sumpage: sumpage,
        data: data,
      });
    }
  });
};
exports.getArticleHotList = (req, res) => {
  console.log(req.query);
  var sql =
    "select Id,title,author_id,visit_number from ev_articles where is_delete=0 && state=1 order by visit_number desc";
  //调用db.query()执行sql语句
  db.query(sql, (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行sql语句成功，但是查询结果可能为空
    if (results.length === 0) return res.cc("获取文章信息list失败！");
    let data = [];
    if (results.length > 10) {
      data = results.splice(0, 9); //利用数组方法截取数据
    } else {
      data = results;
    }
    console.log(data);
    //用户信息获取成功
    res.send({
      status: 0,
      message: "获取热门文章成功!",
      data: data,
    });
  });
};
//获取文章搜索的处理函数模块
exports.getArticleSearch = (req, res) => {
  console.log(req.query);
  //定义查询用户信息的sql语句
  //查询所有文章名字及id和作者
  const sql =
    "select Id,title,author_id from ev_articles where is_delete=0 && state=1";
  //调用db.query()执行sql语句
  db.query(sql, (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行sql语句成功，但是查询结果可能为空
    if (results.length === 0) return res.cc("获取文章信息list失败！");
    // console.log(results)
    //用户信息获取成功
    res.send({
      status: 0,
      message: "获取文章搜索信息成功!",
      data: results,
    });
  });
};
//(通过Id)获取文章作者
exports.getArticleAuthor = (req, res) => {
  // console.log(req.params.id)
  //定义查询用户信息的sql语句
  const sql = "select username,nickname from ev_users where id=?";
  // 调用db.query()执行sql语句
  db.query(sql, [req.params.id], (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行sql语句成功，但是查询结果可能为空
    if (results.length === 0) return res.cc("获取作者信息失败！");
    // console.log(results)
    //用户信息获取成功
    results = JSON.stringify(results);
    results = JSON.parse(results);
    // console.log(results)
    res.send({
      status: 0,
      message: "获取作者信息成功!",
      data: results,
    });
  });
};
//获取文章的处理函数模块
exports.getArticle = (req, res) => {
  // console.log(req.params.id)
  //定义查询用户信息的sql语句
  const sql =
    "select title,content,pub_date,cate_id,visit_number from ev_articles where Id=? && is_delete=0";
  //调用db.query()执行sql语句
  db.query(sql, req.params.id, (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行sql语句成功，但是查询结果可能为空
    if (results.length === 0) return res.cc("获取文章信息失败！");
    console.log(results[0].visit_number);
    const sql = "update ev_articles set visit_number=? where Id=? ";
    db.query(
      sql,
      [results[0].visit_number + 1, req.params.id],
      (err, results) => {
        //执行语句失败
        if (err) {
          console.log("啊哦！服务器遇到了问题！");
        }
      }
    );
    console.log(results);
    //用户信息获取成功
    res.send({
      status: 0,
      message: "获取文章信息成功!",
      data: results,
    });
  });
};
