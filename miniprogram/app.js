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
        talentNumber: 5,
        imageUrl: '/images/home.png',
        createdAt: '2024-04-27T14:30:00Z'
      },
      {
        id: 2,
        name: '环保公益宣传',
        description: '组织环保活动，提高公众环保意识。',
        category: '社会实践',
        tags: ['环保', '公益', '宣传'],
        talentNumber: 3,
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
        talentNumber: 4,
        imageUrl: '/images/project3.jpg',
        createdAt: '2024-05-01T10:00:00Z'
      },
      {
        id: 4,
        name: '智能家居控制系统',
        description: '开发一套基于物联网的智能家居系统。',
        category: '创新创业',
        tags: ['智能家居', '物联网', '创新'],
        talentNumber: 6,
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
        talentNumber: 2,
        imageUrl: '/images/project5.jpg',
        createdAt: '2024-05-03T08:45:00Z'
      },
      {
        id: 6,
        name: '机器人设计大赛',
        description: '参加机器人设计大赛，培养实践能力。',
        category: '科研比赛',
        tags: ['机器人', '设计', '比赛'],
        talentNumber: 3,
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
      avatarUrl: '', // 初始化头像 URL
      openid: '' // 新增：用于存储用户的 OpenID
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

    // 调用获取用户 OpenID 的方法，并等待完成
    this.getUserOpenId().then(openid => {
      console.log('获取到 OpenID：', openid);
      // 可以在这里执行需要依赖 OpenID 的初始化操作
    }).catch(err => {
      console.error('获取 OpenID 失败：', err);
    });
  },

  getUserOpenId: function () {
    const app = this;
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'login', // 云函数名称
        data: {},
        success: res => {
          console.log('云函数 [login] 调用成功：', res);
          app.globalData.userProfile.openid = res.result.openid;

          // 获取到 OpenID 后，加载用户数据
          app.loadData();
          resolve(res.result.openid);
        },
        fail: err => {
          console.error('云函数 [login] 调用失败：', err);
          reject(err);
        }
      });
    });
  },

  /**
   * 从本地存储加载数据
   */
  loadData: function () {
    const app = this;
    const openid = app.globalData.userProfile.openid;

    if (openid) {
      // 加载 myProjects（用户创建的项目）
      const myProjects = wx.getStorageSync(`myProjects_${openid}`);
      if (myProjects && Array.isArray(myProjects)) {
        app.globalData.myProjects = myProjects;
        // 将用户创建的项目合并到 allProjects 中，放在初始项目之前
        app.globalData.allProjects = myProjects.concat(app.globalData.allProjects);
      }

      // 加载 userProfile
      const storedUserProfile = wx.getStorageSync(`userProfile_${openid}`);
      if (storedUserProfile && typeof storedUserProfile === 'object') {
        // 确保 avatarUrl 存在
        app.globalData.userProfile = {
          avatarUrl: '',
          ...storedUserProfile,
          openid: openid // 保持 OpenID 一致
        };
      }
    } else {
      console.warn('OpenID 尚未获取，无法加载用户数据');
    }
  },

  /**
   * 保存用户创建的项目到本地存储
   */
  saveProjects: function () {
    const openid = this.globalData.userProfile.openid;
    if (openid) {
      wx.setStorageSync(`myProjects_${openid}`, this.globalData.myProjects);
    } else {
      console.warn('OpenID 尚未获取，无法保存用户项目');
    }
  },

  /**
   * 保存用户信息到本地存储
   */
  saveUserProfile: function () {
    const openid = this.globalData.userProfile.openid;
    if (openid) {
      wx.setStorageSync(`userProfile_${openid}`, this.globalData.userProfile);
    } else {
      console.warn('OpenID 尚未获取，无法保存用户信息');
    }
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
