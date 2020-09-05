
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    collectNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let collectNum = wx.getStorageSync("collect").length;
    this.setData({
      collectNum
    })  
    
  },

  //点击登录
  handleLogin(e){
    let userInfo = e.detail.userInfo
    
    wx.setStorageSync('userInfo', userInfo);  
    this.onLoad() 
  }

})