// 云函数 getFriends/index.js
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

    const user = userRes.data[0];
    const friendsOpenIds = user.friends || [];

    if (friendsOpenIds.length === 0) {
      return { success: true, friends: [] };
    }

    // 获取好友的详细信息
    const friendsRes = await db.collection('users').where({
      _openid: db.command.in(friendsOpenIds)
    }).get();

    return { success: true, friends: friendsRes.data };
  } catch (error) {
    console.error(error);
    return { success: false, message: '获取好友列表失败' };
  }
};
