// pages/curWeekClass/curWeekClass.js
const app = getApp()
var util = require('../../utils/util.js');
var myDate = new Date(); //获取系统当前时间
//var currentDate = myDate.toLocaleDateString(); //获取当前日期
let year = myDate.getFullYear()
let month = myDate.getMonth() + 1
let day = myDate.getDate()
let currentDate = '' + year + '-' + (month < 10 ? '0' + Number(month) : month) + '-' + (day < 10 ? '0' + Number(day) : day);//myDate.toLocaleDateString(); //获取当前日期
// var timestamp = Date.parse(currentDate+ " 00:00:00")//当前日期时间戳
var timestamp = new Date().getTime();//当前日期时间戳
var mtabW, mdateW, mdateH, hSwiper, bodyH, itemHeight,classHeight

Page({
  data: {
    timestamp: timestamp,
    currentDate: currentDate.split('/').join('-'),
    month: month,
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    list: [],
    activeIndex: 0,
    slideOffset: 0,
    tabW: 0,
    dateW: 0,
    dateH: 0,
    swiperHeight: 0,
    bodyHeight: 0,
    isUnfoldType: false,
    page: 1,
    pageSize: 7,
    tasklist: [
      { id: 0, type: 0, day: 0, start: 1, sections: 1, CourseName: "语文", teacher: "刘德华", place: "大钟寺" }
    ],
    courseColors: ['#000000', '#c00000', '#538035'], // 0学校正课 1课外课 2其他  '#91d7fd', '#96a4f9'
  },

  onLoad: function (options) {
    // wx.hideShareMenu()

    if (!!options && options.openID) {
      this.setTabData(options.openID);
    } else {
      this.setTabData();
    }
  },
  onShow() { //返回显示页面状态函数
    let query = this.data.query

    // wx.hideShareMenu()

    // this.setClassData(query)//再次加载，实现返回上一页页面刷新
    // this.setData({
    //   activeIndex: 0,
    // });
    // this.onLoad()
    this.setTabData(undefined, query);
  },

  //页签切换
  tabClick: function (e) {
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
  bindChange: function (e) {
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
  editAgenda: function (e) {
    let activeIndex = this.data.activeIndex,
      curNameList = this.data.nameList[activeIndex],
      time = e.currentTarget.dataset.time,
      week = e.currentTarget.dataset.week

    wx.navigateTo({
      url: "/pages/classDetails/classDetails?childrenID=" + curNameList.ID + '&time=' + time + '&week=' + week
    })
  },

  //设置tab数据
  setTabData: function (openID, query) {
    let that = this
    wx.request({
      url: that.data.url + '/Children/Index', //仅为示例，并非真实的接口地址
      data: {
        openID: !!openID ? openID : app.globalData.openID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
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

  //查询日历
  setClassData: function (query) {
    let that = this

    wx.request({
      url: that.data.url + '/Course/Index', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let dateList = res.data.Data

        that.setClassBodyData(dateList, query)
      }
    })
  },

  //查询课程，设置课程
  setClassBodyData: function (dateList, query) {
    let that = this,
      startDate = dateList[0].StartTime +' 00:00:00',
      endDate = dateList[dateList.length - 1].StartTime +' 23:59:59'

    wx.request({
      // url: that.data.url + '/Course/GetChildrenCourseByDate', //仅为示例，并非真实的接口地址
      url: that.data.url + '/Course/GetChildrenCourseByDateFormatOfWeek', //仅为示例，并非真实的接口地址
      data: { childrenID: query.childrenID, startTime: startDate, endTime: endDate},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let classList = res.data.Data

        classList = that.setClassList(classList)

        console.log(classList)

        wx.getSystemInfo({
          success: function (res) {
            mtabW = (res.windowWidth - 20 - 8) / 3; //设置tab的宽度
            hSwiper = res.windowHeight - 10 - 28
            bodyH = res.windowHeight - 10 - 28 - 30 - 55 - 8
            itemHeight = bodyH/3*2
            classHeight = bodyH/24*2

            dateList = that.setDateList(dateList)
            let month = Number(dateList[0].StartTime.split('-')[1])

            that.setData({
              dateList: dateList,
              classList: classList,
              month: month,
              page: query.page,
              query: query,
              childrenID: query.childrenID,
              tabW: mtabW,
              swiperHeight: hSwiper,
              bodyHeight: bodyH*2,
              itemHeight: itemHeight,
              classHeight: classHeight
            })
          }
        });
      }
    })

  },

  //设置课程位置
  setClassList: function(classList){
    classList.map((o,index)=>{
      // let hour = Number(o.StartTime.split(' ')[1].split(':')[0])
      let hour = Number(o.ShowDate.split(' ')[1].split(':')[0])

      if (o.DayOfWeek.indexOf('一') != -1){
        o.day = 0
      } else if (o.DayOfWeek.indexOf('二') != -1){
        o.day = 1
      } else if (o.DayOfWeek.indexOf('三') != -1) {
        o.day = 2
      } else if (o.DayOfWeek.indexOf('四') != -1) {
        o.day = 3
      } else if (o.DayOfWeek.indexOf('五') != -1) {
        o.day = 4
      } else if (o.DayOfWeek.indexOf('六') != -1) {
        o.day = 5
      } else {
        o.day = 6
      }

      if (o.CourseType == 1){
        o.type = 0
      } else if (o.CourseType == 2){
        o.type = 1
      } else{
        o.type = 2
      }

      // switch (hour) {
      //   case 0:
      //     o.start = 1
      //     break;
      //   case 1:
      //     o.start = 2
      //     break;
      //   case 2:
      //     o.start = 3
      //     break;
      //   case 3:
      //     o.start = 4
      //     break;
      //   case 4:
      //     o.start = 5
      //     break;
      //   case 5:
      //     o.start = 6
      //     break;
      //   case 6:
      //     o.start = 7
      //     break;
      //   case 7:
      //     o.start = 8
      //     break;
        
      //   case 12:
      //     o.start = 9
      //     break;
      //   case 13:
      //     o.start = 10
      //     break;
      //   case 14:
      //     o.start = 11
      //     break;
      //   case 15:
      //     o.start = 12
      //     break;
      //   case 16:
      //     o.start = 13
      //     break;
      //   case 17:
      //     o.start = 14
      //     break;

      //   case 18:
      //     o.start = 17
      //     break;
      //   case 19:
      //     o.start = 18
      //     break;
      //   case 20:
      //     o.start = 19
      //     break;
      //   case 21:
      //     o.start = 20
      //     break;
      //   case 22:
      //     o.start = 21
      //     break;
      //   case 23:
      //     o.start = 22
      //     break;
      // }

      // switch (hour) {
      //   case 0:
      //     o.start = 1
      //     break;
      //   case 1:
      //     o.start = 2
      //     break;
      //   case 2:
      //     o.start = 3
      //     break;
      //   case 3:
      //     o.start = 4
      //     break;
      //   case 4:
      //     o.start = 5
      //     break;
      //   case 5:
      //     o.start = 6
      //     break;
      //   case 6:
      //     o.start = 7
      //     break;
      //   case 7:
      //     o.start = 8
      //     break;
      //   case 8:
      //     o.start = 9
      //     break;
      //   case 9:
      //     o.start = 10
      //     break;
      //   case 10:
      //     o.start = 11
      //     break;
      //   case 11:
      //     o.start = 12
      //     break;
      //   case 12:
      //     o.start = 13
      //     break;
      //   case 13:
      //     o.start = 14
      //     break;
      //   case 14:
      //     o.start = 15
      //     break;
      //   case 15:
      //     o.start = 16
      //     break;
      //   case 16:
      //     o.start = 17
      //     break;
      //   case 17:
      //     o.start = 18
      //     break;
      //   case 18:
      //     o.start = 19
      //     break;
      //   case 19:
      //     o.start = 20
      //     break;
      //   case 20:
      //     o.start = 21
      //     break;
      //   case 21:
      //     o.start = 22
      //     break;
      //   case 22:
      //     o.start = 23
      //     break;
      //   case 23:
      //     o.start = 24
      //     break;
      // }


      // switch (hour) {
      //   case 4:
      //     o.start = 1
      //     break;
      //   case 5:
      //     o.start = 2
      //     break;
      //   case 6:
      //     o.start = 3
      //     break;
      //   case 7:
      //     o.start = 4
      //     break;
      //   case 8:
      //     o.start = 5
      //     break;
      //   case 9:
      //     o.start = 6
      //     break;
      //   case 10:
      //     o.start = 7
      //     break;
      //   case 11:
      //     o.start = 8
      //     break;
      //   case 12:
      //     o.start = 9
      //     break;
      //   case 13:
      //     o.start = 10
      //     break;
      //   case 14:
      //     o.start = 11
      //     break;
      //   case 15:
      //     o.start = 12
      //     break;
      //   case 16:
      //     o.start = 13
      //     break;
      //   case 17:
      //     o.start = 14
      //     break;
      //   case 18:
      //     o.start = 15
      //     break;
      //   case 19:
      //     o.start = 16
      //     break;
      //   case 20:
      //     o.start = 17
      //     break;
      //   case 21:
      //     o.start = 18
      //     break;
      //   case 22:
      //     o.start = 19
      //     break;
      //   case 23:
      //     o.start = 20
      //     break;
      //   case 0:
      //     o.start = 21
      //     break;
      //   case 1:
      //     o.start = 22
      //     break;
      //   case 2:
      //     o.start = 23
      //     break;
      //   case 3:
      //     o.start = 24
      //     break;
      // }
      return o
    })

    return classList
  },

  //设置时间戳
  setDateList: function (dateList) {
    dateList.map((o, index) => {
      let startTimeStamp = Date.parse(o.StartTime.split('-').join('/') + " 00:00:00")//当前日期时间戳

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
  prevWeekHandler: function () {
    let query = this.data.query,
      page = this.data.page - 1

    query.page = page

    this.setClassData(query)
  },
  //下一周
  nextWeekHandler: function () {
    let query = this.data.query,
      page = this.data.page + 1

    query.page = page

    this.setClassData(query)
  },
  onShareAppMessage: function () {
    let data = this.data,
      query = data.query

    return {
      title: '',
      desc: '',
      // path: '/pages/calendar/calendar?activeIndex=' + data.activeIndex + '&childrenID=' + query.childrenID + '&page=' + query.page + '&pageSize=' + query.pageSize + '&openID=' + app.globalData.openID
      path:'/pages/login/login',
      imageUrl: '/imgs/accredit/pic2.jpg'
    }
  },

})