// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  /**
   * 自定义事件处理函数
   */

  // 点击“创建项目”按钮
  onCreateProject() {
    // 跳转到创建项目页面
    wx.navigateTo({
      url: '/pages/CreateProject/CreateProject',
    });
  },

  // 点击“加入项目”按钮
  onJoinProject() {
    // 跳转到加入项目页面
    wx.switchTab({
      url: '/pages/first/first',
    })
  },

  // 点击“我的项目”按钮
  onMyProjects() {
    // 跳转到我的项目页面
    wx.navigateTo({
      url: '/pages/myProject/myProject',
    });
  },

  // 点击第四个按钮（假设为“设置”）
  onSettings() {
    // 跳转到设置页面
    wx.navigateTo({
      url: '/pages/first/first',
    });
  },
})
