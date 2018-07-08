// pages/classDetails/classDetails.js
var util = require('../../utils/util.js');
var myDate = new Date();//获取系统当前时间
var currentDate = myDate.toLocaleDateString(); //获取当前日期
var currentDay = myDate.getDay();//获取当前周日期
var chnNumChar = ["日", "一", "二", "三", "四", "五", "六"];
var currentWeek = '星期' + chnNumChar[currentDay];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: currentDate,
    week: currentWeek
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (true) {//!!this.data.list && this.data.list[0]
      this.setData({
        noClassDis: 'none',
        haveClassDis: 'block'
      });
    } else {
      this.setData({
        noClassDis: 'block',
        haveClassDis: 'none'
      });
    }
  },
})