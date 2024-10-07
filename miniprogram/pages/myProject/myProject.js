// pages/myProjects/myProjects.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myProjects: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取全局数据中的我的项目，并格式化日期
    const app = getApp();
    const formattedProjects = app.globalData.myProjects.map(project => ({
      ...project,
      formattedCreatedAt: this.formatDate(project.createdAt)
    }));
    this.setData({
      myProjects: formattedProjects
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 更新我的项目列表，并格式化日期
    const app = getApp();
    const formattedProjects = app.globalData.myProjects.map(project => ({
      ...project,
      formattedCreatedAt: this.formatDate(project.createdAt)
    }));
    this.setData({
      myProjects: formattedProjects
    });
  },

  /**
   * 格式化日期
   */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return '无效日期';
    }
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

});
