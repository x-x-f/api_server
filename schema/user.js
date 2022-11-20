//导入验证规则的包
const joi=require('joi')

//定义用户名和密码的验证规则
const username=joi.string().alphanum().min(1).max(10).required()
// const password=joi.string().pattern(/^[\\s]{6,12}$/).required()
const password=joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,15}$')).required()
//邮箱验证码
const code=joi.string().min(6).max(6).required()

//定义id,nickname,email,phone,recommend的验证规则
const id=joi.number().integer().min(1).required()
const nickname=joi.string().required()
const email=joi.string().email().required()
const phone = joi.number().required()
const recommend=joi.string().min(1).required()
//定义验证avatar头像的验证规则
const avatar=joi.string().dataUri().required()


//定义验证注册表单数据的规则对象
exports.reg_register_schema={
    body:{
        username,
        password,
        email,
        code
    }
}
//定义验证登陆表单数据的规则对象
exports.reg_login_schema={
    body:{
        username,
        password
    }
}
//更新用户基本信息的验证规则对象
exports.update_userinfo_schma={
    //需要对req.body里面的数据进行验证
    body:{
        // id:id,  //可简写
        nickname:nickname,
        // email:email,
        phone:phone,
        recommend:recommend
    }
}
//更新用户密码的验证规则对象
exports.update_password_schma={
    //需要对req.body里面的数据进行验证
    body:{
        oldPwd:password,
        newPwd:joi.not(joi.ref('oldPwd')).concat(password) //排除与原密码一样，且密码符合password
    }
}
//验证规则对象-更新头像
exports.update_avatar_schma={
    body:{
        avatar:avatar
    }
}