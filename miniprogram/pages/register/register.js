Page({
  data: {
    name: '',
    studentId: '',
    educationLevels: ['大四', '大三', '大二', '大一', '研三', '研二', '研一', '博士'],
    selectedEducation: '',
    majors: ['计算机科学与技术', '软件工程', '信息安全', '网络工程'],
    selectedMajor: '',
    college: '',
    phone: '',
    email: ''
  },

  onLoad(options) {
    // 从本地存储中获取用户信息
    const user = wx.getStorageSync('userInfo'); // 确保存储键名一致
    if (user) {
      this.setData({
        name: user.name || '',
        studentId: user.student_id || '',
        selectedEducation: user.education_level || '',
        selectedMajor: user.major || '',
        college: user.college || '',
        phone: user.phone || '',
        email: user.email || ''
      });
    }
  },

  // 姓名输入
  onNameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },

  // 学号输入
  onStudentIdInput(e) {
    this.setData({
      studentId: e.detail.value
    });
  },

  // 学历选择
  onEducationChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedEducation: this.data.educationLevels[index]
    });
  },

  // 专业选择
  onMajorChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedMajor: this.data.majors[index]
    });
  },

  // 学院输入
  onCollegeInput(e) {
    this.setData({
      college: e.detail.value
    });
  },

  // 电话输入
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 邮箱输入
  onEmailInput(e) {
    this.setData({
      email: e.detail.value
    });
  },

  // 完成按钮点击事件
  onSubmit() {
    const {
      name,
      studentId,
      selectedEducation,
      selectedMajor,
      college,
      phone,
      email
    } = this.data;

    // 简单表单验证
    if (!name || !studentId || !selectedEducation || !selectedMajor || !college || !phone || !email) {
      wx.showToast({
        title: '请完整填写信息',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '提交中...',
    });

    // 获取存储的用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    // 获取用户的 openid 或其他标识
    const openId = userInfo.openid; // 确保 userInfo 中包含 openid

    if (!openId) {
      wx.showToast({
        title: '无法获取用户信息',
        icon: 'none'
      });
      return;
    }

    // 调用云函数 'updateUserProfile'（需要创建）
    wx.cloud.callFunction({
      name: 'updateUserProfile',
      data: {
        openId: openId, // 使用用户的 openid 作为标识
        name,
        student_id: studentId,
        education_level: selectedEducation,
        major: selectedMajor,
        college,
        phone,
        email
      },
      success: res => {
        wx.hideLoading();
        console.log('云函数返回结果：', res);
        if (res.result.success) {
          wx.showToast({
            title: '信息已提交',
            icon: 'success'
          });

          // 更新存储中的用户信息
          wx.setStorageSync('userInfo', res.result.user);

          // 跳转到主页面
          wx.reLaunch({
            url: '/pages/home/home' // 替换为您的主页面路径
          });
        } else {
          wx.showToast({
            title: res.result.message || '提交失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        });
        console.error('信息提交请求失败：', err);
      }
    });
  }
});
