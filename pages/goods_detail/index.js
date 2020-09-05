const { request } = require("../../request/index.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    isCollect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.getGoodsDetail(options.goods_id)
  
  },
  onShow: function (options){
  },

  //判断是否收藏
  isCollect(){
     let collect = wx.getStorageSync('collect') || [];
     let goodsDetail = this.data.goodsDetail;
     let Index = collect.findIndex(v =>v.goods_id===goodsDetail.goods_id);
 
     if (Index >= 0) {
       this.setData({
         isCollect: true
       })
     }
  },

  //获取商品详情数据
  getGoodsDetail(goods_id){
    request({url:"/goods/detail",data:{goods_id}})
      .then(result=>{
        
        let data = result.data.message;
        this.setData({
          goodsDetail: {
            goods_id: data.goods_id,
            pics: data.pics,
            goods_price: data.goods_price,
            goods_name: data.goods_name,
            goods_introduce: data.goods_introduce
          }
        })

        this.isCollect()
      })
  },

  //轮播图放大预览
  handleSwiper(e){
    let urls = this.data.goodsDetail.pics.map(v=>v.pics_big)
    let current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    });
      
  },

  //添加购物车
  handleAddCart(){
    let cart = wx.getStorageSync("cart") || [];
    let {goodsDetail} = this.data

    let Index = cart.findIndex(v=>v.goods_id === goodsDetail.goods_id)
    if (Index == -1) {    //购物车不存在该商品
      goodsDetail.num = 1;
      goodsDetail.goods_introduce = '';
      //购物车是否选中
      goodsDetail.check = false;
      cart.push(goodsDetail)
    } else {      //购物车存在该商品
      cart[Index].num++
    }  

    wx.setStorageSync("cart", cart);
      
    wx.showToast({
      title: '添加成功',
      mask: true
    });
      
  },

  //立即购买
  handlePay(){
    let goodsDetail = this.data.goodsDetail;
    let payList = [];
    goodsDetail.num = 1;
    goodsDetail.goods_introduce = '';
    payList.push(goodsDetail)
    wx.setStorageSync('toPay', payList);

    wx.navigateTo({
      url: '../pay/index',
      success: (result) => { }
    });
      
  },

  //点击收藏
  handleCollect(){
    let goodsDetail = this.data.goodsDetail;
    let collect = wx.getStorageSync('collect') || [];

    if (this.data.isCollect) {
      //已收藏
      let Index = collect.findIndex(v => v.goods_id == goodsDetail.goods_id);
      collect.splice(Index,1);
      wx.setStorageSync('collect', collect); 
      this.setData({
        isCollect: false
      })

    } else {
      //未收藏
      collect.push(goodsDetail)
      wx.setStorageSync('collect', collect); 
      this.setData({
        isCollect: true
      })
    }
  }
})