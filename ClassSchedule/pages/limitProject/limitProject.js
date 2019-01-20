// pages/limitProject/limitProject.js
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
    clockName: '',//习惯名称
    limitTime: 25,//限时时间默认25
    isJoin: false,//开关
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
  },
  
  //输入打卡名称
  setClockNameInput: function (e) {
    this.setData({
      clockName: e.detail.value
    })
  },

  //切换开关
  switchChange: function (e) {debugger
    let value = e.detail.value,
      childrenID = this.data.childrenID,
      clockName = this.data.clockName,
      limitTime = this.data.limitTime;

    this.setData({
      isJoin: !!value ? true : false
    })

    if(!!value){
      wx.navigateTo({
        url: '../setClock/setClock?childrenID=' + childrenID + '&clockName=' + clockName + '&isLimitTime=' + true + '&limitTime=' + limitTime + '&isFrom=' + 'limitTime'
      })
    }
  },

  //输入限时分钟时长
  setLimitTimeNum: function (e) {
    this.setData({
      limitTime: e.detail.value
    })
  },
  //减
  minus: function () {
    let num = this.data.limitTime

    num = num - 1
    num = num <= 0 ? 1 : num

    this.setData({
      limitTime: num
    })
  },
  //加
  plus: function () {
    let num = this.data.limitTime

    num = num + 1

    this.setData({
      limitTime: num
    })
  },

  //取消
  cancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  //保存
  save: function () {
    let that = this,
      data = that.data,
      query = {
        ChildrenID: data.childrenID,
        Name: data.clockName,
        ExecuteNum: 1,//打卡次数
        ExecutedNum: 0,//已经打卡次数
        IsLimit: true,//是否限时
        LimitedTime: data.limitTime,//限时分钟数
        RemindTime: -9999,//提醒
        IsComplated: 0//是否完成
      }

    wx.request({
      url: that.data.url + '/Clock/AddTomato', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger
        if (!!res.data.Status) {
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })

          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 1000,
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