const app = getApp()

Page({
  data: {
    isShowLoading: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')//判断小程序的API，回调，参数，组件等是否在当前版本可用。
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
                  that.isAccredit()
                }

              }
            });

          }
        })
      }
    })
  },

  //判断用户是否授权
  isAccredit: function(){
    let that = this;

    wx.getSetting({
      success: function (res) {
        let arr = Object.keys(res.authSetting);

        if (arr.length == 0 || !res.authSetting['scope.userInfo']){//未授权过
          that.setData({
            isShowLoading: false
          })

          return
        }

        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {//用户已经授权过
              app.globalData.userInfo = res.userInfo
              that.accredit()
            }
          })
        }
      }
    })
  },

  //点击授权登陆
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {//用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo
      that.accredit()
    } else {//用户按了拒绝按钮
      
    }
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