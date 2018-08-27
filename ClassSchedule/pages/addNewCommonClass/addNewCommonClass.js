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
  onLoad: function(options) {
    let that = this;

    wx.hideShareMenu()

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
        id: that.data.ID
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

    if (!!data.ID) {
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