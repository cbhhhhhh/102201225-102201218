// pages/ProjectDetail_Modify/ProjectDetail_Modify.js
Page({
  data: {
    project: null,
    formattedCreatedAt: '',
    tempImageUrl: '',
    showDeleteConfirm: false,
  },

  onLoad(options) {
    const projectId = options.id; // 获取传递的项目 ID
    if (!projectId) {
      wx.showToast({
        title: '项目ID缺失',
        icon: 'none',
        duration: 2000,
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
      return;
    }
    this.loadProjectDetail(projectId);
  },

  /**
   * 加载项目详情
   */
  loadProjectDetail(projectId) {
    const app = getApp();
    const allProjects = app.globalData.allProjects;
    const project = allProjects.find(p => p._id === projectId);

    if (project) {
      const formattedCreatedAt = this.formatDate(new Date(project.createdAt));

      this.setData({
        project: project,
        formattedCreatedAt: formattedCreatedAt,
      });

      // 获取临时文件 URL
      wx.cloud.getTempFileURL({
        fileList: [project.imageUrl],
        success: resTemp => {
          if (resTemp.fileList.length > 0 && resTemp.fileList[0].tempFileURL) {
            this.setData({
              tempImageUrl: resTemp.fileList[0].tempFileURL
            });
          } else {
            console.warn('未获取到临时文件URL');
          }
        },
        fail: err => {
          console.error('获取临时文件URL失败：', err);
        }
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

  /**
   * 格式化日期
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  /**
   * 补零函数
   */
  padZero(num) {
    return num < 10 ? '0' + num : num;
  },

  /**
   * 处理图片加载错误，显示占位图
   */
  onImageError(e) {
    this.setData({
      tempImageUrl: '/images/placeholder.png' // 使用本地占位图
    });
  },

  /**
   * 点击关键词，跳转到搜索结果页
   */
  onKeywordTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    wx.navigateTo({
      url: `/pages/SearchResult/SearchResult?keyword=${keyword}`,
    });
  },

  /**
   * 点击删除按钮，显示删除确认弹窗
   */
  onDelete() {
    this.setData({
      showDeleteConfirm: true
    });
  },

  /**
   * 确认删除项目
   */
  confirmDelete() {
    const projectId = this.data.project._id;
    const db = wx.cloud.database();
    const projectsCollection = db.collection('projects');

    wx.showLoading({
      title: '删除中...',
    });

    projectsCollection.doc(projectId).remove({
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '项目删除成功',
          icon: 'success',
          duration: 2000,
        });

        // 从全局数据中移除该项目
        const app = getApp();
        app.globalData.myProjects = app.globalData.myProjects.filter(p => p._id !== projectId);
        app.globalData.allProjects = app.globalData.allProjects.filter(p => p._id !== projectId);

        // 关闭弹窗并返回上一页
        this.setData({
          showDeleteConfirm: false
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '项目删除失败',
          icon: 'none',
          duration: 2000,
        });
        console.error('删除项目失败：', err);
      }
    });
  },

  /**
   * 取消删除操作
   */
  cancelDelete() {
    this.setData({
      showDeleteConfirm: false
    });
  },

  /**
   * 点击修改按钮，跳转到“创建项目”页面，并传递项目数据以进行修改
   */
  onModify() {
    const project = this.data.project;

    wx.navigateTo({
      url: `/pages/CreateProject/CreateProject?mode=edit&id=${project._id}`,
    });
  },
});
