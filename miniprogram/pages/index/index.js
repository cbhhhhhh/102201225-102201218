Page({
  data: {
    openid: "",
    showModal: false, // 控制弹窗的显示状态
    userInfo: null,   // 存储用户信息
  },

  // 页面加载时执行，检查本地缓存
  onLoad: function () {
    // 检查openid和登录状态
    wx.getStorage({
      key: 'openid',
      success: res => {
        this.setData({ openid: res.data });
      },
      fail: () => {
        this.getCode();
      }
    });
  },

  // 显示绑定手机号弹窗
  showDialogBtn: function () {
    this.setData({
      showModal: true
    });
  },

  // 隐藏弹窗
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  // 获取用户手机号
  getPhoneNumber: function (e) {
    if (e.detail.errMsg === "getPhoneNumber:ok") {
      // 获取手机号成功，隐藏弹窗
      this.hideModal();

      wx.login({
        success: res => {
          // 向后台发起请求
          wx.request({
            url: 'YOUR_BACKEND_API',
            method: 'POST',
            data: {
              code: res.code, // 使用wx.login获取的code
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv
            },
            success: res => {
              if (res.data.status === 'success') {
                wx.showToast({
                  title: '手机号绑定成功',
                  icon: 'success'
                });
              } else {
                wx.showToast({
                  title: '绑定失败',
                  icon: 'error'
                });
              }
            },
            fail: () => {
              wx.showToast({
                title: '请求失败',
                icon: 'error'
              });
            }
          });
        }
      });
    } else {
      wx.showToast({
        title: '手机号获取失败',
        icon: 'error'
      });
    }
  }
});
