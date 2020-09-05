import { request } from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
    leftList:[],
    rightList:[],
    currentIndex: 0,
    scrollTop: 0
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getData()
  },
  
  // 获取分类数据
  getData(){
    request({url:"/categories"})
    .then(result=>{   

      this.setData({
        categoryList: result.data.message
      })
      let leftList = this.data.categoryList.map(v=>v.cat_name)
      let rightList = this.data.categoryList[0].children

      this.setData({
        leftList,
        rightList
      })

      // 设置缓存和时间戳
      wx.setStorageSync("cates", {time:Date.now(),data: this.data.categoryList});
    })
    
  },

  // 左侧菜单点击事件
  handleItemTap(e){
    // 获取索引
    let currentIndex = e.currentTarget.dataset.index

    // 设置索引，滚轮置顶
    this.setData({
      currentIndex,
      scrollTop: 0
    })

    // 右侧渲染
    let rightList = this.data.categoryList[currentIndex].children
    this.setData({
      rightList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})