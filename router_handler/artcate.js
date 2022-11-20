//路由文章的处理模块
//导入数据库操作模块
const db = require('../db/index')
//获取文章分类列表的处理函数
exports.getArticleCates = (req, res) => {
    const sql = 'select Id,name,alias from ev_article_cate where is_delete=0 order by Id asc'
    db.query(sql, (err, results) => {
        //执行语句失败
        if (err) return res.cc(err)
        //执行语句成功
        res.send({
            status: 0,
            message: '获取文章分类数据成功！',
            data: results
        })
    })
    // res.send('ok')
}
//新增文章分类的路由的处理函数
exports.addArticleCates = (req, res) => {
    const sql = 'select * from ev_article_cate where (name=? or alias=?) and is_delete=0'
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        //执行语句失败
        if (err) return res.cc(err)
        //判断数据的length
        if (results.length === 2) res.cc('分类名称与分类别名已经被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
            return res.cc('分类名称与分类别名已经被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('分类名称已经被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('分类别名已经被占用，请更换后重试！')
        //分类名称与分类别名都可用
        const sql = 'insert into ev_article_cate set ?'
        db.query(sql, req.body, (err, results) => {
            //执行语句失败
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('新增文章分类异常！稍后再试')
            res.cc('新增文章分类成功！', 0)
        })

    })
}
//删除文章分类的路由的处理函数
exports.deleteArticleCates = (req, res) => {
    //定义sql
    const sql = 'update ev_article_cate set is_delete=1 where id=?'
    db.query(sql, [req.params.id], (err, results) => {
        //执行语句失败
        if (err) return res.cc('啊哦！服务器遇到了问题！')
        if (results.affectedRows !== 1) return res.cc('删除文章分类异常！稍后再试')
        res.cc('删除文章分类成功！', 0)
    })
    // res.send('ok' + req.params.id)
}
//根据id获取文章分类的路由的处理函数
exports.getArticleCateById = (req, res) => {
    //定义sql
    // console.log(req.params.id)
    const sql = 'select * from  ev_article_cate where Id=? and is_delete=0'
    db.query(sql, [req.params.id], (err, results) => {
        //执行语句失败
        if (err) return res.cc('啊哦！服务器遇到了问题！')
        // console.log(results)
        if (results.length !== 1) return res.cc('获取文章分类失败！稍后再试')
        res.send({
            status: 0,
            message: '获取文章分类数据成功!',
            data: results
        })
    })
}

//根据id更新文章分类的路由de的处理函数
exports.updateArticleCateById = (req, res) => {
    //定义sql
    const sql = 'select * from  ev_article_cate where id<>? and (name=? or alias=?) and is_delete=0'
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        //执行语句失败
        if (err) return res.cc('啊哦！服务器遇到了问题！')
        //判断数据的length(名称和别名是否被占用)
        if (results.length === 2) res.cc('分类名称与分类别名已经被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias)
            return res.cc('分类名称与分类别名已经被占用，请更换后重试！')
        if (results.length === 1 && results[0].name === req.body.name)
            return res.cc('分类名称已经被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias)
            return res.cc('分类别名已经被占用，请更换后重试！')
        //名称和别名可用
        const sql = 'update ev_article_cate set ? where Id=?'
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            //执行语句失败
            if (err) return res.cc('啊哦！服务器遇到了问题！')
            if (results.affectedRows !== 1) return res.cc('更新文章分类异常！稍后再试')
            res.cc('更新文章分类成功！', 0)
        })
    })
}