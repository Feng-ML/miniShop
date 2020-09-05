//发起请求次数
let ajaxNum = 0;
//数据请求
export const request = (params)=>{
    ajaxNum++;
    
    // 开启加载提示
    wx.showLoading({
        title: "加载中",
        mask: true
    })
      
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
        
        wx.request({
            ...params,
            url: baseUrl + params.url,
            success: (result)=>{
                resolve(result)
            },
            fail: err=> reject(err),

            complete: ()=>{
                ajaxNum--;
                //请求完成 关闭加载提示
                if (ajaxNum==0)wx.hideLoading();
                
            }
        });
    })
}


export const getSetting = ()=>{
    return new Promise((reslove,reject)=>{
        wx.getSetting({
            success: (result) => {
                reslove(result)
            },
            fail: (err) => {reject(err)}
        });
          
    })
}
