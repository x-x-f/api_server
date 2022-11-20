var formidable = require("formidable");

var path = require("path");

var fs = require("fs");
//图片的路由模块的处理函数
exports.sendimage = (req, res) => {
  console.log("被执行了");
  var form = new formidable.IncomingForm();
  form.encoding = "utf-8";
  var date = new Date();
  let datemidr = date.getMonth() + 1 + "_" + date.getDate();
  //判断该文件夹是否存在
  if (!fs.existsSync(`public/upload_image/article/` + datemidr)) {
    //不存在直接创建
    fs.mkdirSync(`public/upload_image/article/` + datemidr);
  }
  form.uploadDir = path.join(
    __dirname + "/../public/upload_image/article/" + datemidr
  );
  // form.uploadDir = path.join(__dirname + "/../public/upload_image" + '/' + (date.getMonth() + 1) + '_' + date.getDate());
  form.keepExtensions = true; //保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;
  console.log(form.uploadDir);
  form.parse(req, function (err, fields, files) {
    console.log(files.image.originalFilename);
    filename = files.image.originalFilename;
    var nameArray = filename.split(".");
    console.log(nameArray);
    var type = nameArray[nameArray.length - 1];
    console.log(type);
    var name = "";
    // for (var i = 0; i < nameArray.length - 1; i++) {
    //     name = name + nameArray[i];
    // }
    console.log(nameArray[0][1]);
    for (var i = 0; i < nameArray[0].length / 2; i++) {
      name = name + nameArray[0][i];
    }
    console.log(name);
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
    console.log(time);
    var avatarName = name + "_" + time + "." + type;
    // var avatarName = time + '.' + type;

    console.log(avatarName);
    //新路径
    var newPath = form.uploadDir + "/" + avatarName;
    console.log(newPath);
    // console.log(files.image)
    console.log(files.image.filepath);
    fs.renameSync(files.image._writeStream.path, newPath);
    res.write(
      JSON.stringify({
        status: "0",
        message: "成功",
        data:
          "http://localhost:5005/public/upload_image/article/" +
          datemidr +
          "/" +
          avatarName,
      })
    );
    res.end();
  });
};
