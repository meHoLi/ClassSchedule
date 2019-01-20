// pages/bonusPointsList/bonusPointsList.js
var app = getApp()
//使用小程序的日期控件
var util = require('../../utils/util.js')
//日期时间选择器
var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    isExchange: false,//开关
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    debugger
    let that = this;
    // 获取完整的年月日 时分秒，以及默认显示的数组

    that.setData({
      childrenID: options.childrenID
    })

    this.setBonusPointsList(options.childrenID)
  },

  setBonusPointsList: function (childrenID){
    let that = this;

    wx.request({
      url: app.globalData.url + '/IntegralRecord/Index', //仅为示例，并非真实的接口地址
      data: {
        childrenID: childrenID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {debugger
        let value = res.data.Data

        that.setData({
          list: value.list,
          totalNumber: value.totalNumber
        })

      }
    })
  },

  //切换开关
  switchChange: function (e) {
    let value = e.detail.value,
      childrenID = this.data.childrenID,
      totalNumber = !!this.data.totalNumber ? this.data.totalNumber : 0;

    if (!!value && totalNumber <= 0){
      wx.showToast({
        title: '您当前没有可用积分',
        icon: 'none',
        duration: 1500,
        mask: true
      })

      this.setData({
        isExchange: false
      })
      return
    }

    this.setData({
      isExchange: !!value ? true : false
    })

    if (!!value) {
      wx.navigateTo({
        url: '../bonusPointsExchange/bonusPointsExchange?childrenID=' + childrenID + '&totalNumber=' + totalNumber
      })
    }
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
    if (this.data.childrenID){
      this.setBonusPointsList(this.data.childrenID)
    }
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