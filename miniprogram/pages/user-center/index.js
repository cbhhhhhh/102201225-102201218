// pages/me/index.js
const app = getApp(); // 在顶部获取全局应用实例

Page({
  data: {
    openId: '',
    showUploadTip: false,
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
    this.getOpenId();
    this.loadUserProfile();
  },

  onShow() {
    this.loadUserProfile();
  },

  getOpenId() {
    wx.showLoading({
      title: '加载中...',
    });
    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getOpenId',
        },
      })
      .then((resp) => {
        this.setData({
          openId: resp.result.openid,
        });
        wx.hideLoading();
      })
      .catch((e) => {
        this.setData({
          showUploadTip: true,
        });
        wx.hideLoading();
      });
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

    // 生成一个唯一的文件名
    const cloudPath = `avatar/${this.data.openId}_${Date.now()}${filePath.match(/\.[^.]+?$/)[0]}`;

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
    // 调用云函数 'updateUserProfile' 来更新头像
    wx.cloud.callFunction({
      name: 'updateUserProfile',
      data: {
        token: wx.getStorageSync('token'),
        avatarUrl: fileID
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
          app.globalData.userInfo = {};

          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');

          wx.reLaunch({
            url: '/pages/login/login',
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
