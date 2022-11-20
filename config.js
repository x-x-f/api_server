//这是一个全局的配置文件

//定义(加密和解密Token)secret秘钥，建议将秘钥命名为secretKKey
const jwtSecretKey = "xxfit()<_>";
//token的有效期
// const expiresI='3h'
const expiresI = "7d";

module.exports = {
  jwtSecretKey,
  expiresI,
};
