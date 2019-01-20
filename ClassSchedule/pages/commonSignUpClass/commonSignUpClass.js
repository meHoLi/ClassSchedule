// pages/commonSignUpClass/commonSignUpClass.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    comClassName: ''//公共课程表名称
  },
  onLoad: function (options) {
    let that = this,
      publicBoxType = options.publicBoxType || this.data.publicBoxType,
      publicBoxID = options.publicBoxID || this.data.publicBoxID,
      id = options.id

    wx.hideShareMenu()

    that.setData({
      publicBoxType: publicBoxType,
      publicBoxID: publicBoxID
    })

    if (!!id) {
      that.setInitData(id)
    }
  },

  //录入课程表名称
  setClassNameInput: function (e) {
    this.setData({
      comClassName: e.detail.value
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
  signUp: function (e) {
    let that = this,
      data = this.data,
      repeatPassWord = data.repeatPassWord,
      query = {
        Name: data.comClassName,
        PublicBoxID: data.publicBoxID,
        OpenID: app.globalData.openID,
        DefaultType: 2
      }

    if (!!data.id){
      query.ID = data.id
    }

    if (!query.Name) {
      wx.showToast({
        title: '请填写课程表名称',
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
        success: function (res) {
          if (!res.data.Status) {
            wx.showToast({
              title: '保存失败，请稍后再试',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            return
          }

          wx.navigateBack({
            url: '../sharedSpace/sharedSpace'
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
        success: function (res) {
          if (!res.data.Status) {
            wx.showToast({
              title: '保存失败，请稍后再试',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            return
          }

          wx.navigateBack({
            url: '../sharedSpace/sharedSpace'
          })
        }
      })
    }
  },

  //初始化数据
  setInitData: function (id) {
    let that = this;

    wx.request({
      url: app.globalData.url + '/PublicCourseInfo/GetPublicCourseInfoByID', //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let data = res.data.Data

        that.setData({
          comClassName: data.Name, //公共课程表名称
          id: data.ID //当前公共课程表的id
        })
      }
    })
  }

})