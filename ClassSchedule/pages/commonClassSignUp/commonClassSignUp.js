// pages/commonClassSignUp/commonClassSignUp.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    comClassName: '', //公共课程表名称
    comClassUserName: '', //公共课程表用户名
    passWord: '', //公共课程表密码
  },
  onLoad: function(options) {
    debugger
    let that = this,
      publicCourseTypeID = options.publicCourseTypeID,
      id = options.id

    wx.hideShareMenu()

    that.setData({
      publicCourseTypeID: publicCourseTypeID
    })

    if (!!id) {
      that.setInitData(id)
    }
  },

  //录入课程表名称
  setClassNameInput: function(e) {
    this.setData({
      comClassName: e.detail.value
    })
  },
  //录入用户名
  setClassUserNameInput: function(e) {
    this.setData({
      comClassUserName: e.detail.value
    })
  },
  //录入密码
  setPassWord: function(e) {
    this.setData({
      passWord: e.detail.value
    })
  },

  //取消
  cancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //删除
  del: function () {
    let id = this.data.id,
      that = this;

    if (!id) return

    wx.request({
      url: that.data.url + '/PublicCourseInfo/Delete', //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  //保存
  signUp: function(e) {
    debugger
    let that = this,
      data = this.data,
      query = {
        ID: data.id,
        Name: data.comClassName,
        LoginName: data.comClassUserName,
        Password: data.passWord,
        PublicCourseTypeID: data.publicCourseTypeID,
        OpenID: app.globalData.openID
      }

    if (!query.Name) {
      wx.showToast({
        title: '请填写课程表名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    } else if (!query.LoginName) {
      wx.showToast({
        title: '请填写用户名',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    } else if (!query.Password) {
      wx.showToast({
        title: '请填写密码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (!!data.id) {
      wx.request({
        url: that.data.url + '/PublicCourseInfo/Update',
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          if (res.data.Result == '800') {
            wx.showToast({
              title: '当前用户名重复，请重新输入',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            return
          }

          wx.navigateBack({
            url: '../commonClassLogin/commonClassLogin?publicCourseTypeID=' + data.publicCourseTypeID
          })

        }
      })
    } else {
      wx.request({
        url: that.data.url + '/PublicCourseInfo/Add',
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          if (res.data.Result == '800') {
            wx.showToast({
              title: '当前用户名重复，请重新输入',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            return
          }

          wx.navigateBack({
            url: '../commonClassLogin/commonClassLogin?publicCourseTypeID=' + data.publicCourseTypeID
          })
        }
      })
    }
  },

  //初始化数据
  setInitData: function(id) {
    debugger
    let that = this;

    wx.request({
      url: app.globalData.url + '/PublicCourseInfo/GetPublicCourseInfoByID', //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        debugger

        let data = res.data.Data

        that.setData({
          comClassName: data.Name, //公共课程表名称
          comClassUserName: data.LoginName, //公共课程表用户名
          passWord: data.Password, //公共课程表密码
          publicCourseTypeID: data.PublicCourseTypeID, //公共课程表类型Id
          id: data.ID //当前公共课程表的id
        })
      }
    })
  }

})