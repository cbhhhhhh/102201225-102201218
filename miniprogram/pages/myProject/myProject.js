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
    this.loadMyProjects();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadMyProjects();
  },

  /**
   * 加载当前用户的项目
   */
  loadMyProjects() {
    const app = getApp();
    const myProjects = app.globalData.myProjects.map(project => ({
      ...project,
      formattedCreatedAt: this.formatDate(project.createdAt)
    }));
    this.setData({
      myProjects: myProjects
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
