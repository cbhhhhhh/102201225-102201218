// pages/login/index.js
Page({
  data: {
    account: '',
    password: '',
    showPassword: false // 控制密码可见性
  },

  // 切换密码可见性
  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
    console.log('密码可见性切换:', this.data.showPassword);
  },

  // 处理账号输入
  onAccountInput(e) {
    this.setData({
      account: e.detail.value
    });
  },

  // 处理密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 登录按钮点击事件
  onLogin() {
    const { account, password } = this.data;

    // 简单表单验证
    if (!account) {
      wx.showToast({
        title: '请输入账号',
        icon: 'none'
      });
      return;
    }

    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '登录中',
    });

    // 调用云函数 'loginUser'
    wx.cloud.callFunction({
      name: 'loginUser',
      data: {
        student_id: account, // 确保字段名称一致
        password: password
      },
      success: res => {
        wx.hideLoading();
        console.log('云函数返回结果：', res);
        if (res.result.success) {
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });

          // 存储用户信息
          wx.setStorageSync('userInfo', res.result.user);

          // 跳转到主界面或其他页面
          wx.reLaunch({
            url: '/pages/home/home' // 替换为您的主界面路径
          });
        } else {
          wx.showToast({
            title: res.result.message || '登录失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
        console.error('登录请求失败：', err);
      }
    });
  },

  // 注册按钮点击事件
  onRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
});
