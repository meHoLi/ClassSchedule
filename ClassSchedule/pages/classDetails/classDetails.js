// pages/classDetails/classDetails.js
const app = getApp()
var util = require('../../utils/util.js');
var myDate = new Date(); //获取系统当前时间
var currentDate = myDate.toLocaleDateString(); //获取当前日期
var currentDay = myDate.getDay(); //获取当前周日期
var chnNumChar = ["日", "一", "二", "三", "四", "五", "六"];
var currentWeek = '星期' + chnNumChar[currentDay];
var bodyH

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    date: '',//currentDate,
    week: '',//currentWeek
    bodyHeight: 0
  },
  onLoad: function(options) {
    this.setData({
      date: options.time,
      week: options.week,
      childrenID: options.childrenID
    })
    wx.hideShareMenu()
    // 页面初始化 options为页面跳转所带来的参数
    this.getTimeData(); //时间轴数据
    this.getTabData(options); //课程数据
  },
  onShow() {
    let options = {
      time: this.data.date,
      week: this.data.week,
      childrenID: this.data.childrenID
    }
    this.onLoad(options)
  },

  /* 课程详情 */
  addNewAgenda: function(e) {
    let childrenID = this.data.childrenID,
      date = this.data.date

    if (!e.currentTarget.dataset.item){
      wx.navigateTo({
        url: '../setAgenda/setAgenda?childrenID=' + childrenID + '&date=' + date,
      })
    }else{
      wx.navigateTo({
        url: '../setAgenda/setAgenda?childrenID=' + childrenID + '&date=' + date + '&ID=' + e.currentTarget.dataset.item.ID,
      })
    }
  },


  //时间线数据
  getTimeData: function() {
    var list = [{
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
  getTabData: function(options) {
    let query = {
      childrenID: options.childrenID,
      startTime: options.time + ' 00:00:00',
      endTime: options.time + ' 23:59:59'
    },
      that = this
    // var list = [
    //   { id: 0, startTime: '07:00', endTime: '08:00', schoolName: '学而思', className: '数学课', isRemind: 0];

    wx.request({
      url: that.data.url + '/Course/GetChildrenCourseByDate', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        
        let list = setDataLocation(res.data.Data);

        wx.getSystemInfo({
          success: function (res) {
            bodyH = res.windowHeight - 44 - 70 - 4

            if (!!list[0]) {
              that.setData({
                noClassDis: 'none',
                haveClassDis: 'block',
                tableList: list,
                bodyHeight: bodyH
              });
            } else {
              that.setData({
                noClassDis: 'block',
                haveClassDis: 'none',
                tableList: list,
                bodyHeight: bodyH
              });
            }
          }
        });
      }
    })
  },

  onShareAppMessage: function () {
    let data = this.data

    return {
      title: '',
      desc: '',
      path: '/pages/classDetails/classDetails?childrenID=' + data.childrenID + '&time=' + data.date + '&week=' + data.week + '&openID=' + app.globalData.openID
    }
  },

})

function setDataLocation(list) {
  if (!!list){
    for (let i = 0; i < list.length; i++) {
      let item = list[i],
        startTime = item.StartTime.split(' ')[1],
        endTime = item.EndTime.split(' ')[1],
        startHour = Number(startTime.split(':')[0]),
        startMinute = Number(startTime.split(':')[1]),
        endHour = Number(endTime.split(':')[0]),
        endMinute = Number(endTime.split(':')[1]),
        height = 3,
        marginTop = 0

      if (endHour - startHour == 1) {
        height = height + 56

        // if (!!endMinute) { //后期加精度去掉
        //   height = height + 59
        // }
      } else if (endHour - startHour > 1) {
        height = height + 56 + 59 * (endHour - startHour - 1)
      }
      height = height + (endMinute - startMinute)

      if (startHour - 7 > 0) {
        if (startHour - 7 == 1) {
          marginTop = 60
        } else if (startHour - 7 > 1) {
          marginTop = 60 * (startHour - 7)
        }
      }
      marginTop = marginTop + startMinute

      item.startTime = startTime
      item.endTime = endTime
      item.height = height * 2
      item.marginTop = marginTop * 2
    }

    return list
  }else{
    return []
  }
}