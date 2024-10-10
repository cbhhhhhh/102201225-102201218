// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatWithUserId: '',
    studentId: '',
    messages: [], // 聊天记录
    newMessage: '', // 新消息内容
    userId: '', // 当前用户ID
    friendAvatarUrl: '/images/placeholder.png', // 默认头像
    myAvatarUrl: '/images/placeholder.png', // 默认头像
    scrollTop: 0, // 用于控制滚动
    currentDate: '', // 当前日期显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { chatWithUserId, studentId } = options;
    const app = getApp();
    const userId = app.globalData.userProfile.openid;

    this.setData({
      chatWithUserId: chatWithUserId || '',
      studentId: studentId || '',
      userId: userId || '',
      currentDate: this.getCurrentDate(),
    });

    // 获取好友的头像
    const friend = (app.globalData.friendDetails || []).find(f => f.openid === chatWithUserId);
    if (friend) {
      this.setData({
        friendAvatarUrl: friend.avatarUrl || '/images/placeholder.png',
      });
    }

    // 获取自己的头像
    const currentUser = app.globalData.userProfile;
    if (currentUser && currentUser.avatarUrl) {
      this.setData({
        myAvatarUrl: currentUser.avatarUrl,
      });
    }

    // 加载聊天记录
    this.loadChatHistory();
  },

  /**
   * 获取当前日期，格式为 YYYY-MM-DD
   */
  getCurrentDate: function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  },

  /**
   * 加载聊天记录
   */
  loadChatHistory: function () {
    const db = wx.cloud.database();
    const _ = db.command;
    const { userId, chatWithUserId } = this.data;

    // 查询当前用户和聊天对象之间的所有消息
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
        const formattedMessages = res.data.map(msg => ({
          _id: msg._id,
          from: msg.from,
          to: msg.to,
          content: msg.content,
          timestamp: msg.timestamp, // 确保 timestamp 是 Date 对象
          isSample: msg.isSample || false, // 保留示例消息标记
        }));

        // 添加示例消息（如果还未添加）
        const hasSampleMessage = formattedMessages.some(msg => msg.isSample);
        if (!hasSampleMessage) {
          formattedMessages.unshift(this.createSampleMessage());
        }

        this.setData({
          messages: formattedMessages
        });

        // 滚动到最底部
        this.scrollToBottom();
      })
      .catch(err => {
        console.error('加载聊天记录失败：', err);
        wx.showToast({
          title: '加载聊天记录失败',
          icon: 'none',
          duration: 2000
        });
      });
  },

  /**
   * 创建示例消息对象
   */
  createSampleMessage: function () {
    return {
      _id: 'sample-message-id', // 确保唯一
      from: this.data.chatWithUserId || 'system', // 标记为系统消息或特定用户
      to: this.data.userId,
      content: '对方向你发送一条加入申请',
      timestamp: new Date(),
      isSample: true, // 标记为示例消息
    };
  },

  /**
   * 格式化日期
   */
  formatDate: function (timestamp) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  /**
   * 处理新消息输入框变化
   */
  onMessageInput: function (e) {
    this.setData({
      newMessage: e.detail.value
    });
  },

  /**
   * 发送消息
   */
  sendMessage: function () {
    const db = wx.cloud.database();
    const app = getApp();
    const { userId, chatWithUserId, newMessage, messages } = this.data;

    if (!newMessage.trim()) {
      wx.showToast({
        title: '请输入消息内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    const messageData = {
      from: userId,
      to: chatWithUserId || 'system', // 如果没有指定聊天对象，则发送给系统
      content: newMessage.trim(),
      timestamp: db.serverDate(),
      isSample: false,
    };

    // 添加消息到 'messages' 集合
    db.collection('messages').add({
      data: messageData
    }).then(res => {
      // 获取服务器返回的 _id 和 timestamp
      const addedMessage = {
        _id: res._id, // 新增的消息ID
        from: userId,
        to: chatWithUserId || 'system',
        content: newMessage.trim(),
        timestamp: new Date(), // 由于 db.serverDate() 是服务器时间，客户端暂时使用本地时间
        isSample: false,
      };

      // 直接将新消息添加到 messages 数组中
      this.setData({
        messages: [...messages, addedMessage],
        newMessage: '',
      });

      // 滚动到底部
      this.scrollToBottom();

      wx.showToast({
        title: '消息发送成功',
        icon: 'success',
        duration: 2000
      });
    }).catch(err => {
      console.error('发送消息失败：', err);
      wx.showToast({
        title: '发送消息失败',
        icon: 'none',
        duration: 2000
      });
    });
  },

  /**
   * 滚动到消息列表底部
   */
  scrollToBottom: function () {
    // 使用 scroll-into-view 属性定位到最后一条消息
    this.setData({
      scrollToView: 'msg-' + (this.data.messages.length - 1)
    });
  },

  /**
   * 处理图片加载错误，显示默认头像
   */
  // onImageError: function (e) {
  //   const className = e.currentTarget.className;
  //   if (className.includes('avatar')) {
  //     if (className.includes('friend-avatar')) {
  //       this.setData({
  //         friendAvatarUrl: '/images/placeholder.png'
  //       });
  //     } else if (className.includes('my-avatar')) {
  //       this.setData({
  //         myAvatarUrl: '/images/placeholder.png'
  //       });
  //     }
  //   }
  // }

});
