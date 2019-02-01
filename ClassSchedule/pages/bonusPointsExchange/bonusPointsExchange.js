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
    let that = this,
      itemWidth = (app.globalData.windowWidth * app.globalData.pxRate - 40 - 20 - 40) / 2 - 16;
    // 获取完整的年月日 时分秒，以及默认显示的数组

    wx.request({
      url: app.globalData.url + '/ExchangeProject/Index', //仅为示例，并非真实的接口地址
      data: {
        childrenID: options.childrenID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let value = res.data.Data;

        that.setData({
          itemWidth: itemWidth,
          childrenID: options.childrenID,
          totalNumber: options.totalNumber,
          exchangeList: value
        })
      }
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
        title: '兑换积分超过剩余积分',
        icon: 'none',
        duration: 1500,
        mask: true
      })

      value = ''
    }
    this.setData({
      bonusPointsValue: value
    })
  },

  //单击兑换项名称
  pressTap: function (e) {
    let item = e.currentTarget.dataset.item;

    this.setData({
      exchangeName: item.Name,
      bonusPointsValue: item.Value
    })
  },
  //长按修改兑换项名称
  handleLongPress: function (e) {
    let item = e.currentTarget.dataset.item

    wx.navigateTo({
      url: '../updateExchangeItem/updateExchangeItem?id=' + item.ID + '&childrenID=' + this.data.childrenID,
    })
  },
  //点击添加兑换项
  addExchange: function(){
    wx.navigateTo({
      url: '../updateExchangeItem/updateExchangeItem?childrenID=' + this.data.childrenID,
    })
  },
  
  cancel: function(){
    wx.navigateBack({
      delta: 1
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
          if (res.data.Result == '800'){
            wx.showToast({
              title: res.data.Msg,
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }else{
            wx.showToast({
              title: '兑换失败，请稍后再试',
              icon: 'none',
              duration: 1500,
              mask: true
            })
          }
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
    if(!!this.data.childrenID){
      this.onLoad({ childrenID: this.data.childrenID, totalNumber: this.data.totalNumber})
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