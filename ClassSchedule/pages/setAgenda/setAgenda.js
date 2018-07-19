// pages/setAgenda/setAgenda.js
var util = require('../../utils/util.js');
var myDate = new Date(); //获取系统当前时间
var currentDate = myDate.toLocaleDateString(); //获取当前日期

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',currentDate,

    className: '', //课程名称
    schoolName: '', //学校名称

    startTime: '07:00', //开始时间
    endTime: '08:00', //结束时间

    address: '', //地址
    teacher: '', //老师姓名
    phone: '', //联系方式

    //提醒时间
    remind: ['无', '准时', '提前十分钟', '提前半小时', '提前两小时', '提前一天'],
    remindList: [{
        id: 0,
        name: '无',
        time: '-9999'
      },
      {
        id: 1,
        name: '准时',
        time: '0'
      },
      {
        id: 2,
        name: '提前十分钟',
        time: '10'
      },
      {
        id: 3,
        name: '提前半小时',
        time: '30'
      },
      {
        id: 4,
        name: '提前两小时',
        time: '120'
      },
      {
        id: 5,
        name: '提前一天',
        time: '1440'
      }
    ],
    remindValue: 0,
    RemindTime: '-9999',

    remark: '' //备注
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      date: options.date,
      childrenID: options.childrenID
    })

  },

  //录入课程
  setClassNameInput: function(e) {
    this.setData({
      className: e.detail.value
    })
  },
  //录入学校
  setSchoolNameInput: function(e) {
    this.setData({
      schoolName: e.detail.value
    })
  },
  //点击开始时间组件确定事件  
  bindStartTimeChange: function(e) {
    let startTime = e.detail.value,
      strtHour = Number(startTime.split(':')[0]) + 1,
      endTime = strtHour < 10 ? '0' + strtHour + ':00' : strtHour + ':00'

    this.setData({
      startTime: e.detail.value,
      endTime: endTime
    })
  },
  //点击结束时间组件确定事件  
  bindEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  //录入地址
  setAddressInput: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  //录入老师
  setTeacherInput: function(e) {
    this.setData({
      teacher: e.detail.value
    })
  },
  //录入联系方式
  setTelPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //选择提醒方式
  bindPickerChange: function(e) {
    let time = this.data.remindList[e.detail.value].time

    this.setData({
      remindValue: e.detail.value,
      RemindTime: time
    })
  },
  //录入备注
  setRemarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  //取消
  cancel: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  //关闭
  save: function() {
    debugger
    let data = this.data,
      query = {
        ID: data.ID,
        ChildrenID: data.childrenID,
        CourseName: data.className,
        SchoolName: data.schoolName,
        StartTime: data.date + ' ' +data.startTime,
        EndTime: data.date + ' ' +data.endTime,
        Address: data.address,
        Teacher: data.teacher,
        Phone: data.phone,
        RemindTime: data.RemindTime,
        Remarks: data.remark
      }
    
    if (!query.CourseName){
      wx.showToast({
        title: '请填写课程名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (!query.SchoolName) {
      wx.showToast({
        title: '请填写学校名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }

    wx.request({
      url: 'http://192.168.0.3:61242/Course/Add', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        debugger
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })

        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})