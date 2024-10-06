Page({
  data: {
    searchQuery: ''
  },

  onSearchInput(e) {
    this.setData({
      searchQuery: e.detail.value
    });
    console.log('搜索内容:', this.data.searchQuery);
    // 在这里添加你的搜索逻辑
  }
});
