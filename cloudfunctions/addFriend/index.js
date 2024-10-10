// cloudfunctions/addFriend/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: 'cbh102201225-8gcwmhi730f02e6f', // 替换为您的云环境ID
  traceUser: true,
});
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { student_id } = event;

  try {
    // 获取调用者的 OpenID
    const wxContext = cloud.getWXContext();
    const userId = wxContext.OPENID;

    console.log(`addFriend called by userId: ${userId} with student_id: ${student_id}`);

    if (!userId) {
      return {
        success: false,
        message: '无法获取用户身份信息'
      };
    }

    // 查找目标用户
    const userRes = await db.collection('users').where({
      student_id: student_id
    }).get();

    console.log(`Found ${userRes.data.length} users with student_id: ${student_id}`);

    if (userRes.data.length === 0) {
      return {
        success: false,
        message: '未找到对应的用户'
      };
    }

    // 如果存在多个用户，返回错误或处理多个用户的情况
    if (userRes.data.length > 1) {
      return {
        success: false,
        message: '学号对应多个用户，请联系管理员'
      };
    }

    const targetUser = userRes.data[0];
    console.log(`Target user openid: ${targetUser.openid}`);

    if (targetUser.openid === userId) {
      return {
        success: false,
        message: '无法添加自己为好友'
      };
    }

    // 检查是否已经是好友
    const existingFriendRes = await db.collection('friends').where({
      userId: userId,
      friendId: targetUser.openid
    }).get();

    console.log(`Existing friends count: ${existingFriendRes.data.length}`);

    if (existingFriendRes.data.length > 0) {
      return {
        success: false,
        message: '该用户已是您的好友'
      };
    }

    // 添加好友关系
    await db.collection('friends').add({
      data: {
        userId: userId,
        friendId: targetUser.openid,
        createdAt: db.serverDate()
      }
    });
    console.log(`Added friend relationship: ${userId} -> ${targetUser.openid}`);

    // 同时添加对方的好友关系
    await db.collection('friends').add({
      data: {
        userId: targetUser.openid,
        friendId: userId,
        createdAt: db.serverDate()
      }
    });
    console.log(`Added friend relationship: ${targetUser.openid} -> ${userId}`);

    return {
      success: true,
      message: '好友添加成功'
    };

  } catch (err) {
    if (err.errCode === 11000) { // MongoDB duplicate key error code
      console.error('好友关系已存在，无法重复添加');
      return {
        success: false,
        message: '该用户已是您的好友'
      };
    }

    console.error('添加好友失败：', err);
    return {
      success: false,
      message: '添加好友失败',
      error: err.toString()
    };
  }
};
