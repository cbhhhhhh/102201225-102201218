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

    // 注释掉与后端交互的部分
    /*
    // 使用 wx.request 与后端交互
    wx.request({
      url: 'https://your-backend-server.com/auth/login', // 替换为您的后端登录接口地址
      method: 'POST',
      data: {
        student_id: account, // 根据后端接口要求的参数名
        password: password
      },
      header: {
        'content-type': 'application/json' // 根据后端要求设置请求头
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 登录成功，跳转到完善信息页面
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });

          // 存储用户信息（例如 token 或用户 ID）
          wx.setStorageSync('userInfo', res.data.userInfo);

          // 跳转到完善信息页面
          wx.reLaunch({
            url: '/pages/profile/profile' // 替换为您的完善信息页面路径
          });
        } else {
          // 登录失败，显示后端返回的错误信息
          wx.showToast({
            title: res.data.message || '登录失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
        console.error('登录请求失败：', err);
      }
    });
    */

    // 直接跳转到主界面
    wx.showToast({
      title: '登录成功',
      icon: 'success'
    });

    // 跳转到主界面或其他页面
    wx.reLaunch({
      url: '/pages/profile/profile' // 替换为您的主界面路径
    });
  },

  // 注册按钮点击事件
  onRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
});
