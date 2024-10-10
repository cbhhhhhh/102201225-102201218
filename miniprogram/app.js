// app.js
App({
  /**
   * 全局数据
   */
  globalData: {
    // 预定义项目
    predefinedProjects: [
      // 其他预定义项目...
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
      avatarUrl: '/images/default-avatar.png', // 初始化头像 URL
      openid: ''     // 用于存储用户的 OpenID
    }, // 用于存储用户个人信息
    friends: [], // 当前用户的好友 OpenID 列表
    friendDetails: [] // 好友的详细信息列表（姓名、头像等）
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
              // this.loadMyProjects();

              // 加载当前用户的好友列表
              this.loadFriends();
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
    // const openid = this.globalData.userProfile.openid;
    const student_id = this.globalData.userProfile.student_id;
  //   if (openid) {
  //     const db = wx.cloud.database();
  //     const projectsCollection = db.collection('projects');

  //     projectsCollection.where({
  //       openid: openid
  //     }).orderBy('createdAt', 'desc').get({
  //       success: res => {
  //         if (res.data && Array.isArray(res.data)) {
  //           this.globalData.myProjects = res.data;
  //           console.log('用户项目数据加载完成:', this.globalData.myProjects);
  //         } else {
  //           console.warn('未找到用户创建的项目');
  //           this.globalData.myProjects = [];
  //         }
  //       },
  //       fail: err => {
  //         console.error('获取用户项目失败：', err);
  //         this.globalData.myProjects = [];
  //       }
  //     });

  //     // 加载 userProfile
  //     const storedUserProfile = wx.getStorageSync(`userProfile_${openid}`);
  //     if (storedUserProfile && typeof storedUserProfile === 'object') {
  //       // 确保 avatarUrl 存在
  //       this.globalData.userProfile = {
  //         avatarUrl: '/images/default-avatar.png',
  //         ...storedUserProfile,
  //         openid: openid // 保持 OpenID 一致
  //       };
  //     }
  //   } else {
  //     console.warn('用户尚未登录或 OpenID 尚未获取，无法加载用户数据');
  //     this.globalData.myProjects = [];
  //   }
  // },
  console.log("student_id" + student_id)
  if (student_id) {
    const db = wx.cloud.database();
    const projectsCollection = db.collection('projects');

    projectsCollection.where({
      create_id: student_id
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
    // const storedUserProfile = wx.getStorageSync(`userProfile_${openid}`);
    // if (storedUserProfile && typeof storedUserProfile === 'object') {
    //   // 确保 avatarUrl 存在
    //   this.globalData.userProfile = {
    //     avatarUrl: '/images/default-avatar.png',
    //     ...storedUserProfile,
    //     openid: openid // 保持 OpenID 一致
    //   };
    // }
  } else {
    console.warn('用户尚未登录或 OpenID 尚未获取，无法加载用户数据');
    this.globalData.myProjects = [];
  }
},
  /**
   * 加载当前用户的好友列表
   */
  loadFriends: function () {
    const openid = this.globalData.userProfile.openid;

    if (openid) {
      const db = wx.cloud.database();
      const friendsCollection = db.collection('friends');

      friendsCollection.where({
        userId: openid
      }).get({
        success: res => {
          if (res.data && Array.isArray(res.data)) {
            const friendIds = res.data.map(friend => friend.friendId);
            this.globalData.friends = friendIds;
            console.log('好友列表加载完成:', this.globalData.friends);

            // 加载好友的详细信息
            this.loadFriendDetails(friendIds);

            // 开始监听好友列表的变化（可选）
            this.watchFriends();
          } else {
            console.warn('未找到好友');
            this.globalData.friends = [];
            this.globalData.friendDetails = [];
          }
        },
        fail: err => {
          console.error('获取好友列表失败：', err);
          this.globalData.friends = [];
          this.globalData.friendDetails = [];
        }
      });
    } else {
      console.warn('用户尚未登录或 OpenID 尚未获取，无法加载好友数据');
      this.globalData.friends = [];
      this.globalData.friendDetails = [];
    }
  },

  /**
   * 加载好友的详细信息
   * @param {Array} friendIds - 好友的 OpenID 列表
   */
  loadFriendDetails: function (friendIds) {
    if (friendIds.length === 0) {
      this.globalData.friendDetails = [];
      return;
    }

    const db = wx.cloud.database();
    const usersCollection = db.collection('users');
    const _ = db.command;

    usersCollection.where({
      openid: _.in(friendIds)
    }).get({
      success: res => {
        if (res.data && Array.isArray(res.data)) {
          this.globalData.friendDetails = res.data.map(user => ({
            openid: user.openid,
            name: user.name,
            avatarUrl: user.avatarUrl || '/images/default-avatar.png',
            studentId: user.student_id
            // 其他需要的字段...
          }));
          console.log('好友详细信息加载完成:', this.globalData.friendDetails);
        } else {
          console.warn('未找到任何好友的详细信息');
          this.globalData.friendDetails = [];
        }
      },
      fail: err => {
        console.error('获取好友详细信息失败：', err);
        this.globalData.friendDetails = [];
      }
    });
  },

  /**
   * 监听好友列表的实时更新（可选）
   */
  watchFriends: function () {
    const openid = this.globalData.userProfile.openid;

    if (openid) {
      const db = wx.cloud.database();
      const friendsCollection = db.collection('friends');
      const _ = db.command;

      this.friendsWatcher = friendsCollection.where({
        userId: openid
      }).watch({
        onChange: snapshot => {
          if (snapshot.type === 'init') {
            // 初始加载已在 loadFriends 中处理
            return;
          }

          if (snapshot.docChanges) {
            snapshot.docChanges.forEach(change => {
              if (change.type === 'add') {
                const newFriendId = change.doc.friendId;
                if (!this.globalData.friends.includes(newFriendId)) {
                  this.globalData.friends.push(newFriendId);
                  console.log('新好友添加：', newFriendId);
                  // 加载新好友的详细信息
                  this.loadFriendDetails([newFriendId]);
                }
              }

              // 可以处理 'remove' 和 'update' 类型的变化
            });
          }
        },
        onError: err => {
          console.error('监听好友列表错误：', err);
        }
      });
    }
  },

  /**
   * 更新全局数据中的好友列表和详细信息
   * @param {Object} newFriend - 新添加的好友信息
   */
  updateFriends: function (newFriend) {
    if (!this.globalData.friends.includes(newFriend.openid)) {
      this.globalData.friends.push(newFriend.openid);
      this.globalData.friendDetails.push({
        openid: newFriend.openid,
        name: newFriend.name,
        avatarUrl: newFriend.avatarUrl || '/images/default-avatar.png',
        studentId: newFriend.student_id
        // 其他需要的字段...
      });
      console.log('全局数据中添加了新好友：', newFriend);
    }
  },

  /**
   * 页面卸载时清理监听器
   */
  onUnload: function () {
    if (this.friendsWatcher) {
      this.friendsWatcher.close();
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
