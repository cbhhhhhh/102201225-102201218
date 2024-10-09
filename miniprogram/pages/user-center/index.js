// pages/me/index.js
const app = getApp(); // 获取全局应用实例

Page({
  data: {
    userProfile: {
      name: '',
      studentId: '',
      selectedEducation: '',
      selectedMajor: '',
      grade: '',
      college: '',
      phone: '',
      email: '',
      avatarUrl: '' // 确保已添加
    }
  },

  onLoad(options) {
    this.loadUserProfile();
  },

  onShow() {
    this.loadUserProfile();
  },

  loadUserProfile() {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      userProfile: {
        name: userInfo.name || '',
        studentId: userInfo.student_id || '',
        selectedEducation: userInfo.education_level || '',
        selectedMajor: userInfo.major || '',
        grade: userInfo.grade || '',
        college: userInfo.college || '',
        phone: userInfo.phone || '',
        email: userInfo.email || '',
        avatarUrl: userInfo.avatarUrl || ''
      }
    });
  },

  /**
   * 修改头像
   */
  changeAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以选择原图或压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.uploadAvatar(tempFilePath);
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
      }
    });
  },

  /**
   * 上传头像到云存储
   */
  uploadAvatar(filePath) {
    wx.showLoading({
      title: '上传中...',
    });

    // 获取用户的 openid
    const userInfo = wx.getStorageSync('userInfo') || {};
    const openid = userInfo.openid || '';

    if (!openid) {
      wx.hideLoading();
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    // 生成一个唯一的文件名
    const cloudPath = `avatar/${openid}_${Date.now()}${filePath.match(/\.[^.]+?$/)[0]}`;

    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: (uploadRes) => {
        console.log('上传成功', uploadRes.fileID);
        this.updateUserProfile(uploadRes.fileID);
      },
      fail: (err) => {
        console.error('上传失败', err);
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 更新用户资料中的头像 URL
   */
  updateUserProfile(fileID) {
    // 调用云函数 'updateUserProfile'
    wx.cloud.callFunction({
      name: 'updateUserProfile',
      data: {
        avatarUrl: fileID // 只传递需要更新的头像 URL
      },
      success: res => {
        if (res.result.success) {
          // 更新存储中的用户信息
          const updatedUser = res.result.user;
          wx.setStorageSync('userInfo', updatedUser);

          // 更新页面数据
          this.setData({
            'userProfile.avatarUrl': updatedUser.avatarUrl
          });

          wx.hideLoading();
          wx.showToast({
            title: '头像更新成功',
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.result.message || '头像更新失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '头像更新失败，请重试',
          icon: 'none'
        });
        console.error('更新头像失败：', err);
      }
    });
  },

  logout() {
    wx.showModal({
      title: '确认登出',
      content: '您确定要登出吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.userProfile = {
            name: '',
            studentId: '',
            selectedEducation: '',
            selectedMajor: '',
            college: '',
            phone: '',
            email: '',
            avatarUrl: '',
            openid: ''
          };

          wx.removeStorageSync('userInfo');

          wx.reLaunch({
            url: '/pages/login/index',
          });
        }
      }
    });
  },

  editProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile',
    });
  }
});
