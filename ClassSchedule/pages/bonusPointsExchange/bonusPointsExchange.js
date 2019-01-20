// pages/bonusPointsExchange/bonusPointsExchange.js
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
    exchangeName: '',//兑换项目名
    bonusPointsValue: '',//兑换积分数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    debugger
    let that = this;
    // 获取完整的年月日 时分秒，以及默认显示的数组

    that.setData({
      childrenID: options.childrenID,
      totalNumber: options.totalNumber
    })
  },

  //录入兑换项目名
  setExchangeNameInput: function (e) {
    this.setData({
      exchangeName: e.detail.value
    })
  },
  //录入兑换积分数
  setBonusPointsInput: function (e) {
    let totalNumber = Number(this.data.totalNumber),
      value = e.detail.value;

    if (e.detail.value > totalNumber){
      wx.showToast({
        title: '兑换积分数不能大于总积分',
        icon: 'none',
        duration: 2000,
        mask: true
      })

      value = ''
    }
    this.setData({
      bonusPointsValue: value
    })
  },

  save: function(){
    let that = this,
      data = that.data;

    if (!data.exchangeName) {
      wx.showToast({
        title: '请填写兑换项目',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    if (!data.bonusPointsValue || Number(data.bonusPointsValue)<=0) {
      wx.showToast({
        title: '兑换数额需大于0',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return
    }

    wx.request({
      url: app.globalData.url + '/IntegralRecord/ConsumIntegralReclrd', //仅为示例，并非真实的接口地址
      data: {
        ChildrenID: data.childrenID,
        CalcType: 3,
        Number: data.bonusPointsValue,
        Name: data.exchangeName
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger
        if (!!res.data.Status) {
          wx.showToast({
            title: '兑换成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })

          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },1000)
        } else {
          wx.showToast({
            title: '兑换失败，请稍后再试',
            icon: 'none',
            duration: 1500,
            mask: true
          })
        }
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