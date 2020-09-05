import { getSetting } from '../../request/index.js'
import { showToast } from '../../utils/message.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cartList: [],
    isCheckboxAll: false,
    total: 0,
    toPay: []
  },
  payList: [],
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
    // 获取购物车数据
    this.getCartData()
    this.setData({
      isCheckboxAll: false,
      total: 0
    })
    this.payList = []
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

  //获取购物车列表
  getCartData(){
    let cartList = wx.getStorageSync('cart');
    this.setData({
      cartList
    })   
  },

  // 点击增加按钮
  handleAdd(e){
    let Index = e.currentTarget.dataset.index;
    let cartList = this.data.cartList
    cartList[Index].num++
    this.setData({
      cartList
    })
    // 价格计算
    let total = this.priceSum(this.payList)
    this.setData({
      total
    })
  },
  // 点击减少按钮
  handleMinus(e){
    let Index = e.currentTarget.dataset.index;
    let cartList = this.data.cartList
    cartList[Index].num--

    //商品数量少于1，提示是否删除
    if (cartList[Index].num<1){
      wx.showModal({
        title: '是否删除商品？',
        success: (result) => {
          if (result.confirm) {   //确定
            cartList.splice(Index,1);
            this.setData({
              cartList
            })
            wx.setStorageSync("cart", cartList);
          }else{    //取消
            cartList[Index].num = 1;
            this.setData({
              cartList
            })
          }
        }
      });    
    }

    
    // 价格计算
    let total = this.priceSum(this.payList)
    this.setData({
      total,
      cartList
    })
  },
  //商品复选框点击
  checkboxChange(e){
    // 初始付款列表
    this.payList = []; 
    //选中商品下标集合
    let checkIndex = e.detail.value;
    let {cartList} = this.data;

    cartList.forEach(v=>v.check = false)
    //遍历选中商品
    for (let i = 0; i < checkIndex.length; i++) {
      cartList[checkIndex[i]].check = true;
      this.payList.push(cartList[checkIndex[i]])  
    }
    // 价格计算
    let total = this.priceSum(this.payList)
    this.setData({
      cartList,
      total
    })

    if (checkIndex.length == cartList.length){
      this.setData({
        isCheckboxAll: true
      })
    }else{
      this.setData({
        isCheckboxAll: false
      })
    }
  },
  // 全选点击
  checkboxAll(){
    let {isCheckboxAll,cartList} = this.data;
    
    if (isCheckboxAll) {  // 取消全选
      cartList.forEach(element => {
        element.check = false
      });
      this.setData({
        cartList,
        isCheckboxAll: false
      })
      //初始化付款列表
      this.payList = []
      this.setData({
        total: 0
      })
    }else{    //全选
      cartList.forEach(element => {
        element.check = true
      });
      this.setData({
        cartList,
        isCheckboxAll: true
      })

      // 全选价格计算
      this.payList = cartList;
      let total = this.priceSum(cartList)
      this.setData({
        total
      })
    }
  },
  // 价格计算
  priceSum(arr){
    let num = 0;
    arr.forEach(v=>{
      num += v.goods_price * v.num
    })
    return num
  },
  //跳转支付
  toPay(){
    if (!this.data.address.userName) {
      showToast("请添加收货地址！",'none')
    } else if(this.payList.length ==0){
      showToast("请选择要购买的商品！",'none')
    }else{
      wx.setStorageSync("toPay", this.payList); 
      wx.navigateTo({
        url: '../pay/index'
      });
        
    }
    
  }
})