// pages/messages/messages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 'messages', // 当前激活的标签：'messages' 或 'addFriend'
    messages: [], // 消息列表（会话列表）
    friendStudentId: '', // 添加好友时输入的学号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMessages();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadMessages();
  },

  /**
   * 切换标签
   */
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });

    if (tab === 'messages') {
      this.loadMessages();
    }
  },

  /**
   * 加载消息列表（会话列表）
   */
  loadMessages: function () {
    const db = wx.cloud.database();
    const _ = db.command;
    const app = getApp();
    const userId = app.globalData.userProfile.openid;

    db.collection('conversations')
      .where({
        participants: _.all([userId]),
        lastMessage: _.neq(null) // 仅查询有最后一条消息的会话
      })
      .orderBy('lastMessageTimestamp', 'desc')
      .get()
      .then(res => {
        const conversations = res.data.map(conv => {
          const otherUserId = conv.participants.find(id => id !== userId);
          const friend = app.globalData.friendDetails.find(f => f.openid === otherUserId) || {};
          return {
            ...conv,
            formattedDate: this.formatDate(conv.lastMessageTimestamp),
            preview: conv.lastMessage ? conv.lastMessage.content : '暂无消息',
            senderName: conv.lastMessage && conv.lastMessage.from === userId ? '我' : (friend.name || '好友'),
            avatarUrl: friend.avatarUrl || '/images/placeholder.png'
          };
        });
        this.setData({
          messages: conversations
        });
      })
      .catch(err => {
        console.error('加载消息失败：', err);
        wx.showToast({
          title: '加载消息失败',
          icon: 'none',
          duration: 2000
        });
      });
  },

  /**
   * 格式化日期
   */
  formatDate: function (timestamp) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return '无效日期';
    }
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  /**
   * 处理图片加载错误，显示占位图
   */
  onImageError: function (e) {
    const index = e.currentTarget.dataset.index;
    const updatedMessages = this.data.messages;
    updatedMessages[index].avatarUrl = '/images/placeholder.png';
    this.setData({
      messages: updatedMessages
    });
  },

  /**
   * 点击消息项，跳转到聊天页面
   */
  openChat: function (e) {
    const chatWithUserId = e.currentTarget.dataset.chatWith;
    const friend = getApp().globalData.friendDetails.find(friend => friend.openid === chatWithUserId);

    if (!friend) {
      wx.showToast({
        title: '好友信息加载中',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/chat/chat?chatWithUserId=${chatWithUserId}&friendName=${encodeURIComponent(friend.name)}&friendAvatarUrl=${encodeURIComponent(friend.avatarUrl)}`,
    });
  },

  /**
   * 处理添加好友输入框变化
   */
  onFriendInput: function (e) {
    this.setData({
      friendStudentId: e.detail.value
    });
  },

  /**
   * 添加好友
   */
  addFriend: function () {
    const studentId = this.data.friendStudentId.trim();
    if (!studentId) {
      wx.showToast({
        title: '请输入学号',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 调用云函数进行添加好友
    wx.cloud.callFunction({
      name: 'addFriend',
      data: {
        student_id: studentId
      }
    }).then(res => {
      if (res.result.success) {
        wx.showToast({
          title: '好友添加成功',
          icon: 'success',
          duration: 2000
        });
        this.setData({
          friendStudentId: ''
        });

        // 重新加载消息列表以显示新的会话（如果有消息）
        this.loadMessages();
      } else {
        wx.showToast({
          title: res.result.message || '添加好友失败',
          icon: 'none',
          duration: 2000
        });
      }
    }).catch(err => {
      console.error('添加好友失败：', err);
      wx.showToast({
        title: '添加好友失败',
        icon: 'none',
        duration: 2000
      });
    });
  }

});
