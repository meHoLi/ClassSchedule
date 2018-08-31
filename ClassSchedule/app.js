
App({
  onLaunch: function() {
    
  },

  // 调用语音权限询问
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        console.log("succ")
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("succ auth")
            }, fail() {
              console.log("fail auth")
            }
          })
        } else {
          console.log("record has been authed")
        }
      }, fail(res) {
        console.log("fail")
        console.log(res)
      }
    })
  },

  globalData: {
    userInfo: null,
    url: 'https://www.xiaoshangbang.com'//'http://192.168.0.4:61242'//'http://192.168.0.4:61242'//'http://172.16.46.90:61242'//'https://pay.houjiale.com'//
  }
})