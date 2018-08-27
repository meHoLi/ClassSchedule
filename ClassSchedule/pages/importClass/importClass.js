// pages/importClass/importClass.js
const app = getApp()
let util = require('../../utils/util.js');
let myDate = new Date(); //获取系统当前时间
let currentDate = myDate.toLocaleDateString(); //获取当前日期
let year = myDate.getFullYear()
let month = myDate.getMonth() + 1
let day = myDate.getDate()
let date = '' + year + '-' + (month < 10 ? '0' + Number(month) : month) + '-' + (day < 10 ? '0' + Number(day) : day) //myDate.toLocaleDateString(); //获取当前日期
let timestamp = new Date().getTime(); //当前日期时间戳
let bodyH
let timeList = [{
  time: "08:00"
}, {
  time: "09:00"
}, {
  time: "10:00"
}, {
  time: "11:00"
}, {
  time: "12:00"
}, {
  time: "13:00"
}, {
  time: "14:00"
}, {
  time: "15:00"
}, {
  time: "16:00"
}, {
  time: "17:00"
}, {
  time: "18:00"
}, {
  time: "19:00"
}, {
  time: "20:00"
}, {
  time: "21:00"
}, {
  time: "22:00"
}, {
  time: "23:00"
}, {
  time: "24:00"
}]

Page({
  data: {
    timeList: timeList,
    timestamp: timestamp,
    currentDate: currentDate,
    date: date,
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    list: [],
    page: 1,
    pageSize: 7,
    courseColors: ['#ffca7f', '#91d7fd', '#96a4f9'], // 0学校课程 1其他课程 2智康课程
    bodyHeight: 0
  },

  onLoad: function (options) {
    let that = this,
      publicCourseInfoID = options.id,
      publicCourseTypeID = options.publicCourseTypeID,
      title = options.comonClassTitle,
      childrenID = options.childrenID

    this.setData({
      title: title,
      publicCourseInfoID: publicCourseInfoID,
      publicCourseTypeID: publicCourseTypeID,
      childrenID: childrenID
    })

    wx.hideShareMenu()

    that.setClassData(publicCourseInfoID);
  },
  onShow() { //返回显示页面状态函数
    let that = this,
      query = this.data.query

    wx.hideShareMenu()

    that.setClassData();
  },

  //编辑课程信息
  changeDay: function (e) {
    let date = e.currentTarget.dataset.time,
      query = this.data.query

    this.setClassBodyData(undefined, query, date)
  },

  //查询周列表
  setClassData: function (publicCourseInfoID, query) {
    let that = this

    query = !!query ? query : {
      publicCourseInfoID: !!publicCourseInfoID ? publicCourseInfoID : that.data.publicCourseInfoID,
      openID: app.globalData.openID,
      page: that.data.page,
      pageSize: that.data.pageSize
    }

    wx.request({
      url: that.data.url + '/Course/GetPublicCourseIndex', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let dateList = that.setDateList(res.data.Data)

        that.setClassBodyData(dateList, query)
      }
    })
  },

  //查询课程，设置课程
  setClassBodyData: function (dateList, query, date) {
    let that = this,
      startDate = (date ? date : that.data.date) + ' 00:00:00',
      endDate = (date ? date : that.data.date) + ' 23:59:59'

    wx.request({
      url: that.data.url + '/Course/GetPublicCourseByDate', //仅为示例，并非真实的接口地址
      data: {
        publicCourseInfoID: query.publicCourseInfoID,
        startTime: startDate,
        endTime: endDate
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let tableList = setDataLocation(res.data.Data);

        wx.getSystemInfo({
          success: function (res) {
            bodyH = res.windowHeight - 10 - 30 - 30 - 55 - 50 - 8

            that.setData({
              dateList: !!dateList ? dateList : that.data.dateList,
              noClassDis: !!tableList[0] ? 'none' : 'block',
              haveClassDis: !!tableList[0] ? 'block' : 'none',
              tableList: tableList,
              date: date ? date : that.data.date,
              page: query.page,
              query: query,
              publicCourseInfoID: query.publicCourseInfoID,
              bodyHeight: bodyH
            })
          }
        });

      }
    })

  },

  //设置时间戳
  setDateList: function (dateList) {
    dateList.map((o, index) => {
      let startTimeStamp = Date.parse(o.StartTime.split('-').join('/') + " 00:00:00") //当前日期时间戳

      dateList[index].className = startTimeStamp < timestamp ? 'lastDate' : (startTimeStamp > timestamp ? 'nextDate' : '')

      if (!!o.IsToday) {
        dateList[index].className = 'isToday'
      }
      dateList[index].curWeek = o.DayOfWeek.substr(2)
      dateList[index].curDay = o.StartTime.split('-')[2]
    })

    return dateList
  },

  // 取消
  cancel: function (e) {
    wx.navigateBack({
      delta: 2
    })
  },

  //确定
  save: function () {
    let query = {
      publicCourseInfoID: this.data.publicCourseInfoID,
      childrenID: this.data.childrenID
    },
      that = this;

    wx.request({
      url: that.data.url + '/Course/ImportCourse', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.Result == '800') {
          wx.showToast({
            title: '当前有重复课程，请处理后再导入',
            icon: 'none',
            duration: 3000,
            mask: true
          })
          return
        }

        wx.showToast({
          title: '导入成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })

        wx.navigateBack({
          delta: 2
        })
      }
    })
  },

  //上一周
  prevWeekHandler: function () {
    let query = this.data.query,
      page = this.data.page - 1

    query.page = page

    this.setClassData(undefined, query)
  },
  //下一周
  nextWeekHandler: function () {
    let query = this.data.query,
      page = this.data.page + 1

    query.page = page

    this.setClassData(undefined, query)
  }


})

function setDataLocation(list) {
  if (!!list) {
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
  } else {
    return []
  }
}