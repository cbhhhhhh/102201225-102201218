// app.js
App({
  /**
   * 全局数据
   */
  globalData: {
    allProjects: [
      {
        id: 1,
        name: '乡村支教实践活动',
        description: '深入乡村，为留守儿童提供教育支持。',
        category: '社会实践',
        tags: ['支教', '志愿者', '乡村'],
        imageUrl: '/images/home.png',
        createdAt: '2024-04-27T14:30:00Z' // 添加创建时间
      },
      {
        id: 2,
        name: '环保公益宣传',
        description: '组织环保活动，提高公众环保意识。',
        category: '社会实践',
        tags: ['环保', '公益', '宣传'],
        imageUrl: '/images/project2.jpg',
        createdAt: '2024-04-28T09:15:00Z'
      },
      // 创新创业项目
      {
        id: 3,
        name: '校园二手交易平台',
        description: '搭建供师生使用的二手物品交易平台。',
        category: '创新创业',
        tags: ['创业', '电商', '校园'],
        imageUrl: '/images/project3.jpg',
        createdAt: '2024-05-01T10:00:00Z'
      },
      {
        id: 4,
        name: '智能家居控制系统',
        description: '开发一套基于物联网的智能家居系统。',
        category: '创新创业',
        tags: ['智能家居', '物联网', '创新'],
        imageUrl: '/images/project4.jpg',
        createdAt: '2024-05-02T11:20:00Z'
      },
      // 科研比赛项目
      {
        id: 5,
        name: '数学建模国赛集训',
        description: '备战全国大学生数学建模竞赛，提升建模能力。',
        category: '科研比赛',
        tags: ['数学建模', '竞赛', '培训'],
        imageUrl: '/images/project5.jpg',
        createdAt: '2024-05-03T08:45:00Z'
      },
      {
        id: 6,
        name: '机器人设计大赛',
        description: '参加机器人设计大赛，培养实践能力。',
        category: '科研比赛',
        tags: ['机器人', '设计', '比赛'],
        imageUrl: '/images/project6.jpg',
        createdAt: '2024-05-04T14:10:00Z'
      }
      // 可以根据需要继续添加项目
    ],
    myProjects: [], // 用于存储用户创建的项目
    userProfile: {
      name: '',
      studentId: '',
      selectedEducation: '',
      selectedMajor: '',
      college: '',
      phone: '',
      email: '',
      avatarUrl: '' // 初始化头像 URL
    } // 用于存储用户个人信息
  },

  /**
   * 应用启动时执行
   */
  onLaunch: function () {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cbh102201225-8gcwmhi730f02e6f', // 请确保这里的环境ID正确
        traceUser: true,
      });
    }

    // 从本地存储加载数据
    this.loadData();
  },

  /**
   * 从本地存储加载数据
   */
  loadData: function () {
    // 加载 myProjects
    const myProjects = wx.getStorageSync('myProjects');
    if (myProjects && Array.isArray(myProjects)) {
      this.globalData.myProjects = myProjects;
    }

    // 加载 userProfile
    const storedUserProfile = wx.getStorageSync('userProfile');
    if (storedUserProfile && typeof storedUserProfile === 'object') {
      // 确保 avatarUrl 存在
      this.globalData.userProfile = {
        avatarUrl: '',
        ...storedUserProfile
      };
    }
  },

  /**
   * 保存项目数据到本地存储
   */
  saveProjects: function () {
    wx.setStorageSync('myProjects', this.globalData.myProjects);
  },

  /**
   * 保存用户信息到本地存储
   */
  saveUserProfile: function () {
    wx.setStorageSync('userProfile', this.globalData.userProfile);
  },

  /**
   * 更新用户头像
   * @param {string} newAvatarUrl - 新的头像 URL
   */
  updateUserAvatar: function (newAvatarUrl) {
    this.globalData.userProfile.avatarUrl = newAvatarUrl;
    this.saveUserProfile();
  },

  /**
   * 更新用户信息
   * @param {object} newProfile - 新的用户信息
   */
  updateUserProfile: function (newProfile) {
    this.globalData.userProfile = {
      ...this.globalData.userProfile,
      ...newProfile
    };
    this.saveUserProfile();
  }
});
