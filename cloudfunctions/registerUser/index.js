// cloudfunctions/registerUser/index.js
const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs'); // 用于密码加密

cloud.init();
const db = cloud.database();
const usersCollection = db.collection('users'); // 正确定义 usersCollection

exports.main = async (event, context) => {
  const {
    student_id,
    password,
    // 其他字段
  } = event;

  try {
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
        // 其他字段
        createdAt: new Date()
      }
    });

    return {
      success: true,
      message: '注册成功',
      userId: result._id
    };
  } catch (err) {
    console.error('注册失败：', err);
    return {
      success: false,
      message: '注册失败',
      error: err
    };
  }
};
