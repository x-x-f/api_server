//路由函数处理模块(用户注册与登录)

require('dotenv').config()

const sendEmail = require('./pages/emialsend')
const render = require('./pages/html-render')

//导入数据库操作模块
const db = require('../db/index')

//导入格式化时间的模块
const TIME = require('./pages/dateFromat')

//导入bcryptjs这个包
const bcrypt = require('bcryptjs')

//安装并导入jwt(生成Token)包
const jwt = require('jsonwebtoken')

//导入全局配置文件
const config = require('../config')
const expressJWT = require('express-jwt')

let verification = []
//邮箱正则表达式
function isEmail(strEmail) {
    if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
        return true;
    else
        return false;
}
//发送邮件的处理函数
exports.send = async (req, res) => {
    console.log(req.body)
    let ren = new render()
    let emails = req.body.email;
    const send = new sendEmail();
    let user = req.body.username;
    let code = ren.code(6)
    console.log(user, emails, code)
    if (!isEmail(emails)) return res.cc('邮箱格式不正确！')
    console.log(isEmail(emails))
    // let html = await ren.render('./pages/codes.ejs', { user, code })
    try {
        let email = await send.sendEmail({
            from: 'xxf1234123@163.com',//发送人
            to: emails,//接收人
            subject: "感谢" + user + "，您正在使用邮箱验证码进行注册",//标题 
            text: "验证码如下:" + code + "，如不是您的注册行为，请忽略！", //存文本正文
            // html//html正文
        })
        if (email) {
            verification.push(code)
            console.log(verification)
            res.cc('发送成功！', 0)
        }
    } catch (e) {
        res.send(e)
    }
}
//注册新用户处理函数
exports.register = (req, res) => {
    //获取客户端提交到服务器的信息
    const userInfo = req.body
    console.log('被执行了')
    if (userInfo.username && userInfo.password && userInfo.email && userInfo.code) {
        if (!verification.includes(userInfo.code)) {
            return res.cc('验证码错误！')
        }
    }
    // console.log(verification)
    // console.log(userInfo.code)
    // console.log('验证码正确！')
    // console.log(userInfo)
    //因已使用joi进行数据效验，所以不再使用此处对数据再进行效验
    // //对表单中的数据进行合法性效验
    // if (!userInfo.username || !userInfo.password) {
    //     return res.send({ status: 1, message: '用户名或密码不合法！' })
    // }
    //获取注册时间
    const dt = new Date()
    //格式化注册时间
    const newdt = TIME.dateFormat(dt)
    // console.log(newdt)
    //定义sql语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username= ?'
    db.query(sqlStr, [userInfo.username], (err, results) => {
        //执行sql语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        //判断用户名是否被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名'})
            return res.cc('用户名被占用，请更换其他用户名')
        }
        //用户名可以使用
        //调用bcrypt.hashSync()对密码进行加密
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        // console.log(userInfo)
        //定义插入新用户的sql语句
        const sql = 'insert into ev_users set ?'
        db.query(sql, { username: userInfo.username, password: userInfo.password, email: userInfo.email, regsiterdate: newdt }, (err, results) => {
            //判断sql语句是否执行成功
            // if(err) return res.send({status:1,message:err.message})
            if (err) return res.cc(err)
            //判断影响行数是否为1
            // if(results.affectedRows!==1) return res.send({status:1,message:'注册用户失败，稍后再试！'})
            if (results.affectedRows !== 1) return res.cc('注册用户失败，稍后再试！')
            // //清除验证码库
            console.log(verification)
            for (let i = 0; i < verification.length; i++) {
                if (verification[i] === userInfo.code) {
                    verification.splice(i, 1)
                    break;
                }
            }
            console.log(verification)
            //注册用户成功
            // res.send({status:0,message:'注册用户成功！'})
            res.cc('注册用户成功！', 0)
        })

    })
}

//登陆的处理函数
exports.login = (req, res) => {
    //接收表单的数据
    const userInfo = req.body
    // console.log(userInfo)
    //定义sql语句
    const sql = 'select * from ev_users where username=?'
    //执行sql语句，根据用户名查询用户信息
    db.query(sql, userInfo.username, (err, results) => {
        //执行语句失败,判断用户不存在
        if (err) return res.cc('用户不存在！')
        //执行语句成功
        if (results.length !== 1) return res.cc('登陆失败！请重新尝试')
        //判断密码是否正确
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
        if (!compareResult) return res.cc('登录失败！密码错误')

        //在服务器生成Token的字符串
        const user = { ...results[0], password: '', user_pic: '' }
        //对用户的信息进行加密，生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresI })
        //调用res.send()将Token响应给客户端
        console.log('被执行，成功验证了账户')
        res.send({
            status: 0,
            message: '用户登陆成功！',
            token: 'Bearer ' + tokenStr
        })
    })
    // res.send('login oK!')
}