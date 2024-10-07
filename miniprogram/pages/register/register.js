Page({
  data: {
    account: '',
    password: '',
    confirmPassword: '', // 确认密码字段
    showPassword: false, // 控制密码可见性
    showConfirmPassword: false // 控制确认密码可见性
  },

  // 切换密码可见性
  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  // 切换确认密码可见性
  toggleConfirmPassword() {
    this.setData({
      showConfirmPassword: !this.data.showConfirmPassword
    });
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

  // 处理确认密码输入
  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  // 注册按钮点击事件
  onRegister() {
    const { account, password, confirmPassword } = this.data;

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

    if (!confirmPassword) {
      wx.showToast({
        title: '请确认密码',
        icon: 'none'
      });
      return;
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      });
      return;
    }

    // 调用云函数或后端API进行注册
    wx.cloud.callFunction({
      name: 'register',
      data: {
        account,
        password
      },
      success: res => {
        if (res.result.success) {
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          });

          // 存储用户信息（例如openid）
          wx.setStorageSync('userInfo', res.result.userInfo);

          // 跳转到主页或其他页面
          wx.reLaunch({
            url: '/pages/first/first'
          });
        } else {
          wx.showToast({
            title: res.result.errorMessage,
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: '注册失败，请重试',
          icon: 'none'
        });
        console.error('注册云函数调用失败：', err);
      }
    });
  },

  // 取消按钮点击事件
  onCancel() {
    wx.navigateBack();
  }
});
