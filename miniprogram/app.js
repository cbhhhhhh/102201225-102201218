// app.js
App({
  /**
   * 全局数据
   */
  globalData: {
    // 预定义项目
    predefinedProjects: [
      
      // 可以根据需要继续添加项目
    ],
    allProjects: [], // 用于存储所有项目（预定义 + 用户创建）
    myProjects: [],  // 用于存储当前用户创建的项目
    userProfile: {
      name: '',
      studentId: '',
      selectedEducation: '',
      selectedMajor: '',
      college: '',
      phone: '',
      email: '',
      avatarUrl: '', // 初始化头像 URL
      openid: ''     // 用于存储用户的 OpenID
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

              // 加载所有项目
              this.loadAllProjects();

              // 加载当前用户创建的项目
              this.loadMyProjects();
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
   * 加载所有项目，包括预定义项目和云数据库中的所有用户创建项目
   */
  loadAllProjects: function () {
    const db = wx.cloud.database();
    const projectsCollection = db.collection('projects');

    projectsCollection.orderBy('createdAt', 'desc').get({
      success: res => {
        if (res.data && Array.isArray(res.data)) {
          // 合并用户创建的所有项目和预定义项目
          this.globalData.allProjects = res.data.concat(this.globalData.predefinedProjects);
          console.log('所有项目数据加载完成:', this.globalData.allProjects);
        } else {
          console.warn('未找到任何用户创建的项目');
          this.globalData.allProjects = this.globalData.predefinedProjects;
        }
      },
      fail: err => {
        console.error('获取所有项目失败：', err);
        this.globalData.allProjects = this.globalData.predefinedProjects;
      }
    });
  },

  /**
   * 加载当前用户创建的项目
   */
  loadMyProjects: function () {
    const openid = this.globalData.userProfile.openid;

    if (openid) {
      const db = wx.cloud.database();
      const projectsCollection = db.collection('projects');

      projectsCollection.where({
        openid: openid
      }).orderBy('createdAt', 'desc').get({
        success: res => {
          if (res.data && Array.isArray(res.data)) {
            this.globalData.myProjects = res.data;
            console.log('用户项目数据加载完成:', this.globalData.myProjects);
          } else {
            console.warn('未找到用户创建的项目');
            this.globalData.myProjects = [];
          }
        },
        fail: err => {
          console.error('获取用户项目失败：', err);
          this.globalData.myProjects = [];
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
      this.globalData.myProjects = [];
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
