// pages/register/register.js
Page({
  data: {
    studentId: '',
    password: '',
    confirmPassword: '',
    // 其他注册相关的数据字段
    showPassword: false,
    showConfirmPassword: false
  },

  // 学号输入
  onStudentIdInput(e) {
    this.setData({
      studentId: e.detail.value
    });
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 确认密码输入
  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  // 切换密码显示
  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  // 切换确认密码显示
  toggleConfirmPassword() {
    this.setData({
      showConfirmPassword: !this.data.showConfirmPassword
    });
  },

  // 取消按钮点击事件
  onCancel() {
    // 重置表单
    this.setData({
      studentId: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false
    });

    // 或者返回上一页
    wx.navigateBack({
      delta: 1
    });
  },

  // 注册按钮点击事件
  onRegister() {
    const { studentId, password, confirmPassword } = this.data;

    // 简单表单验证
    if (!studentId || !password || !confirmPassword) {
      wx.showToast({
        title: '请完整填写信息',
        icon: 'none'
      });
      return;
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '注册中...',
    });

    // 调用云函数 'registerUser'
    wx.cloud.callFunction({
      name: 'registerUser',
      data: {
        student_id: studentId,
        password: password
      },
      success: res => {
        wx.hideLoading();
        console.log('云函数返回结果：', res);
        if (res.result.success) {
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          });

          // **移除存储用户信息的代码**
          // wx.setStorageSync('userInfo', res.result.user);

          // **跳转到登录页面**
          wx.navigateTo({
            url: '/pages/login/index' // 替换为您的登录页面路径
          });
          
        } else {
          wx.showToast({
            title: res.result.message || '注册失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '注册失败，请重试',
          icon: 'none'
        });
        console.error('注册请求失败：', err);
      }
    });
  }
});
