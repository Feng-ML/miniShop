const { request } = require("../../request/index.js");

// pages/goods_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodList: []
  },

  // 请求参数
  getParams:{
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPage: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面参数
    this.getParams.cid = options.cid

    this.getData();
  },

  // tabs点击跳转
  activeIndex(e){
    let tabs = this.data.tabs;
    let activeIndex = e.detail
    if (this.data.tabs[activeIndex].isActive)return
    for (let i = 0; i < tabs.length; i++) {
      if (i == activeIndex) {
        tabs[i].isActive = true
      } else {
        tabs[i].isActive = false
      }
    }

    this.setData({
      tabs
    })

    this.tabChange()
  },

  // 获取数据
  getData(){
    request({url:"/goods/search",data: this.getParams})
    .then(result=>{
      // 设置最大页数
      this.totalPage = Math.ceil(result.data.message.total / this.getParams.pagesize)

      this.setData({
        goodList: result.data.message.goods
      })

      //关闭页面刷新
      wx.stopPullDownRefresh()

      //判断所在页面
      if (this.data.tabs[1].isActive) {     //销量页面
        this.setData({
          goodList: this.data.goodList.sort((a,b)=>{ 
            return a["upd_time"] - b["upd_time"]
          })
        })
      } else if (this.data.tabs[2].isActive) {    //价格页面
        this.setData({
          goodList: this.data.goodList.sort((a,b)=>{ 
            return a["goods_price"] - b["goods_price"]
          })
        })
      } else {      //综合页面
        return
      }
    })
  },

  // 触底函数
  onReachBottom(){
    // 判断页码是否大于最大页数
    if (this.getParams.pagenum>=this.totalPage) {
      wx.showToast({title: '已经没有了哦！'});
      
    } else {
      // 页数+1
      this.getParams.pagenum++

      // 请求下一页数据
      request({url:"/goods/search",data: this.getParams})
      .then(result=>{
        
        // 将下一页数据添加进去
        this.setData({
          goodList: [...this.data.goodList,...result.data.message.goods]
        })
      })
    }
    
  },

  // 点击tab页面变化
  tabChange(){
    if (this.data.tabs[1].isActive) {     //点击销量
      this.setData({
        goodList: this.data.goodList.sort((a,b)=>{ 
          return a["upd_time"] - b["upd_time"]
        })
      })
    } else if (this.data.tabs[2].isActive) {    //点击价格
      this.setData({
        goodList: this.data.goodList.sort((a,b)=>{ 
          return a["goods_price"] - b["goods_price"]
        })
      })
    } else {    //点击综合
      // 清除数据
      this.setData({
        goodList: []
      })
      this.getParams.pagenum = 1;
      this.getData()
    }
  },


  // 下拉刷新时执行
  onPullDownRefresh: function(){
    // 清除数据
    this.setData({
      goodList: []
    })
    this.getParams.pagenum = 1;

    this.getData()
  }

})