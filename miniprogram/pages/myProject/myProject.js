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
  // loadMyProjects() {
  //   const student_id = getApp().globalData.userProfile.studentId;
  //   console.log("student_id" + student_id);
  //   const app = getApp();
  //   const myProjects = app.globalData.myProjects.map(project => ({
  //     ...project,
  //     formattedCreatedAt: this.formatDate(project.createdAt)
  //   }));
  //   this.setData({
  //     myProjects: myProjects
  //   });

    
  // },
  loadMyProjects() {
    const student_id = getApp().globalData.userProfile.studentId;
    console.log("student_id: " + student_id);
    
    const db = wx.cloud.database();
    const projectsCollection = db.collection('projects');

    // 从数据库获取当前用户的项目
    projectsCollection.where({
      studentId: student_id // 根据 studentId 查询
    }).get().then(res => {
      const myProjects = res.data.map(project => ({
        ...project,
        formattedCreatedAt: this.formatDate(project.createdAt)
      }));

      this.setData({
        myProjects: myProjects
      });

      if (myProjects.length === 0) {
        wx.showToast({
          title: '没有找到项目',
          icon: 'none',
        });
      }
    }).catch(err => {
      console.error('获取项目失败：', err);
      wx.showToast({
        title: '加载项目失败',
        icon: 'none',
      });
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
  },

  /**
   * 处理图片加载错误，显示占位图
   */
  onImageError(e) {
    const projectId = e.currentTarget.dataset.projectId;
    const updatedProjects = this.data.myProjects.map(project => {
      if (project._id === projectId) {
        return {
          ...project,
          tempImageUrl: '/images/placeholder.png' // 使用本地占位图
        };
      }
      return project;
    });
    this.setData({
      myProjects: updatedProjects
    });
  },

  /**
   * 点击项目，跳转到“项目详情_修改”页面
   */
  onProjectTap(e) {
    const projectId = e.currentTarget.dataset.projectId; // 使用 _id
    wx.navigateTo({
      url: `/pages/ProjectDetail_Modify/ProjectDetail_Modify?id=${projectId}`,
    });
  },
});
