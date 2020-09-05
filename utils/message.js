export const showToast = (str,icon='success',mask=false)=>{
    wx.showToast({
        title: str,
        mask,
        icon,
        success: (result) => {
            
        }
    });
}