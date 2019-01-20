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
    time: "00:00"
  }, {
    time: "01:00"
  }, {
    time: "02:00"
  }, {
    time: "03:00"
  }, {
    time: "04:00"
  }, {
    time: "05:00"
  }, {
    time: "06:00"
  }, {
    time: "07:00"
  }, {
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
    currentDate: currentDate.split('/').join('-'),
    date: date,
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    list: [],
    page: 1,
    pageSize: 7,
    courseColors: ['#ffca7f', '#91d7fd', '#96a4f9'], // 0学校课程 1其他课程 2智康课程
    bodyHeight: 0,
    hiddenmodalput: true,
    hiddenmodalput2: true
  },

  onLoad: function(options) {debugger
    let that = this,
      publicCourseInfoID = options.id,
      publicCourseTypeID = options.publicCourseTypeID,
      toPublicCourseInfoID = options.toPublicCourseInfoID,
      title = options.comonClassTitle,
      childrenID = options.childrenID

    this.setData({
      title: title,
      publicCourseInfoID: publicCourseInfoID,
      publicCourseTypeID: publicCourseTypeID,
      toPublicCourseInfoID: toPublicCourseInfoID,
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
  changeDay: function(e) {
    let date = e.currentTarget.dataset.time,
      query = this.data.query,
      dateList = this.data.dateList,
      item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index

    dateList.map((o, dateIndex) => {
      if (dateIndex == index) {
        o.className = 'selectDay'
      } else {
        o.className = ''
      }
      // if (o.className.indexOf('isToday') == -1) {
      //   if (dateIndex == index) {
      //     o.className = 'selectDay'
      //   } else {
      //     o.className = ''
      //   }
      // }

      return o
    })

    this.setClassBodyData(dateList, query, date)
  },

  //查询周列表
  setClassData: function(publicCourseInfoID, query) {
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
      success: function(res) {
        let dateList = that.setDateList(res.data.Data)

        that.setClassBodyData(dateList, query)
      }
    })
  },

  //查询课程，设置课程
  setClassBodyData: function(dateList, query, date) {
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
      success: function(res) {
        let tableList = setDataLocation(res.data.Data);

        wx.getSystemInfo({
          success: function(res) {
            bodyH = res.windowHeight - 10 - 30 - 55 - 50 - 8//- 30

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
  setDateList: function(dateList) {
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
  cancel: function(e) {
    wx.navigateBack({
      delta: 2
    })
  },

  //确定
  save: function() {
    let data = this.data,
      query = {
        publicCourseInfoID: data.publicCourseInfoID,
        childrenID: data.childrenID,
        isOverlap:false
      },
      that = this;

    that.setData({
      hiddenmodalput2: false,
    })

    if (!!Number(data.toPublicCourseInfoID)){
      query.toPublicCourseInfoID = data.toPublicCourseInfoID
      query.importChildrenCourse = false
    }
    
    wx.request({
      url: that.data.url + '/Course/ImportCourse', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        that.setData({
          hiddenmodalput2: true,
        })

        if (res.data.Result == '800') {
          that.setData({
            hiddenmodalput:false
          })
          return
        }

        wx.showToast({
          title: '导入成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      
        setTimeout(() => {
          wx.navigateBack({
            delta: 3
          })
        }, 300)
      }
    })
  },

  handleConfirm: function() {//确认覆盖
    let data = this.data,
      query = {
        publicCourseInfoID: data.publicCourseInfoID,
        childrenID: data.childrenID,
        isOverlap: true
      },
      that = this;

    that.setData({
      hiddenmodalput: true,
      hiddenmodalput2: false,
    })

    if (!!Number(data.toPublicCourseInfoID)) {
      query.toPublicCourseInfoID = data.toPublicCourseInfoID
      query.importChildrenCourse = false
    }

    wx.request({
      url: that.data.url + '/Course/ImportCourse', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          hiddenmodalput2: true,
        })

        wx.showToast({
          title: '导入成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })

        setTimeout(()=>{
          wx.navigateBack({
            delta: 3
          })
        },300)
      }
    })
  },

  handleCancel: function () {//取消
    this.setData({
      hiddenmodalput: true
    })
  },

  //上一周
  prevWeekHandler: function() {
    let query = this.data.query,
      page = this.data.page - 1

    query.page = page

    this.setClassData(undefined, query)
  },
  //下一周
  nextWeekHandler: function() {
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
        height = 0,
        marginTop = 0

      if (endHour - startHour == 1) {
        height = height + 40

        // if (!!endMinute) { //后期加精度去掉
        //   height = height + 40
        // }
      } else if (endHour - startHour > 1) {
        height = height + 40 + 40 * (endHour - startHour - 1)
      }
      height = height + (endMinute - startMinute) / 60 * 40

      // if (startHour - 7 > 0) {
      //   if (startHour - 7 == 1) {
      //     marginTop = 42
      //   } else if (startHour - 7 > 1) {
      //     marginTop = 42 * (startHour - 7)
      //   }
      // }

      if (startHour - 0 > 0) {
        marginTop = 42 * (startHour + 1)
      }
      
      marginTop = marginTop + startMinute / 60 * 40

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