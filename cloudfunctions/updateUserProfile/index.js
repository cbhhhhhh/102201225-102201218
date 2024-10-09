// cloudfunctions/updateUserProfile/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: 'cbh102201225-8gcwmhi730f02e6f', // 请确保这里的环境ID正确
  traceUser: true,
});

const db = cloud.database();
const usersCollection = db.collection('users');

exports.main = async (event, context) => {
  const { name, student_id, education_level, major, college, phone, email, avatarUrl } = event;

  // 获取云函数上下文中的 OpenID
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  // 添加日志以调试
  console.log('Received updateUserProfile request');
  console.log('OpenID:', openid);
  console.log('Event Data:', event);

  if (!openid) {
    console.error('无法获取用户身份信息');
    return {
      success: false,
      message: '无法获取用户身份信息'
    };
  }

  try {
    // 准备更新的数据
    const updateData = {
      updatedAt: db.serverDate()
    };
    if (name) updateData.name = name;
    if (student_id) updateData.student_id = student_id;
    if (education_level) updateData.education_level = education_level;
    if (major) updateData.major = major;
    if (college) updateData.college = college;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    console.log('Update Data:', updateData);

    // 尝试更新用户信息
    const updateResult = await usersCollection.where({ openid }).update({
      data: updateData
    });

    console.log('Update Result:', updateResult);

    if (updateResult.stats.updated === 0) {
      // 用户不存在，创建新用户
      const addResult = await usersCollection.add({
        data: {
          openid,
          ...updateData,
          createdAt: db.serverDate()
        }
      });

      console.log('Add Result:', addResult);

      // 获取创建后的用户信息
      const newUserResult = await usersCollection.where({ openid }).get();
      const userData = newUserResult.data[0];

      console.log('New User Data:', userData);

      return {
        success: true,
        message: '信息已保存',
        user: userData
      };
    } else {
      // 获取更新后的用户信息
      const updatedUserResult = await usersCollection.where({ openid }).get();
      const userData = updatedUserResult.data[0];

      console.log('Updated User Data:', userData);

      return {
        success: true,
        message: '信息已更新',
        user: userData
      };
    }
  } catch (err) {
    console.error('更新用户信息失败：', err);
    return {
      success: false,
      message: '更新失败',
      error: err.toString()
    };
  }
};
