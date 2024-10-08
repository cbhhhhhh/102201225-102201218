// cloudfunctions/updateUserProfile/index.js
const cloud = require('wx-server-sdk');
const jwt = require('jsonwebtoken');

cloud.init();
const db = cloud.database();
const usersCollection = db.collection('users');

const SECRET_KEY = 'your-secret-key'; // 请替换为您的密钥，确保安全

exports.main = async (event, context) => {
  const { token, name, student_id, education_level, major, college, phone, email, avatarUrl } = event;

  try {
    // 验证 token
    const decoded = jwt.verify(token, SECRET_KEY);
    const openId = decoded.openId;

    // 准备更新的数据
    const updateData = {};
    if (name) updateData.name = name;
    if (student_id) updateData.student_id = student_id;
    if (education_level) updateData.education_level = education_level;
    if (major) updateData.major = major;
    if (college) updateData.college = college;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    // 更新用户信息
    const result = await usersCollection.where({ openid: openId }).update({
      data: updateData
    });

    if (result.stats.updated === 0) {
      return {
        success: false,
        message: '更新失败，用户不存在'
      };
    }

    // 获取更新后的用户信息
    const updatedUser = await usersCollection.where({ openid: openId }).get();
    const userData = updatedUser.data[0];

    return {
      success: true,
      message: '信息已更新',
      user: userData
    };
  } catch (err) {
    console.error('更新用户信息失败：', err);
    return {
      success: false,
      message: '更新失败',
      error: err.toString()
    };
  }
};
