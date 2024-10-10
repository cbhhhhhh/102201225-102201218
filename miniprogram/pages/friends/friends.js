// pages/friends/friends.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends: [], // 好友列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadFriends();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadFriends();
  },

  /**
   * 加载好友列表
   */
  loadFriends: function () {
    const app = getApp();
    this.setData({
      friends: app.globalData.friendDetails
    });
  },

  /**
   * 点击好友，跳转到聊天页面
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
   * 处理图片加载错误，显示占位图
   */
  onImageError: function (e) {
    const index = e.currentTarget.dataset.index;
    const updatedFriends = this.data.friends;
    updatedFriends[index].avatarUrl = '/images/placeholder.png';
    this.setData({
      friends: updatedFriends
    });
  },

});
