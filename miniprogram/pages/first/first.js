// pages/first/first.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeCategory: 'all', // 当前选择的分类
    searchKeyword: '',      // 搜索关键字
    allProjects: [],        // 存储所有项目
    projects: [],           // 存储筛选后的项目

    // 筛选界面相关数据
    filterVisible: false,   // 控制筛选界面的显示与隐藏
    filterOptions: {
      category: '',         // 项目类别
      major: '',            // 专业
      keyword: '',          // 关键词
      experienceRequired: ''// 是否需要相关经验
    },
    categories: ['社会实践', '创新创业', '科研比赛'], // 项目类别选项
    experienceOptions: ['是', '否'],                  // 经验要求选项
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

    const app = getApp();
    console.log("aaa"+app.globalData.userProfile.studentId)
    this.setData({
      allProjects: app.globalData.allProjects,
      projects: app.globalData.allProjects,
    });

    // 实时监听项目集合的变化
    const db = wx.cloud.database();
    const projectsCollection = db.collection('projects');

    projectsCollection.orderBy('createdAt', 'desc').watch({
      onChange: snapshot => {
        console.log('实时数据更新:', snapshot.docs);
        // 重新加载所有项目
        app.loadAllProjects();
        this.setData({
          allProjects: app.globalData.allProjects,
          projects: app.globalData.allProjects,
        });
        this.filterProjects();
      },
      onError: err => {
        console.error('监听项目数据失败：', err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const app = getApp();
    // 更新项目列表
    this.setData({
      allProjects: app.globalData.allProjects,
      projects: app.globalData.allProjects,
    });
    // 如果有筛选条件，需要重新进行筛选
    this.filterProjects();
  },

  /**
   * 点击分类标签
   */
  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category
    });
    this.filterProjects();
  },
  
  /**
   * 点击项目，跳转到详情页
   */
  onProjectTap(e) {
    const projectId = e.currentTarget.dataset.projectId; // 使用 _id
    wx.navigateTo({
      url: `/pages/ProjectDetail/ProjectDetail?id=${projectId}`,
    });
  },
  
  /**
   * 搜索输入事件
   */
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });
    this.filterProjects();
  },

  /**
   * 综合筛选项目
   */
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
    if (filterOptions.category) {
      filteredProjects = filteredProjects.filter(item => item.category === filterOptions.category);
    }

    if (filterOptions.major) {
      filteredProjects = filteredProjects.filter(item => item.major && item.major.includes(filterOptions.major));
    }

    if (filterOptions.keyword) {
      const keywordLower = filterOptions.keyword.toLowerCase();
      filteredProjects = filteredProjects.filter(item =>
        item.name.toLowerCase().includes(keywordLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(keywordLower))
      );
    }

    if (filterOptions.experienceRequired) {
      filteredProjects = filteredProjects.filter(item => item.experienceRequired === filterOptions.experienceRequired);
    }

    // 按创建时间降序排序
    filteredProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    this.setData({
      projects: filteredProjects
    });
  },

  /**
   * 点击筛选按钮，显示或隐藏筛选界面
   */
  onFilterTap() {
    this.setData({
      filterVisible: !this.data.filterVisible
    });
  },

  /**
   * 更新筛选选项
   */
  onFilterChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`filterOptions.${field}`]: e.detail.value
    });
  },

  /**
   * 选择项目类别
   */
  onCategorySelect(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      'filterOptions.category': category
    });
  },

  /**
   * 选择是否需要相关经验
   */
  onExperienceSelect(e) {
    const option = e.currentTarget.dataset.option;
    this.setData({
      'filterOptions.experienceRequired': option
    });
  },

  /**
   * 应用筛选条件
   */
  applyFilter() {
    this.setData({
      filterVisible: false
    });
    this.filterProjects();
  },

  /**
   * 重置筛选条件
   */
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
