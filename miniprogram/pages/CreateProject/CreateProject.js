// pages/CreateProject/CreateProject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectName: '',
    projectTypes: ['社会实践', '创新创业', '科研比赛'],
    selectedProjectType: '',
    keywords: [], // 修改为数组
    maxKeywords: 3, // 最大关键词数量
    talentNumber: '',
    projectDescription: '',
    imageUrl: '', // 上传后的图片URL
    previewImageUrl: '', // 本地预览图片路径
    showKeywordInput: false, // 控制关键词输入框的显示
    newKeyword: '', // 新关键词的临时存储
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 可以在这里初始化数据或获取传递的参数
  },

  // 项目名称输入
  onProjectNameInput(e) {
    this.setData({
      projectName: e.detail.value,
    });
  },

  // 项目类型选择
  onProjectTypeChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedProjectType: this.data.projectTypes[index],
    });
  },


  // 显示关键词输入框
  showAddKeyword() {
    this.setData({
      showKeywordInput: true,
      newKeyword: '',
    });
  },

  // 关键词输入
  onNewKeywordInput(e) {
    this.setData({
      newKeyword: e.detail.value,
    });
  },

  // 添加关键词
  addKeyword() {
    const { newKeyword, keywords, maxKeywords } = this.data;
    const trimmedKeyword = newKeyword.trim();

    if (!trimmedKeyword) {
      wx.showToast({
        title: '关键词不能为空',
        icon: 'none',
      });
      return;
    }

    if (keywords.length >= maxKeywords) {
      wx.showToast({
        title: `最多添加${maxKeywords}个关键词`,
        icon: 'none',
      });
      return;
    }

    if (keywords.includes(trimmedKeyword)) {
      wx.showToast({
        title: '关键词已存在',
        icon: 'none',
      });
      return;
    }

    this.setData({
      keywords: [...keywords, trimmedKeyword],
      showKeywordInput: false,
      newKeyword: '',
    });
  },

  // 删除关键词方法已移除

  // 人才数量输入
  onTalentNumberInput(e) {
    this.setData({
      talentNumber: e.detail.value,
    });
  },

  // 项目描述输入
  onProjectDescriptionInput(e) {
    this.setData({
      projectDescription: e.detail.value,
    });
  },

  // 点击取消按钮
  onCancel() {
    // 返回上一页
    wx.navigateBack();
  },

  // 点击创建按钮
  async onSubmit() {
    // 表单验证
    if (!this.data.projectName) {
      wx.showToast({
        title: '请输入项目名称',
        icon: 'none',
      });
      return;
    }
    if (!this.data.selectedProjectType) {
      wx.showToast({
        title: '请选择项目类型',
        icon: 'none',
      });
      return;
    }
    // 可以继续添加其他验证...

    // 如果有上传的图片，确保 imageUrl 已经上传
    if (!this.data.imageUrl) {
      wx.showToast({
        title: '请上传项目展示图片',
        icon: 'none',
      });
      return;
    }

    // 提交表单数据
    const projectData = {
      id: Date.now(), // 简单生成唯一ID
      name: this.data.projectName,
      category: this.data.selectedProjectType,
      tags: this.data.keywords, // 直接使用数组
      talentNumber: this.data.talentNumber,
      description: this.data.projectDescription,
      imageUrl: this.data.imageUrl, // 使用上传后的图片URL
      createdAt: new Date().toISOString() // 添加创建时间
    };

    // 获取应用实例
    const app = getApp();
    // 将新项目添加到全局数据的项目列表中
    app.globalData.allProjects.unshift(projectData);
    // 将新项目添加到我的项目列表中
    app.globalData.myProjects.unshift(projectData);

    // 保存数据到本地存储（如果已实现持久化）
    if (app.saveProjects) {
      app.saveProjects();
    }

    wx.showToast({
      title: '项目创建成功',
      icon: 'success',
      duration: 2000,
    });

    // 提交成功后，跳转到项目列表页面
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/first/first',
      });
    }, 2000);
  },

  /**
   * 选择并上传图片
   */
  onChooseImage() {
    const that = this;
    wx.chooseImage({
      count: 1, // 默认选择1张图片
      sizeType: ['original', 'compressed'], // 可以选择原图或压缩图
      sourceType: ['album', 'camera'], // 可以选择相册或拍照
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 0) {
          // 设置预览图片路径
          that.setData({
            previewImageUrl: tempFilePaths[0],
          });

          // 上传图片到云存储
          wx.showLoading({
            title: '上传中...',
          });
          const cloudPath = 'projectImages/' + Date.now() + '-' + Math.floor(Math.random() * 1000) + tempFilePaths[0].match(/\.[^.]+?$/)[0];
          wx.cloud.uploadFile({
            cloudPath,
            filePath: tempFilePaths[0],
            success: resUpload => {
              wx.hideLoading();
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000,
              });
              //设置图片URL到数据中
              that.setData({
                imageUrl: resUpload.fileID
              });
            },
            fail: err => {
              wx.hideLoading();
              wx.showToast({
                title: '上传失败',
                icon: 'none',
                duration: 2000,
              });
              console.error('上传失败', err);
            }
          });
        }
      },
      fail(err) {
        console.error('选择图片失败', err);
      }
    });
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

  }
});
