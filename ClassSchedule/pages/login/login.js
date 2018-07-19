const app = getApp()

Page({
  data: {

  },
  onLoad: function() {

  },
  accredit: function() {
    wx.request({
      url: 'http://192.168.0.3:61242/Children/Index', //仅为示例，并非真实的接口地址
      data: {
        openID: '111111'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        debugger
        if (!!res.data.Data[0]) {
          wx.switchTab({ //跳转到tabBar页面，并关闭其他所有tabBar页面
            url: "/pages/calendar/calendar"
          })
        }else{
          wx.redirectTo({
            url: "/pages/home/home"
          })
        }
      }
    })
  }
})