// pages/setAgenda/setAgenda.js
var util = require('../../utils/util.js');
var myDate = new Date();//获取系统当前时间
var currentDate = myDate.toLocaleDateString(); //获取当前日期

Page({

  /**
   * 页面的初始数据
   */
  data: {
    className: '',
    schoolName: '',

    startTime: '07:00',
    endTime: '08:00',

    address: '',
    teacher: '',
    phone: '',

    date: currentDate,

    remind: ['无', '准时', '提前十分钟', '提前半小时', '提前两小时', '提前一天'],
    remindList: [
      { id: 0, name: '无' },
      { id: 1, name: '准时' },
      { id: 2, name: '提前十分钟' },
      { id: 3, name: '提前半小时' },
      { id: 4, name: '提前两小时' },
      { id: 5, name: '提前一天' }
    ],
    remindValue: 0
  },
  onLoad: function () {
    
  },

  //录入课程
  setClassNameInput: function (e) {
    this.setData({
      className: e.detail.value
    })
  },
  //录入学校
  setSchoolNameInput: function (e) {
    this.setData({
      schoolName: e.detail.value
    })
  },
  //点击开始时间组件确定事件  
  bindStartTimeChange: function (e) {
    let startTime = e.detail.value,
      strtHour = Number(startTime.split(':')[0]) + 1,
      endTime = strtHour < 10 ? '0' + strtHour + ':00' : strtHour + ':00'

    this.setData({
      startTime: e.detail.value,
      endTime: endTime
    })
  },
  //点击结束时间组件确定事件  
  bindEndTimeChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  //录入地址
  setAddressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  //录入老师
  setTeacherInput: function (e) {
    this.setData({
      teacher: e.detail.value
    })
  },
  //录入联系方式
  setTelPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //选择生日
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //选择性别
  bindPickerChange: function (e) {
    this.setData({
      remindValue: e.detail.value
    })
  },
  
  //取消
  cancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //关闭
  save: function () {
    console.log('保存')
  }

})