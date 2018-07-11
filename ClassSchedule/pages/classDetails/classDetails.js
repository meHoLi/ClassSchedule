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
    this.getTimeData();//时间轴数据
    this.getTabData();//课程数据

    if (!false) {//!!this.data.list && this.data.list[0]
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

  /* 课程详情 */
  addNewAgenda: function (event) {
    console.log(event)
    wx.navigateTo({
        url: '../setAgenda/setAgenda',
    })
  },


  //时间线数据
  getTimeData: function () {
    var list = [
      {
        time: "08:00"
      },
      {
        time: "09:00"
      },
      {
        time: "10:00"
      },
      {
        time: "11:00"
      },
      {
        time: "12:00"
      },
      {
        time: "13:00"
      },
      {
        time: "14:00"
      },
      {
        time: "15:00"
      },
      {
        time: "16:00"
      },
      {
        time: "17:00"
      },
      {
        time: "18:00"
      },
      {
        time: "19:00"
      },
      {
        time: "20:00"
      },
      {
        time: "21:00"
      },
      {
        time: "22:00"
      },
      {
        time: "23:00"
      },
      {
        time: "24:00"
      }
    ];
    this.setData({
      timeList: list
    });
  },

  //课程表数据
  getTabData: function () {
    var list = [
      { id: 0, startTime: '07:00', endTime: '08:00', schoolName: '学而思', className: '数学课', isRemind: 0},
      { id: 1, startTime: '08:30', endTime: '9:25', schoolName: '新东方', className: '英语课', isRemind: 1},
      { id: 2, startTime: '22:45', endTime: '23:59', schoolName: '艺欣艺术学校', className: '钢琴课', isRemind: 2}
    ];

    list = setDataLocation(list);

    this.setData({
      tableList: list
    });
  }

})

function setDataLocation(list) {
  for(let i=0;i<list.length;i++){
    let item = list[i],
      startHour = Number(item.startTime.split(':')[0]),
      startMinute = Number(item.startTime.split(':')[1]),
      endHour = Number(item.endTime.split(':')[0]),
      endMinute = Number(item.endTime.split(':')[1]),
      height = 3,
      marginTop = 0

    console.log('start:', startHour, startMinute, 'end:', endHour, endMinute)

    if (endHour - startHour == 1){
      height = height + 56

      if (!!endMinute){//后期加精度去掉
        height = height + 59
      }
    } else if (endHour - startHour > 1){
      height = height + 56 + 59 * (endHour - startHour - 1)
    }
    // height = height + (endMinute - startMinute)

    if(startHour - 7 > 0){
      if (startHour - 7 == 1){
        marginTop = 60
      } else if (startHour - 7 > 1){
        marginTop = 60 * (startHour - 7)
      }
    }
    // marginTop = marginTop + startMinute

    item.height = height*2
    item.marginTop = marginTop*2
  }

  return list
}