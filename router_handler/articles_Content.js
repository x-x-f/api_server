//处理文章的路由模块的处理函数
//导入数据库操作模块
const db = require('../db/index')
//导入格式化时间的模块
const TIME = require('./pages/dateFromat')
//添加文章到草稿箱的处理函数模块
exports.addArticle_Draft = (req, res) => {
    //定义查询用户信息的sql语句
    const sql = 'insert into ev_article_draft set ?'
    //调用db.query()执行sql语句
    // console.log(req.body)
    const article = req.body
    // console.log(article)
    //获取注册时间
    const dt = new Date()
    //格式化注册时间
    const newdt = TIME.dateFormat(dt)
    db.query(sql, { title: article.title, author_id: article.author_id, content: article.content, change_date: newdt }, (err, results) => {
        //判断sql语句是否执行成功
        // if(err) return res.send({status:1,message:err.message})
        if (err) return res.cc(err)
        //判断影响行数是否为1
        // if(results.affectedRows!==1) return res.send({status:1,message:'注册用户失败，稍后再试！'})
        if (results.affectedRows !== 1) return res.cc('保存到服务器失败，稍后再试！')
        res.cc('保存成功！', 0)
    })
    // db.query(sql, (err, results) => {
    //     //执行sql语句失败
    //     if (err) return res.cc(err)
    // })
}
//添加文章到草稿箱的处理函数模块
exports.getArticle_Draft = (req, res) => {
    console.log(req.params.id)
    var author_id = req.params.id;
    //定义查询用户信息的sql语句
    const sql = 'select Id,title,content,change_date from ev_article_draft where author_id=? and is_delete=0'
    //调用db.query()执行sql语句
    db.query(sql, author_id, (err, results) => {
        //判断sql语句是否执行成功
        // if(err) return res.send({status:1,message:err.message})
        if (err) return res.cc(err)
        //判断影响行数是否为
        res.send({
            status: 0,
            data: results
        })
    })
}
//删除草稿箱文章的处理函数模块
exports.deleteArticle_Draft = (req, res) => {
    console.log(req.params.id)
    var Id = req.params.id;
    //定义查询用户信息的sql语句
    const sql = 'update ev_article_draft set is_delete=1 where Id=?'
    //调用db.query()执行sql语句
    db.query(sql, Id, (err, results) => {
        //判断sql语句是否执行成功
        // if(err) return res.send({status:1,message:err.message})
        if (err) return res.cc(err)
        res.cc('删除成功！', 0)
    })
}
//发布文章的处理函数模块
exports.releaseArticle = (req, res) => {
    const sql = 'insert into ev_articles set ?'
    //调用db.query()执行sql语句
    // console.log(req.body)
    const article = req.body
    console.log(article)
    //获取注册时间
    const dt = new Date()
    //格式化注册时间
    const newdt = TIME.dateFormat(dt)
    db.query(sql, { title: article.title, author_id: article.author_id,cate_id:article.cate_id, content: article.content, pub_date: newdt,cover_img:article.cover_img,state:0}, (err, results) => {
        //判断sql语句是否执行成功
        // if(err) return res.send({status:1,message:err.message})
        if (err) return res.cc(err)
        //判断影响行数是否为1
        // if(results.affectedRows!==1) return res.send({status:1,message:'注册用户失败，稍后再试！'})
        if (results.affectedRows !== 1) return res.cc('保存到服务器失败，稍后再试！')
        res.cc('上传文章成功！待审核', 0)
    })
}