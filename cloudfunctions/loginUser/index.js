// cloudfunctions/loginUser/index.js
const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

cloud.init();
const db = cloud.database();
const usersCollection = db.collection('users');

const SECRET_KEY = 'your-secret-key'; // 请替换为您的密钥，确保安全

exports.main = async (event, context) => {
  const { student_id, password } = event;

  try {
    console.log('usersCollection 是否已定义：', typeof usersCollection);

    const userResult = await usersCollection.where({ student_id }).get();
    console.log('用户查询结果：', userResult);

    if (userResult.data.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    const user = userResult.data[0];
    console.log('查询到的用户：', user);

    const passwordMatch = bcrypt.compareSync(password, user.password);
    console.log('输入的密码：', password);
    console.log('数据库中的哈希密码：', user.password);
    console.log('密码匹配结果：', passwordMatch);

    if (!passwordMatch) {
      return {
        success: false,
        message: '密码错误'
      };
    }

    // 生成 token
    const token = jwt.sign(
      { openId: user.openid, student_id: user.student_id },
      SECRET_KEY,
      { expiresIn: '1h' } // token 有效期为 1 小时
    );

    const { password: pwd, ...userData } = user;

    return {
      success: true,
      message: '登录成功',
      user: userData,
      token: token // 返回 token
    };
  } catch (err) {
    console.error('登录失败：', err);
    return {
      success: false,
      message: '登录失败',
      error: err
    };
  }
};
