// pages/CreateProject/CreateProject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 'create', // 模式：create 或 edit
    projectId: '', // 项目ID，编辑模式下使用
    projectName: '',
    projectTypes: ['社会实践', '创新创业', '科研比赛'],
    selectedProjectType: '',
    keywords: [], // 修改为数组
    maxKeywords: 3, // 最大关键词数量（已更改为3）
    talentNumber: '',
    projectDescription: '',
    imageUrl: '', // 上传后的图片URL
    previewImageUrl: '', // 本地预览图片路径
    showKeywordInput: false, // 控制关键词输入框的显示
    newKeyword: '', // 新关键词的临时存储
    student_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.mode === 'edit' && options.id) {
      this.setData({
        mode: 'edit',
        projectId: options.id
      });
      this.loadProjectData(options.id);
    }
    const app = getApp();
    this.setData({
      student_id: app.globalData.userProfile.studentId
    });
  },

  /**
   * 加载项目数据以供编辑
   */
  loadProjectData(projectId) {
    const app = getApp();
    const allProjects = app.globalData.allProjects;
    const project = allProjects.find(p => p._id === projectId);

    if (project) {
      this.setData({
        projectName: project.name,
        selectedProjectType: project.category,
        keywords: project.tags,
        talentNumber: project.talentNumber.toString(),
        projectDescription: project.description,
        imageUrl: project.imageUrl,
        previewImageUrl: project.tempImageUrl || project.imageUrl, // 如果有临时URL则使用
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

  // 取消添加关键词
  cancelAddKeyword() {
    this.setData({
      showKeywordInput: false,
      newKeyword: '',
    });
  },

  // 删除关键词
  removeKeyword(e) {
    const index = e.currentTarget.dataset.index;
    const { keywords } = this.data;
    if (index >= 0 && index < keywords.length) {
      const updatedKeywords = keywords.filter((_, i) => i !== index);
      this.setData({
        keywords: updatedKeywords,
      });
    }
  },

  // 人才数量输入
  onTalentNumberInput(e) {
    let inputVal = e.detail.value;

    // 使用正则表达式移除所有非数字字符（虽然 type="digit" 已限制，但为了保险）
    inputVal = inputVal.replace(/\D/g, '');

    // 可选：限制最大值，例如 99999
    const maxVal = 99999;
    if (inputVal) {
      let num = parseInt(inputVal, 10);
      if (isNaN(num)) {
        num = '';
      } else if (num > maxVal) {
        num = maxVal;
        wx.showToast({
          title: `人才数量不能超过${maxVal}`,
          icon: 'none',
        });
      }
      inputVal = num.toString();
    }

    this.setData({
      talentNumber: inputVal,
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
    if (this.data.mode === 'edit') {
      wx.navigateBack();
    } else {
      // 清空表单数据
      this.setData({
        projectName: '',
        selectedProjectType: '',
        keywords: [],
        talentNumber: '',
        projectDescription: '',
        imageUrl: '',
        previewImageUrl: ''
      });
    }
  },

  // 点击创建或保存修改按钮
  onSubmit() {
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
    if (!this.data.talentNumber || parseInt(this.data.talentNumber, 10) <= 0) {
      wx.showToast({
        title: '请输入有效的人才数量',
        icon: 'none',
      });
      return;
    }
    if (!this.data.projectDescription) {
      wx.showToast({
        title: '请输入项目描述',
        icon: 'none',
      });
      return;
    }
    if (!this.data.imageUrl) {
      wx.showToast({
        title: '请上传项目展示图片',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    // 获取应用实例
    const app = getApp();
    const openid = app.globalData.userProfile.openid;
    console.log(app.globalData.userProfile)

    if (!openid) {
      wx.showToast({
        title: '用户未登录',
        icon: 'none',
      });
      return;
    }

    // 准备提交的项目数据
    let projectData = {
      name: this.data.projectName,
      category: this.data.selectedProjectType,
      tags: this.data.keywords, // 直接使用数组
      talentNumber: parseInt(this.data.talentNumber, 10), // 确保为数字
      description: this.data.projectDescription,
      imageUrl: this.data.imageUrl, // 使用上传后的图片URL
      openid: openid, // 关联项目创建者
      studentId: this.data.student_id,
    };

    // 仅在创建模式下添加 createdAt
    if (this.data.mode === 'create') {
      projectData.createdAt = new Date().toISOString();
    }

    const db = wx.cloud.database();
    const projectsCollection = db.collection('projects');

    wx.showLoading({
      title: this.data.mode === 'edit' ? '保存中...' : '创建中...',
    });

    if (this.data.mode === 'create') {
      // 添加新项目到云数据库
      projectsCollection.add({
        data: projectData
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '项目创建成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            // 添加到全局数据
            const newProject = {
              ...projectData,
              _id: res._id // 使用云数据库的 _id 作为项目 ID
            };
            app.globalData.myProjects.unshift(newProject);
            app.globalData.allProjects.unshift(newProject);

            // 返回上一页（“我的项目”页面）
            wx.navigateBack();
          }
        });
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '项目创建失败',
          icon: 'none',
          duration: 2000,
        });
        console.error('创建项目失败：', err);
      });
    } else if (this.data.mode === 'edit') {
      // 编辑模式，更新现有项目
      projectsCollection.doc(this.data.projectId).update({
        data: {
          name: projectData.name,
          category: projectData.category,
          tags: projectData.tags,
          talentNumber: projectData.talentNumber,
          description: projectData.description,
          imageUrl: projectData.imageUrl,
          // createdAt 不更新
        }
      }).then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '项目更新成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            // 更新全局数据
            const updatedProjectData = { ...projectData };
            delete updatedProjectData.createdAt; // 确保不覆盖 createdAt

            const updatedProjectIndex = app.globalData.myProjects.findIndex(p => p._id === this.data.projectId);
            if (updatedProjectIndex !== -1) {
              app.globalData.myProjects[updatedProjectIndex] = {
                ...app.globalData.myProjects[updatedProjectIndex],
                ...updatedProjectData
              };
            }

            const allProjectIndex = app.globalData.allProjects.findIndex(p => p._id === this.data.projectId);
            if (allProjectIndex !== -1) {
              app.globalData.allProjects[allProjectIndex] = {
                ...app.globalData.allProjects[allProjectIndex],
                ...updatedProjectData
              };
            }

            // 返回上一页
            wx.navigateBack();
          }
        });
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '项目更新失败',
          icon: 'none',
          duration: 2000,
        });
        console.error('更新项目失败：', err);
      });
    }
  },

  /**
   * 选择并上传图片
   */
  onChooseImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 0) {
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
              // 设置图片URL到数据中
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
   * 处理图片加载错误，显示占位图
   */
  onImageError(e) {
    this.setData({
      previewImageUrl: '/images/placeholder.png' // 使用本地占位图
    });
  },

});
