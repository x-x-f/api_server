//导入数据库操作模块
const db = require("../db/index");
var formidable = require("formidable");

var path = require("path");

var fs = require("fs");
//导入处理密码的模块
const bcrypt = require("bcryptjs");

//(获取用户基本信息)路由函数处理模块函数
exports.getUserInfo = (req, res) => {
  //定义查询用户信息的sql语句
  const sql =
    "select id,username,nickname,email,user_pic,phone,recommend,regsiterdate from ev_users where id=?";
  //调用db.query()执行sql语句
  db.query(sql, req.auth.id, (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行sql语句成功，但是查询结果可能为空
    if (results.length !== 1) return res.cc("获取用户信息失败！");
    //用户信息获取成功
    res.send({
      status: 0,
      message: "获取用户信息成功!",
      data: results[0],
    });
  });
};
//更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  //定义待执行的sql语句
  console.log(req.auth.id);
  const sql = "update ev_users set ? where id=?";
  db.query(sql, [req.body, req.auth.id], (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行sql语句成功，但是影响行数不等于1
    if (results.affectedRows !== 1) return res.cc("更新用户基本信息失败！");
    //用户信息更新成功
    res.cc("更新用户信息成功！", 0);
  });
};
//更新用户密码的处理函数
exports.updatePassword = (req, res) => {
  //根据id查询用户的信息
  const sql = "select * from ev_users where id=?";
  //执行
  db.query(sql, [req.auth.id], (err, results) => {
    //执行sql语句失败
    if (err) return res.cc(err);
    //执行sql语句成功，但是影响行数不等于1
    if (results.length !== 1) return res.cc("用户信息出错！");
    //判断用户输入的旧密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) return res.cc("旧密码错误！");
    //更新数据库中密码
    //定义更新密码的sql语句
    const sql = "update ev_users set password=? where id=?";
    //对新密码进行加密
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    db.query(sql, [newPwd, req.auth.id], (err, results) => {
      //执行sql语句失败
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("更新密码出现错误！");
      //成功
      res.cc("更新密码成功", 0);
    });
  });
};
//更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  var form = new formidable.IncomingForm();
  console.log(req.auth.id);
  form.encoding = "utf-8";
  var date = new Date();
  let datemidr = date.getMonth() + 1 + "_" + date.getDate();
  //判断该文件夹是否存在
  if (!fs.existsSync(`public/upload_image/avatar/` + datemidr)) {
    //不存在直接创建
    fs.mkdirSync(`public/upload_image/avatar/` + datemidr);
  }

  form.uploadDir = path.join(
    __dirname + "/../public/upload_image/avatar/" + datemidr
  );
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;
  console.log(form.uploadDir);
  console.log("接受到数据！");
  form.parse(req, function (err, fields, files) {
    filename = files.file.originalFilename;
    var nameArray = filename.split(".");
    var type = nameArray[nameArray.length - 1];
    var name = "";
    for (var i = 0; i < nameArray[0].length / 2; i++) {
      name = name + nameArray[0][i];
    }
    var time =
      date.getFullYear() +
      "_" +
      (date.getMonth() + 1) +
      "_" +
      date.getDate() +
      "_" +
      date.getHours() +
      "_" +
      date.getMinutes() +
      "_" +
      date.getSeconds();
    var avatarName = name + "_" + time + "." + type;
    //新路径
    var newPath = form.uploadDir + "/" + avatarName;
    fs.renameSync(files.file._writeStream.path, newPath);
    console.log("上传成功！");
    //定义待执行的sql语句
    const sql = "update ev_users set user_pic=? where id=?";
    //执行sql
    var path =
      "http://localhost:5005/public/upload_image/avatar/" +
      datemidr +
      "/" +
      avatarName;
    db.query(sql, [path, req.auth.id], (err, results) => {
      //执行sql语句失败
      if (err) return res.cc(err);
      //执行sql语句成功，但是影响行数不等于1
      if (results.affectedRows !== 1) return res.cc("更换头像失败！");
      // //用户信息更新成功
      // res.cc('更换头像成功！', 0)
      res.write(
        JSON.stringify({
          status: "0",
          message: "成功",
          data:
            "http://localhost:5005/public/upload_image/avatar/" +
            datemidr +
            "/" +
            avatarName,
        })
      );
      res.end();
    });
  });
};
