const app = getApp()

Page({
  data: {

  },
  onLoad: function() {
    let that = this;

    wx.login({
      success: function (res) {
        debugger
        wx.request({
          //获取openid接口
          url: app.globalData.url + '/WeChatAppAuthorize/GetOpenIdAndSessionKeyString',
          data: {
            code: res.code,
          },
          success: function (res) {
            debugger
            let data = JSON.parse(res.data.Data);

            app.globalData.openID = data.openid,
            app.globalData.session_key = data.session_key

            if (!!data.openid){
              that.accredit()
            }
          }
        })
      }
    })
  },
  accredit: function() {
    wx.request({
      url: app.globalData.url + '/Children/Index', //仅为示例，并非真实的接口地址
      data: {
        openID: app.globalData.openID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
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
  },
  // onShareAppMessage: function () {
  //   return {
  //     title: '微信小程序联盟',
  //     desc: '最具人气的小程序开发联盟!',
  //     path: '/page/login/login',
  //   }
  // },

})