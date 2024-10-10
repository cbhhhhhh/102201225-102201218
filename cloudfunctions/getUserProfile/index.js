// 云函数 getUserProfile/index.js
const cloud = require('wx-server-sdk');

cloud.init();

exports.main = async (event, context) => {
  const db = cloud.database();
  const OPENID = cloud.getWXContext().OPENID;

  try {
    const userRes = await db.collection('users').where({
      _openid: OPENID
    }).get();

    if (userRes.data.length === 0) {
      return { success: false, message: '用户未注册' };
    }

    const userProfile = userRes.data[0];

    return { success: true, userProfile };
  } catch (error) {
    console.error(error);
    return { success: false, message: '获取用户信息失败' };
  }
};
