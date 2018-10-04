// pages/importLogin/importLogin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',

    comClassUserName: '', //公共课程表用户名
    passWord: '', //公共课程表密码
  },
  onLoad: function (options) {
    let that = this,
      childrenID = options.childrenID

    that.setData({
      childrenID: childrenID
    })

    wx.hideShareMenu()
  },

  onShow(options) { //返回显示页面状态函数

  },

  //录入用户名
  setClassUserNameInput: function (e) {
    this.setData({
      comClassUserName: e.detail.value
    })
  },
  //录入密码
  setPassWord: function (e) {
    this.setData({
      passWord: e.detail.value
    })
  },

  //登陆
  login: function (e) {
    let that = this,
      data = this.data,
      query = {
        loginName: data.comClassUserName,
        password: data.passWord
      }

    if (!query.loginName) {
      wx.showToast({
        title: '请填写用户名',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    } else if (!query.password) {
      wx.showToast({
        title: '请填写密码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    wx.request({
      url: that.data.url + '/PublicCourseInfo/GetPublicCourseInfoByLoginNameAndPassword', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let obj = res.data.Data

        console.log(obj)

        if (!obj){
          wx.showToast({
            title: '用户名或密码错误，请检查',
            icon: 'none',
            duration: 1500,
            mask: true
          })
          return
        }

        wx.navigateTo({
          url: '../importClass/importClass?id=' + obj.ID + '&comonClassTitle=' + obj.Name + '&publicCourseTypeID=' + obj.PublicCourseTypeID + '&childrenID=' + data.childrenID
        })
      }
    })
  },

})