// app.js
App({
  /**
   * 全局数据
   */
  globalData: {
    // 预定义项目
    predefinedProjects: [
      {
        _id: 'predefined1', // 添加唯一的 _id
        name: '乡村支教实践活动',
        description: '深入乡村，为留守儿童提供教育支持。',
        category: '社会实践',
        tags: ['支教', '志愿者', '乡村'],
        talentNumber: 5,
        imageUrl: '/images/home.png',
        createdAt: '2024-04-27T14:30:00Z'
      },
      {
        _id: 'predefined2',
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
        _id: 'predefined3',
        name: '校园二手交易平台',
        description: '搭建供师生使用的二手物品交易平台。',
        category: '创新创业',
        tags: ['创业', '电商', '校园'],
        talentNumber: 4,
        imageUrl: '/images/project3.jpg',
        createdAt: '2024-05-01T10:00:00Z'
      },
      {
        _id: 'predefined4',
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
        _id: 'predefined5',
        name: '数学建模国赛集训',
        description: '备战全国大学生数学建模竞赛，提升建模能力。',
        category: '科研比赛',
        tags: ['数学建模', '竞赛', '培训'],
        talentNumber: 2,
        imageUrl: '/images/project5.jpg',
        createdAt: '2024-05-03T08:45:00Z'
      },
      {
        _id: 'predefined6',
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
    allProjects: [], // 将在加载后初始化为预定义项目 + 用户创建项目
    myProjects: [], // 用于存储当前用户创建的项目
    userProfile: {
      name: '',
      studentId: '',
      selectedEducation: '',
      selectedMajor: '',
      college: '',
      phone: '',
      email: '',
      avatarUrl: '', // 初始化头像 URL
      openid: '' // 用于存储用户的 OpenID
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

    // 调用登录接口
    wx.login({
      success: res => {
        if (res.code) {
          // 通过云函数获取 OpenID
          this.getOpenId().then(openid => {
            if (openid) {
              console.log('获取到的 OpenID：', openid);
              // 将 OpenID 存储到全局数据和本地存储
              this.globalData.userProfile.openid = openid;
              let userInfo = wx.getStorageSync('userInfo') || {};
              userInfo.openid = openid;
              wx.setStorageSync('userInfo', userInfo);

              // 加载项目数据
              this.loadProjects();
            } else {
              console.warn('未能获取到 OpenID');
            }
          }).catch(err => {
            console.error('获取 OpenID 失败：', err);
          });
        } else {
          console.error('登录失败！' + res.errMsg);
        }
      },
      fail: err => {
        console.error('wx.login 接口调用失败：', err);
      }
    });
  },

  /**
   * 调用云函数获取 OpenID
   */
  getOpenId: function () {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getOpenId',
        data: {},
        success: res => {
          if (res.result && res.result.openid) {
            resolve(res.result.openid);
          } else {
            reject('未获取到 OpenID');
          }
        },
        fail: err => {
          reject(err);
        }
      });
    });
  },

  /**
   * 从云数据库加载用户创建的项目，并初始化 allProjects
   */
  loadProjects: function () {
    const openid = this.globalData.userProfile.openid;

    if (openid) {
      const db = wx.cloud.database();
      const projectsCollection = db.collection('projects');

      // 获取当前用户创建的项目
      projectsCollection.where({
        openid: openid
      }).orderBy('createdAt', 'desc').get({
        success: res => {
          if (res.data && Array.isArray(res.data)) {
            this.globalData.myProjects = res.data;
            // 合并用户创建的项目和预定义的项目
            this.globalData.allProjects = this.globalData.myProjects.concat(this.globalData.predefinedProjects);
            console.log('项目数据加载完成:', this.globalData.allProjects);
          } else {
            console.warn('未找到用户创建的项目');
            this.globalData.allProjects = this.globalData.predefinedProjects;
          }
        },
        fail: err => {
          console.error('获取用户项目失败：', err);
          this.globalData.allProjects = this.globalData.predefinedProjects;
        }
      });

      // 加载 userProfile
      const storedUserProfile = wx.getStorageSync(`userProfile_${openid}`);
      if (storedUserProfile && typeof storedUserProfile === 'object') {
        // 确保 avatarUrl 存在
        this.globalData.userProfile = {
          avatarUrl: '',
          ...storedUserProfile,
          openid: openid // 保持 OpenID 一致
        };
      }
    } else {
      console.warn('用户尚未登录或 OpenID 尚未获取，无法加载用户数据');
      this.globalData.allProjects = this.globalData.predefinedProjects;
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
  }
});
