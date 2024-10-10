// cloudfunctions/loginUser/index.js
const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs');

cloud.init({
  env: 'cbh102201225-8gcwmhi730f02e6f', // 替换为您的云环境ID
  traceUser: true,
});
const db = cloud.database();
const usersCollection = db.collection('users');

exports.main = async (event, context) => {
  const { student_id, password } = event;

  try {
    // 根据 student_id 查找用户
    const userResult = await usersCollection.where({ student_id }).get();

    if (userResult.data.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      };
    }

    const user = userResult.data[0];

    // 比较密码
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return {
        success: false,
        message: '密码错误'
      };
    }

    // 从用户数据中排除密码
    const { password: pwd, ...userData } = user;

    // 确保 userData 中包含 openid
    if (!userData.openid) {
      const wxContext = cloud.getWXContext();
      userData.openid = wxContext.OPENID;
      // 更新数据库中的 openid
      await usersCollection.doc(user._id).update({
        data: {
          openid: wxContext.OPENID
        }
      });
    }

    const app = getApp();
    app.globalData.userProfile.student_id = student_id;
    console.log(app.globalData.userProfile.student_id)
    return {
      success: true,
      message: '登录成功',
      user: userData
      // 不再返回 token
    };
  } catch (err) {
    console.error('登录失败：', err);
    return {
      success: false,
      message: '登录失败',
      error: err.toString()
    };
  }
};
