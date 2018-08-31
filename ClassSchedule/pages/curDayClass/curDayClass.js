// pages/curDayClass/curDayClass.js
const app = getApp()
let util = require('../../utils/util.js');
let myDate = new Date(); //获取系统当前时间
let currentDate = myDate.toLocaleDateString(); //获取当前日期
let year = myDate.getFullYear()
let month = myDate.getMonth() + 1
let day = myDate.getDate()
let date = '' + year + '-' + (month < 10 ? '0' + Number(month) : month) + '-' + (day < 10 ? '0' + Number(day) : day)//myDate.toLocaleDateString(); //获取当前日期
let timestamp = new Date().getTime(); //当前日期时间戳
let mtabW, hSwiper, bodyH
let timeList = [{
    time: "00:00"
  },{
    time: "01:00"
  },{
    time: "02:00"
  },{
    time: "03:00"
  },{
    time: "04:00"
  },{
    time: "05:00"
  },{
    time: "06:00"
  },{
    time: "07:00"
  },{
    time: "08:00"
  },{
    time: "09:00"
  },{
    time: "10:00"
  },{
    time: "11:00"
  },{
    time: "12:00"
  },{
    time: "13:00"
  },{
    time: "14:00"
  },{
    time: "15:00"
  },{
    time: "16:00"
  },{
    time: "17:00"
  },{
    time: "18:00"
  },{
    time: "19:00"
  },{
    time: "20:00"
  },{
    time: "21:00"
  },{
    time: "22:00"
  },{
    time: "23:00"
  },{
    time: "24:00"
  }
]

