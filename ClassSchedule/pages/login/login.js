const app = getApp()

Page({
  data: {

  },
  onLoad: function () {
    
  },
  accredit: function(){
    wx.switchTab({    //跳转到tabBar页面，并关闭其他所有tabBar页面
      url: "/pages/calendar/calendar"
    })
  }
})
