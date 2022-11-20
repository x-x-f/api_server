//导入验证规则的包
const joi=require('joi')

//定义name和alias的验证规则
const name=joi.string().required()
const alias=joi.string().required()
//定义id的验证规则
const id=joi.number().integer().min(1).required()



//验证规则对象-文章分类
exports.add_cate_schma={
    body:{
        name:name,
        alias:alias
    }
}
//验证规则对象-删除文章分类
exports.delete_cate_schma={
    params:{
        id,
    }
}
//验证规则对象-根据id获取文章分类
exports.get_cate_schma={
    params:{
        id,
    }
}

//验证规则对象-根据id更新文章分类
exports.update_cate_schma={
    body:{
        Id:id,
        name,
        alias
    }
}