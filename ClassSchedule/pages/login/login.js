const app = getApp()

Page({
  data: {

  },
  onLoad: function() {
    let that = this;

    wx.hideShareMenu()
    wx.login({
      success: function(res) {
        wx.request({
          //获取openid接口
          url: app.globalData.url + '/WeChatAppAuthorize/GetOpenIdAndSessionKeyString',
          data: {
            code: res.code,
          },
          success: function(res) {
            console.log('我停止了')
            let data = JSON.parse(res.data.Data);

            app.globalData.openID = data.openid,
            app.globalData.session_key = data.session_key

            wx.getSystemInfo({
              success: function (res) {
                
                app.globalData.pxRate = Number((750 / res.windowWidth).toFixed(2))
                app.globalData.windowWidth = res.windowWidth
                app.globalData.windowHeight = res.windowHeight * (750/res.windowWidth)
                app.globalData.screenHeight = res.screenHeight * (750/res.screenWidth)

                if (!!data.openid) {
                  that.accredit()
                }

              }
            });

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
            url: "/pages/curDayClass/curDayClass"//"/pages/calendar/calendar"
          })
        }else{
          wx.redirectTo({
            url: "/pages/home/home"
          })
        }
      }
    })
  },

})