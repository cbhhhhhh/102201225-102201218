// pages/first/first.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeCategory: 'all', // 当前选择的分类
    searchKeyword: '', // 搜索关键字
    allProjects: [], // 用于存储所有项目
    projects: [], // 用于存储筛选后的项目

    // 筛选界面相关数据
    filterVisible: false, // 控制筛选界面的显示与隐藏
    filterOptions: {
      category: '', // 项目类别
      major: '', // 专业（如果项目包含此字段）
      keyword: '', // 关键词
      experienceRequired: '' // 是否需要相关经验（如果项目包含此字段）
    },
    categories: ['社会实践', '创新创业', '科研比赛'], // 项目类别选项
    experienceOptions: ['是', '否'], // 经验要求选项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取应用实例
    const app = getApp();
    // 初始化项目列表
    this.setData({
      allProjects: app.globalData.allProjects,
      projects: app.globalData.allProjects,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 当页面显示时，更新项目列表
    const app = getApp();
    this.setData({
      allProjects: app.globalData.allProjects,
      projects: app.globalData.allProjects,
    });
    // 如果有筛选条件，需要重新进行筛选
    this.filterProjects();
  },

  // 点击分类
  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category
    });
    // 根据选择的类别和搜索关键字筛选项目
    this.filterProjects();
  },
  
  // 点击项目，跳转到详情页
  onProjectTap(e) {
    const projectId = e.currentTarget.dataset.projectId; // 确保传递的是 _id
    wx.navigateTo({
      url: `/pages/ProjectDetail/ProjectDetail?id=${projectId}`,
    });
  },
  
  // 搜索输入事件
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });
    // 根据搜索关键字和其他筛选条件筛选项目
    this.filterProjects();
  },

  // 综合筛选项目
  filterProjects() {
    const { allProjects, activeCategory, searchKeyword, filterOptions } = this.data;
    let filteredProjects = allProjects;

    // 按分类筛选
    if (activeCategory !== 'all') {
      filteredProjects = filteredProjects.filter(item => item.category === activeCategory);
    }

    // 按搜索关键字筛选（标题和标签）
    if (searchKeyword) {
      const keywordLower = searchKeyword.toLowerCase();
      filteredProjects = filteredProjects.filter(item =>
        item.name.toLowerCase().includes(keywordLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(keywordLower))
      );
    }

    // 应用筛选界面的筛选条件
    // 筛选项目类别
    if (filterOptions.category) {
      filteredProjects = filteredProjects.filter(item => item.category === filterOptions.category);
    }

    // 筛选专业（如果项目包含此字段）
    if (filterOptions.major) {
      filteredProjects = filteredProjects.filter(item => item.major && item.major.includes(filterOptions.major));
    }

    // 筛选关键词
    if (filterOptions.keyword) {
      const keywordLower = filterOptions.keyword.toLowerCase();
      filteredProjects = filteredProjects.filter(item =>
        item.name.toLowerCase().includes(keywordLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(keywordLower))
      );
    }

    // 筛选是否需要相关经验（如果项目包含此字段）
    if (filterOptions.experienceRequired) {
      filteredProjects = filteredProjects.filter(item => item.experienceRequired === filterOptions.experienceRequired);
    }

    // 更新项目列表前，对项目按照创建时间降序排序
    filteredProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 更新项目列表
    this.setData({
      projects: filteredProjects
    });
  },

  // 点击筛选按钮，显示或隐藏筛选界面
  onFilterTap() {
    this.setData({
      filterVisible: !this.data.filterVisible
    });
  },

  // 更新筛选选项
  onFilterChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`filterOptions.${field}`]: e.detail.value
    });
  },

  // 选择项目类别
  onCategorySelect(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      'filterOptions.category': category
    });
  },

  // 选择是否需要相关经验
  onExperienceSelect(e) {
    const option = e.currentTarget.dataset.option;
    this.setData({
      'filterOptions.experienceRequired': option
    });
  },

  // 应用筛选条件
  applyFilter() {
    // 关闭筛选界面并重新筛选项目
    this.setData({
      filterVisible: false
    });
    this.filterProjects();
  },

  // 重置筛选条件
  resetFilter() {
    this.setData({
      filterOptions: {
        category: '',
        major: '',
        keyword: '',
        experienceRequired: ''
      }
    });
    this.filterProjects();
  }

});
