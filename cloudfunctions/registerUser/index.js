// cloudfunctions/registerUser/index.js
const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs'); // 用于密码加密

cloud.init({
  env: 'cbh102201225-8gcwmhi730f02e6f', // 替换为您的云环境ID
  traceUser: true,
});
const db = cloud.database();
const usersCollection = db.collection('users'); // 正确定义 usersCollection

exports.main = async (event, context) => {
  const {
    student_id,
    password,
    // 其他字段
  } = event;

  try {
    // 获取 OpenID
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;

    if (!openid) {
      return {
        success: false,
        message: '无法获取用户身份信息'
      };
    }

    // 检查用户是否已存在
    const userCheck = await usersCollection.where({ student_id }).get();

    if (userCheck.data.length > 0) {
      return {
        success: false,
        message: '用户已存在'
      };
    }

    // 对密码进行加密
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 插入新用户
    const result = await usersCollection.add({
      data: {
        student_id,
        password: hashedPassword, // 存储加密后的密码
        openid,
        // 其他字段可以在个人信息完善时添加
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    });

    // 获取创建后的用户信息
    const newUser = await usersCollection.doc(result._id).get();
    const userData = newUser.data;

    // 移除密码字段
    delete userData.password;

    return {
      success: true,
      message: '注册成功',
      user: userData
    };
  } catch (err) {
    console.error('注册失败：', err);
    return {
      success: false,
      message: '注册失败',
      error: err.toString()
    };
  }
};
