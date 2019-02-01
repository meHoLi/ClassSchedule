// pages/growthDiaryTemp/growthDiaryTemp.js
const app = getApp()
let util = require('../../utils/util.js');
let myDate = new Date(); //获取系统当前时间
let currentDate = myDate.toLocaleDateString(); //获取当前日期

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: currentDate
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {debugger
    wx.hideShareMenu()
    let obj = {}

    if (!!options.showData && options.showData !== 'null' && options.showData !== 'undefined'){
      obj.showData = JSON.parse(options.showData)
    }

    if (!!options.query){
       obj.query = JSON.parse(options.query)
    }

    this.setData(obj)
  },

  //修改
  update: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  //保存
  save: function () {
    let that = this,
      query = that.data.query,
      url = '';

    if (!!query.ID){
      url = '/GrowthDiary/Update'
    }else{
      url = '/GrowthDiary/Add'
    }
    wx.request({
      url: app.globalData.url + url, //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let value = res.data.Data;

        if (!res.data.Status) {
          wx.showToast({
            title: '发布失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          return
        }

        wx.showToast({
          title: '发布成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })

        setTimeout(() => {
          let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
          let prevPage = pages[pages.length - 2];

          prevPage.setData({
            isEmptyDiary: true
          })

          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})