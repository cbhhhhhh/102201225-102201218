Page({
  data: {
    inputMessage: '', // 用户输入的消息
    messages: [], // 聊天消息列表
    myAvatarUrl: '/images/my-avatar.png', // 自己的头像
    otherAvatarUrl: '/images/other-avatar.png', // 对方的头像
    userId: '', // 自己的用户 ID
    chatWithUserId: '', // 正在聊天的用户 ID
    scrollTop: 0, // 滚动位置
  },

  onLoad: function (options) {
    // 假设 options 包含您正在聊天的用户的 ID
    const app = getApp();
    this.setData({
      userId: app.globalData.userId, // 自己的用户 ID
      chatWithUserId: options.chatWithUserId, // 正在聊天的用户 ID
    });

    // 初始化消息
    this.initMessages();

    // 开始监听新消息
    this.watchMessages();
  },

  // 初始化消息，加载历史聊天记录
  initMessages: function () {
    const db = wx.cloud.database();
    const _ = db.command;

    db.collection('messages')
      .where(_.or([
        {
          from: this.data.userId,
          to: this.data.chatWithUserId,
        },
        {
          from: this.data.chatWithUserId,
          to: this.data.userId,
        }
      ]))
      .orderBy('timestamp', 'asc')
      .get()
      .then(res => {
        this.setData({
          messages: res.data,
          scrollTop: res.data.length * 1000 // 根据消息数量调整
        });
      })
      .catch(err => {
        console.error(err);
      });
  },

  // 监听新消息
  watchMessages: function () {
    const db = wx.cloud.database();
    const _ = db.command;

    this.messageWatcher = db.collection('messages')
      .where(_.or([
        {
          from: this.data.chatWithUserId,
          to: this.data.userId,
        },
        {
          from: this.data.userId,
          to: this.data.chatWithUserId,
        }
      ]))
      .orderBy('timestamp', 'asc')
      .watch({
        onChange: snapshot => {
          // 更新消息列表
          this.setData({
            messages: snapshot.docs,
            scrollTop: snapshot.docs.length * 1000 // 根据需要调整
          });
        },
        onError: err => {
          console.error('监听错误：', err);
        }
      });
  },

  // 页面卸载时清理监听器
  onUnload: function () {
    if (this.messageWatcher) {
      this.messageWatcher.close();
    }
  },

  // 处理输入框变化
  onInputMessage: function (e) {
    this.setData({
      inputMessage: e.detail.value
    });
  },

  // 发送消息
  sendMessage: function () {
    const messageContent = this.data.inputMessage.trim();
    if (messageContent === '') return;

    const db = wx.cloud.database();
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
      })
      .catch(err => {
        console.error('发送消息失败：', err);
      });
  }
});
