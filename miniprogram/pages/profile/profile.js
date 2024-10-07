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
    grade: '',
    college: '',
    phone: '',
    email: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

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

    // 保存用户信息到全局数据和本地存储
    const app = getApp();
    app.globalData.userProfile = {
      name,
      studentId,
      selectedEducation,
      selectedMajor,
      grade: this.data.grade,
      college,
      phone,
      email
    };
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
