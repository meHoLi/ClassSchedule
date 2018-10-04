// pages/addNewCommonClass/addNewCommonClass.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    comClassName: '', //公共课程表类型名称
  },
  onLoad: function(options) {debugger
    let that = this

    wx.hideShareMenu()

    if(!!options.id){
      this.tempData(options.id);
    }
  },

  //设置数据
  tempData: function (id) {
    let that = this;

    wx.request({
      url: app.globalData.url + '/PublicCourseType/GetPublicCourseTypeByID',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {debugger
        let list = res.data.Data

        that.setData({
          comClassName: list.Name,
          id: id
        })
      }
    })
  },

  //录入课程表类型名称
  setClassNameInput: function(e) {
    this.setData({
      comClassName: e.detail.value
    })
  },

  //取消
  cancel: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  //删除
  del: function(e) {
    let that = this;

    wx.request({
      url: app.globalData.url + '/PublicCourseType/Delete', //仅为示例，并非真实的接口地址
      data: {
        id: that.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  //保存
  save: function() {
    let that = this,
      data = this.data,
      query = {
        ID:data.id,
        OpenID: app.globalData.openID,
        Name: data.comClassName
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
        url: app.globalData.url + '/PublicCourseType/Update',
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      wx.request({
        url: app.globalData.url + '/PublicCourseType/Add', //仅为示例，并非真实的接口地址
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  }

})