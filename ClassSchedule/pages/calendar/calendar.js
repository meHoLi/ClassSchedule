// pages/calendar/calendar.js
const app = getApp()
var util = require('../../utils/util.js');
var myDate = new Date(); //获取系统当前时间
var currentDate = myDate.toLocaleDateString(); //获取当前日期
// var timestamp = Date.parse(currentDate+ " 00:00:00")//当前日期时间戳
var timestamp = new Date().getTime();//当前日期时间戳
var mtabW, mdateW, mdateH, hSwiper

Page({
  data: {
    timestamp: timestamp,
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    list: [],
    activeIndex: 0,
    slideOffset: 0,
    tabW: 0,
    dateW: 0,
    dateH: 0,
    swiperHeight: 0,
    isUnfoldType: false,
    page: 1,
    pageSize: 7
  },

  onLoad: function(options) {
    wx.hideShareMenu()

    if (!!options && options.openID) {
      this.setTabData(options.openID);
    } else {
      this.setTabData();
    }
  },
  onShow() { //返回显示页面状态函数
    let query = this.data.query

    wx.hideShareMenu()

    // this.setClassData(query)//再次加载，实现返回上一页页面刷新
    // this.setData({
    //   activeIndex: 0,
    // });
    // this.onLoad()
    this.setTabData(undefined, query);
  },

  //点击左上角折叠展开按钮
  isUnfold: function() {
    if (!this.data.isUnfoldType) {
      this.setData({
        isUnfoldType: true
      })
    } else {
      this.setData({
        isUnfoldType: false
      })
    }
  },

  //点击新增孩子
  addClassTable: function() {
    wx.navigateTo({
      url: '../addNewClass/addNewClass?openID=' + app.globalData.openID
    })
  },

  //点击与上周课程一样
  likePrev: function() {
    let that = this,
      dateList = this.data.dateList,
      query = {
        childrenID: this.data.childrenID,
        startTime: dateList[0].StartTime,
        endTime: dateList[dateList.length - 1].StartTime + ' 23:59',
        interval: 7
      }
    wx.request({
      url: that.data.url + '/Course/AddCourseList', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
  
        let query = that.data.query

        if (!!res.data.Data.isExistence) {
          let message = res.data.Msg + '已经存在课程，请手动修改'

          wx.showModal({
            title: '提示',
            content: message,
            showCancel: false
          })
        }

        that.setClassData(query)
      },
      complete: function() {
        wx.hideToast(); //隐藏Toast
      }
    })
  },

  //点击当周新建课程
  curNewAdd: function() {
    let that = this,
      dateList = this.data.dateList,
      query = {
        childrenID: this.data.childrenID,
        startTime: dateList[0].StartTime,
        endTime: dateList[dateList.length - 1].StartTime + ' 23:59'
      }

    wx.request({
      url: that.data.url + '/Course/Deletes', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
  
        let query = that.data.query

        that.setClassData(query)
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
  editAgenda: function(e) {
    let activeIndex = this.data.activeIndex,
      curNameList = this.data.nameList[activeIndex],
      time = e.currentTarget.dataset.time,
      week = e.currentTarget.dataset.week

    wx.navigateTo({
      url: "/pages/classDetails/classDetails?childrenID=" + curNameList.ID + '&time=' + time + '&week=' + week
    })
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
        console.log(res)
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

  setClassData(query) {
    let that = this

    wx.request({
      url: that.data.url + '/Course/Index', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        let dateList = res.data.Data

        wx.getSystemInfo({
          success: function(res) {
      

            mtabW = (res.windowWidth - 20 - 8) / 3; //设置tab的宽度
            mdateW = (res.windowWidth - 20 - 40 - 30 - 15) / 3; //设置日期的宽度
            mdateH = (res.windowHeight - 20 - 30 - 20 - 28 - 20 - 15 - 10 - 30 - 30 - 30) / 3; //设置日期高度
            hSwiper = res.windowHeight - 20 - 40 - 10 - 28

            dateList = that.setDateList(dateList)

            that.setData({
              dateList: dateList,
              page: query.page,
              query: query,
              childrenID: query.childrenID,
              tabW: mtabW,
              dateW: mdateW,
              dateH: mdateH,
              swiperHeight: hSwiper
            })
          }
        });
      }
    })
  },

  //设置时间戳
  setDateList: function (dateList){
    dateList.map((o,index)=>{
      let startTimeStamp = Date.parse(o.StartTime.split('-').join('/') + " 00:00:00")//当前日期时间戳

      console.log(startTimeStamp,'////日历')
      console.log(startTimeStamp<timestamp)
      console.log(timestamp, '////今天')

      dateList[index].className = startTimeStamp < timestamp ? 'lastDate' : (startTimeStamp > timestamp ? 'nextDate' : '')

      if (!!o.IsToday){
        dateList[index].className = 'isToday'
      }
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