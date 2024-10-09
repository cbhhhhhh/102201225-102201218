// pages/ProjectDetail/ProjectDetail.js
Page({
  data: {
    project: null,
    formattedCreatedAt: '',
  },
  onLoad(options) {
    const projectId = options.id; // 这里的 id 实际上是 _id
    const app = getApp();
    const allProjects = app.globalData.allProjects;
    const project = allProjects.find((p) => p._id === projectId); // 使用 _id 进行查找
    if (project) {
      // 格式化创建时间
      const createdAt = new Date(project.createdAt);
      const formattedCreatedAt = this.formatDate(createdAt);

      this.setData({
        project: project,
        formattedCreatedAt: formattedCreatedAt,
      });
    } else {
      wx.showToast({
        title: '项目未找到',
        icon: 'none',
        duration: 2000,
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    }
  },
  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },
  // 补零函数
  padZero(num) {
    return num < 10 ? '0' + num : num;
  },
  // 点击关键词
  onKeywordTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    wx.navigateTo({
      url: `/pages/SearchResult/SearchResult?keyword=${keyword}`,
    });
  },
  // 点击报名按钮
  onSignup() {
    wx.showToast({
      title: '报名成功',
      icon: 'success',
    });
    // 可以在这里更新项目的报名人数等信息
  },
});
