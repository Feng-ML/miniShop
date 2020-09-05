import { getSetting } from '../../request/index.js'
import { showToast } from '../../utils/message.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    paytList: [],
    total: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //查看是否有地址缓存
    if (wx.getStorageSync('address')) {     
      let address = wx.getStorageSync('address');
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      this.setData({
        address
      })
    } 

    this.getCartData()

  },

  // 点击添加收货地址
  handleAddless(){
  
    //获取授权状态
    getSetting().then(result=>{
      // 查看是否授权
      let setAddress = result.authSetting['scope.address']

      // 未授权,打开授权页面
      if (setAddress==false) {
        wx.openSetting({
          success: (result1) => {}
        })
      }
      
      // 已授权或首次点击
      wx.chooseAddress({
        success: (result2) => {
          // 缓存收货地址
          wx.setStorageSync('address', result2);    
        }
      });


    })
  },

  //获取支付数据
  getCartData(){
    let paytList = wx.getStorageSync('toPay');
    let total = this.priceSum(paytList)
    this.setData({
      paytList,
      total
    })   
  },

  // 价格计算
  priceSum(arr){
    let num = 0;
    arr.forEach(v=>{
      num += v.goods_price * v.num
    })
    return num
  },

  //点击支付
  handlePay(){
    if (!this.data.address.userName){
      showToast('请添加收货地址！',"none");
      return
    }

    let cart = wx.getStorageSync('cart') || [];
    let payList = this.data.paytList
    
    //删除购物车对应商品
    for (let i = 0; i < payList.length; i++) {
      let Index = cart.findIndex(v=>v.goods_id == payList[i].goods_id)
      if (Index !== -1) {
        cart.splice(Index,1)
      } 
    }
    
    wx.setStorageSync('cart',cart)
    showToast('支付成功！','success',true)
    setTimeout(() => {
      wx.navigateBack({
        delta: 1
      }); 
    }, 1500);
      
  }
})