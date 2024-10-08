// pages/profile/profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    studentId: '',
    educationLevels: ['大四', '大三', '大二','大一','研三','研二','研一','博士'],
    selectedEducation: '',
    majors: ['计算机科学与技术', '软件工程', '信息安全', '网络工程'],
    selectedMajor: '',
    college: '',
    phone: '',
    email: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app = getApp();

    // 检查是否已经获取到 openid
    if (!app.globalData.userProfile.openid) {
      // 如果未获取到，调用获取 openid 的方法
      app.getUserOpenId().then(openid => {
        console.log('OpenID 已获取：', openid);
        // 加载用户信息
        this.loadUserProfile();
      }).catch(err => {
        wx.showToast({
          title: '无法获取用户信息，请重试',
          icon: 'none',
        });
      });
    } else {
      // 如果已经获取到 openid，直接加载用户信息
      this.loadUserProfile();
    }
  },

  // 从全局数据加载用户信息
  loadUserProfile() {
    const app = getApp();
    const userProfile = app.globalData.userProfile;

    // 更新页面数据
    this.setData({
      name: userProfile.name || '',
      studentId: userProfile.studentId || '',
      selectedEducation: userProfile.selectedEducation || '',
      selectedMajor: userProfile.selectedMajor || '',
      college: userProfile.college || '',
      phone: userProfile.phone || '',
      email: userProfile.email || ''
    });
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

    const app = getApp();

    // 检查是否已经获取到 openid
    if (!app.globalData.userProfile.openid) {
      wx.showToast({
        title: '正在获取用户信息，请稍后重试',
        icon: 'none',
      });
      // 重新获取 OpenID
      app.getUserOpenId().then(openid => {
        console.log('OpenID 已获取：', openid);
        // 继续提交
        this.submitUserProfile();
      }).catch(err => {
        wx.showToast({
          title: '无法获取用户信息，请重试',
          icon: 'none',
        });
      });
      return;
    }

    // 如果已经有 OpenID，直接提交
    this.submitUserProfile();
  },

  // 新增方法，用于提交用户信息
  submitUserProfile() {
    const {
      name,
      studentId,
      selectedEducation,
      selectedMajor,
      college,
      phone,
      email
    } = this.data;

    const app = getApp();

    // 更新全局用户信息
    app.globalData.userProfile = {
      ...app.globalData.userProfile, // 保留已有的 openid 和 avatarUrl
      name,
      studentId,
      selectedEducation,
      selectedMajor,
      grade: this.data.grade,
      college,
      phone,
      email
    };

    // 保存用户信息到本地存储
    app.saveUserProfile();

    // 显示提交成功的提示
    wx.showToast({
      title: '信息已提交',
      icon: 'success'
    });

    // 跳转到主页面
    wx.reLaunch({
      url: '/pages/home/home'
    });
  }
});