Page({
  data: {
    timeList: timeList,
    timestamp: timestamp,
    currentDate: currentDate,
    date: date,
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    list: [],
    activeIndex: 0,
    slideOffset: 0,
    tabW: 0,
    swiperHeight: 0,
    page: 1,
    pageSize: 7,
    courseColors: ['#ffca7f', '#91d7fd', '#96a4f9'], // 0学校课程 1其他课程 2智康课程
    bodyHeight: 0
  },

  onLoad: function(options) {
    let that = this;

    wx.hideShareMenu()

    wx.request({
      url: app.globalData.url + '/Memorandum/Index', //仅为示例，并非真实的接口地址
      data: {
        openID: app.globalData.openID,
        startTime: date + ' 00:00:00',
        endTime: '2030-12-31 00:00:00'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let list = res.data.Data

        that.setData({
          inforList: list
        });

        if (!!options && options.openID) {
          that.setTabData(options.openID);
        } else {
          that.setTabData();
        }
      }
    })
  },
  onShow() { //返回显示页面状态函数
    let that = this,
      query = this.data.query

    wx.hideShareMenu()

    wx.request({
      url: app.globalData.url + '/Memorandum/Index', //仅为示例，并非真实的接口地址
      data: {
        openID: app.globalData.openID,
        startTime: date + ' 00:00:00',
        endTime: '2030-12-31 00:00:00'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let list = res.data.Data

        that.setData({
          inforList: list
        });

        that.setTabData(undefined, query);
      }
    })
  },

  //页签切换
  tabClick: function(e) {
    var that = this;
    var childrenID = e.currentTarget.dataset.id;
    var idIndex = e.currentTarget.id;
    var offsetW = e.currentTarget.offsetLeft; //2种方法获取距离文档左边有多少距离
    var query = {
      childrenID: childrenID,
      page: 1,
      "pageSize": that.data.pageSize
    }
    this.setData({
      childrenID: childrenID,
      activeIndex: idIndex,
      slideOffset: offsetW
    });

    that.setClassData(query)
  },
  //页签项滑动切换
  bindChange: function(e) {
    var current = e.detail.current;
    var curNameList = this.data.nameList[current]
    var query = {
      "childrenID": curNameList.ID,
      "page": 1,
      "pageSize": this.data.pageSize
    }
    if ((current + 1) % 4 == 0) {

    }
    var offsetW = current * mtabW; //2种方法获取距离文档左边有多少距离
    this.setData({
      activeIndex: current,
      slideOffset: offsetW
    });

    this.setClassData(query)
  },
  //编辑课程信息
  changeDay: function(e) {
    let date = e.currentTarget.dataset.time,
      query = this.data.query

    this.setClassBodyData(query, date)
  },

  //设置tab数据
  setTabData: function(openID, query) {
    let that = this
    wx.request({
      url: that.data.url + '/Children/Index', //仅为示例，并非真实的接口地址
      data: {
        openID: !!openID ? openID : app.globalData.openID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        let nameList = res.data.Data,
          activeIndex = that.data.activeIndex

        if (!!query) {
          let item = nameList.filter(o => {
            return o.ID == query.childrenID
          })

          if (!item[0]) {
            query = {
              "childrenID": nameList[0].ID,
              "page": that.data.page,
              "pageSize": that.data.pageSize
            }
            activeIndex = 0
          }
        } else {
          query = {
            "childrenID": nameList[0].ID,
            "page": that.data.page,
            "pageSize": that.data.pageSize
          }
          activeIndex = 0
        }

        that.setData({
          nameList: nameList,
          activeIndex: activeIndex
        })

        that.setClassData(query)
      }
    })
  },

  //查询孩子
  setClassData: function(query) {
    let that = this

    wx.request({
      url: that.data.url + '/Course/Index', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        let dateList = res.data.Data

        dateList = that.setDateList(dateList)

        that.setData({
          dateList: dateList
        })

        that.setClassBodyData(query)
      }
    })
  },

  //查询课程，设置课程
  setClassBodyData: function (query, date) {
    let that = this,
      startDate = (date ? date : that.data.date) + ' 00:00:00',
      endDate = (date ? date : that.data.date) + ' 23:59:59'

    wx.request({
      url: that.data.url + '/Course/GetChildrenCourseByDate', //仅为示例，并非真实的接口地址
      data: {
        childrenID: query.childrenID,
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
            mtabW = (res.windowWidth - 20 - 8) / 3; //设置tab的宽度
            hSwiper = res.windowHeight - 10 - 28
            bodyH = res.windowHeight - 10 - 28 - 30 - 55 - 60 - 8

            that.setData({
              noClassDis: !!tableList[0] ? 'none' : 'block',
              haveClassDis: !!tableList[0] ? 'block' : 'none',
              tableList: tableList,
              date: date ? date : that.data.date,
              page: query.page,
              query: query,
              childrenID: query.childrenID,
              tabW: mtabW,
              swiperHeight: hSwiper,
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

  //上一周
  prevWeekHandler: function() {
    let query = this.data.query,
      page = this.data.page - 1

    query.page = page

    this.setClassData(query)
  },
  //下一周
  nextWeekHandler: function() {
    let query = this.data.query,
      page = this.data.page + 1

    query.page = page

    this.setClassData(query)
  },

  /* 新增课程，课程详情 */
  addNewAgenda: function (e) {
    let childrenID = this.data.childrenID,
      date = this.data.date

    if (!e.currentTarget.dataset.item) {
      wx.navigateTo({
        url: '../setAgenda/setAgenda?childrenID=' + childrenID + '&date=' + date,
      })
      // wx.navigateTo({
      //   url: '../commonClassLogin/commonClassLogin'
      // })
    } else {
      wx.navigateTo({
        url: '../setAgenda/setAgenda?childrenID=' + childrenID + '&date=' + date + '&ID=' + e.currentTarget.dataset.item.ID,
      })
    }
  },

  //导入课程表
  importClass: function(){
    let childrenID = this.data.childrenID

    wx.navigateTo({
      url: '../importLogin/importLogin?childrenID=' + childrenID,
    })
  },

  //跳转备忘信息 
  toNotice: function(){
    let that = this
    wx.navigateTo({
      url: '../notice/notice',
    })
  },

  onShareAppMessage: function() {
    let data = this.data,
      query = data.query

    return {
      title: '',
      desc: '',
      path: '/pages/calendar/calendar?activeIndex=' + data.activeIndex + '&childrenID=' + query.childrenID + '&page=' + query.page + '&pageSize=' + query.pageSize + '&openID=' + app.globalData.openID
    }
  },

})

function setDataLocation(list) {debugger
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

      // if (startHour - 7 > 0) {
      //   if (startHour - 7 == 1) {
      //     marginTop = 60
      //   } else if (startHour - 7 > 1) {
      //     marginTop = 60 * (startHour - 7)
      //   }
      // }
      if (startHour - 0 > 0) {
        marginTop = 60 * (startHour + 1)
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