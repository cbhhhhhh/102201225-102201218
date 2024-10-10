// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputMessage: '', // 用户输入的消息
    messages: [], // 聊天消息列表
    myAvatarUrl: '/images/my-avatar.png', // 自己的头像
    friendAvatarUrl: '/images/other-avatar.png', // 对方的头像
    friendName: '', // 对方的姓名
    userId: '', // 自己的用户 ID
    chatWithUserId: '', // 正在聊天的用户 ID
    scrollTop: 0, // 滚动位置
    scrollIntoView: '', // 滚动到最后一条消息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp();
    this.setData({
      userId: app.globalData.userProfile.openid, // 自己的用户 ID
      chatWithUserId: options.chatWithUserId, // 正在聊天的用户 ID
      friendName: decodeURIComponent(options.friendName) || '好友', // 对方姓名，解码以防特殊字符
      friendAvatarUrl: decodeURIComponent(options.friendAvatarUrl) || '/images/other-avatar.png' // 对方头像，解码
    });

    // 初始化消息
    this.initMessages();

    // 开始监听新消息
    this.watchMessages();
  },

  /**  
   * 初始化消息，加载历史聊天记录
   */
  initMessages: function () {
    const db = wx.cloud.database();
    const _ = db.command;

    db.collection('conversations')
      .where({
        participants: _.all([this.data.userId, this.data.chatWithUserId]) // 使用 $all 操作符
      })
      .get()
      .then(convRes => {
        if (convRes.data.length === 0) {
          console.warn('未找到对应的会话');
          // **不创建新的会话，等待发送消息时创建**
          this.setData({
            messages: []
          });
        } else {
          // 存在会话，加载消息
          this.loadMessages();
        }
      })
      .catch(err => {
        console.error('查找会话失败：', err);
        wx.showToast({
          title: '加载消息失败',
          icon: 'none',
          duration: 2000
        });
      });
  },

  /**
   * 加载消息列表（会话中的消息）
   */
  loadMessages: function () {
    const db = wx.cloud.database();
    const _ = db.command;
    const userId = this.data.userId;
    const chatWithUserId = this.data.chatWithUserId;

    // 查询会话中的所有消息
    db.collection('messages')
      .where({
        or: [
          {
            from: userId,
            to: chatWithUserId
          },
          {
            from: chatWithUserId,
            to: userId
          }
        ]
      })
      .orderBy('timestamp', 'asc')
      .get()
      .then(res => {
        const messages = res.data.map((msg, index) => ({
          ...msg,
          id: `msg_${index}`
        }));
        this.setData({
          messages: messages,
          scrollTop: messages.length * 1000, // 根据消息数量调整
          scrollIntoView: `msg_${messages.length - 1}` // 用于滚动到最后一条消息
        });
      })
      .catch(err => {
        console.error('加载聊天消息失败：', err);
        wx.showToast({
          title: '加载消息失败',
          icon: 'none',
          duration: 2000
        });
      });
  },

  /**
   * 监听新消息
   */
  watchMessages: function () {
    const db = wx.cloud.database();
    const _ = db.command;
    const userId = this.data.userId;
    const chatWithUserId = this.data.chatWithUserId;

    this.messageWatcher = db.collection('messages')
      .where({
        or: [
          {
            from: userId,
            to: chatWithUserId
          },
          {
            from: chatWithUserId,
            to: userId
          }
        ]
      })
      .orderBy('timestamp', 'asc')
      .watch({
        onChange: snapshot => {
          if (snapshot.type === 'init') {
            // 初始加载已在 loadMessages 中处理
            return;
          }

          if (snapshot.docChanges) {
            const newMessages = snapshot.docChanges.map(change => {
              if (change.type === 'add') {
                return {
                  ...change.doc,
                  id: `msg_${this.data.messages.length}`
                };
              }
              return null;
            }).filter(msg => msg !== null);

            if (newMessages.length > 0) {
              this.setData({
                messages: this.data.messages.concat(newMessages),
                scrollTop: this.data.messages.length * 1000 + newMessages.length * 1000,
                scrollIntoView: `msg_${this.data.messages.length + newMessages.length - 1}`
              });
            }
          }
        },
        onError: err => {
          console.error('监听聊天消息错误：', err);
        }
      });
  },

  /**
   * 页面卸载时清理监听器
   */
  onUnload: function () {
    if (this.messageWatcher) {
      this.messageWatcher.close();
    }
  },

  /**
   * 处理输入框变化
   */
  onInputMessage: function (e) {
    this.setData({
      inputMessage: e.detail.value
    });
  },

  /**
   * 发送消息
   */
  sendMessage: function () {
    const messageContent = this.data.inputMessage.trim();
    if (messageContent === '') return;

    const db = wx.cloud.database();
    const _ = db.command;
    const timestamp = new Date().getTime();

    const messageData = {
      from: this.data.userId,
      to: this.data.chatWithUserId,
      content: messageContent,
      timestamp: timestamp,
    };

    // 将消息添加到数据库
    db.collection('messages')
      .add({
        data: messageData
      })
      .then(res => {
        // 清空输入框
        this.setData({
          inputMessage: ''
        });

        // 更新会话的最后一条消息和时间戳
        db.collection('conversations').where({
          participants: _.all([this.data.userId, this.data.chatWithUserId])
        }).get().then(convRes => {
          if (convRes.data.length > 0) {
            const conversation = convRes.data[0];
            db.collection('conversations').doc(conversation._id).update({
              data: {
                lastMessage: messageData,
                lastMessageTimestamp: db.serverDate()
              }
            });
          } else {
            // 如果会话不存在，则创建一个新的会话
            db.collection('conversations').add({
              data: {
                participants: [this.data.userId, this.data.chatWithUserId],
                lastMessage: messageData,
                lastMessageTimestamp: db.serverDate(),
                createdAt: db.serverDate()
              }
            });
          }
        });
      })
      .catch(err => {
        console.error('发送消息失败：', err);
        wx.showToast({
          title: '发送失败',
          icon: 'none',
          duration: 2000
        });
      });
  },

  /**
   * 处理图片加载错误，显示占位图
   */
  onImageError: function (e) {
    if (e.currentTarget.dataset.role === 'friend') {
      this.setData({
        friendAvatarUrl: '/images/placeholder.png'
      });
    } else {
      // 其他头像错误处理
    }
  },

});
