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
  data: { timestamp: timestamp, currentDate: currentDate.split('/').join('-'), month: month, url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com', list: [], activeIndex: 0, slideOffset: 0, tabW: 0, dateW: 0, dateH: 0, swiperHeight: 0, bodyHeight: 0, isUnfoldType: false, page: 1, pageSize: 7, tasklist: [{ id: 0, type: 0, day: 0, start: 1, sections: 1, CourseName: "语文", teacher: "刘德华", place: "大钟寺" }], courseColors: ['#000000', '#c00000', '#538035'], }, onLoad: function (options) { if (!!options && options.openID) { this.setTabData(options.openID) } else { this.setTabData() } }, onShow() { let query = this.data.query
  this.setTabData(undefined, query) }, tabClick: function (e) {
    var that = this; var childrenID = e.currentTarget.dataset.id; var idIndex = e.currentTarget.id; var offsetW = e.currentTarget.offsetLeft; var query = { childrenID: childrenID, page: 1, "pageSize": that.data.pageSize }
    this.setData({ childrenID: childrenID, activeIndex: idIndex, slideOffset: offsetW }); that.setClassData(query)
  }, bindChange: function (e) {
    var current = e.detail.current; var curNameList = this.data.nameList[current]
    var query = { "childrenID": curNameList.ID, "page": 1, "pageSize": this.data.pageSize }
    if ((current + 1) % 4 == 0) { } var offsetW = current * mtabW; this.setData({ activeIndex: current, slideOffset: offsetW }); this.setClassData(query)
  }, editAgenda: function (e) {
    let activeIndex = this.data.activeIndex, curNameList = this.data.nameList[activeIndex], time = e.currentTarget.dataset.time, week = e.currentTarget.dataset.week
    wx.navigateTo({ url: "/pages/classDetails/classDetails?childrenID=" + curNameList.ID + '&time=' + time + '&week=' + week })
  }, setTabData: function (openID, query) {
    let that = this
    wx.request({
      url: that.data.url + '/Children/Index', data: { openID: !!openID ? openID : app.globalData.openID }, header: { 'content-type': 'application/json' }, success: function (res) {
        let nameList = res.data.Data, activeIndex = that.data.activeIndex
        if (!!query) {
          let item = nameList.filter(o => { return o.ID == query.childrenID })
          if (!item[0]) {
            query = { "childrenID": nameList[0].ID, "page": that.data.page, "pageSize": that.data.pageSize }
            activeIndex = 0
          }
        } else {
          query = { "childrenID": nameList[0].ID, "page": that.data.page, "pageSize": that.data.pageSize }
          activeIndex = 0
        } that.setData({ nameList: nameList, activeIndex: activeIndex })
        that.setClassData(query)
      }
    })
  }, setClassData: function (query) {
    let that = this
    wx.request({
      url: that.data.url + '/Course/Index', data: query, header: { 'content-type': 'application/json' }, success: function (res) {
        let dateList = res.data.Data
        that.setClassBodyData(dateList, query)
      }
    })
  }, setClassBodyData: function (dateList, query) {
    let that = this, startDate = dateList[0].StartTime + ' 00:00:00', endDate = dateList[dateList.length - 1].StartTime + ' 23:59:59'
    wx.request({
      url: that.data.url + '/Course/GetChildrenCourseByDateFormatOfWeek', data: { childrenID: query.childrenID, startTime: startDate, endTime: endDate }, header: { 'content-type': 'application/json' }, success: function (res) {
        let classList = res.data.Data
        classList = that.setClassList(classList)
        wx.getSystemInfo({
          success: function (res) {
            mtabW = (res.windowWidth - 20 - 8) / 3; hSwiper = res.windowHeight - 10 - 28
            bodyH = res.windowHeight - 10 - 28 - 30 - 55 - 8
            itemHeight = bodyH / 3 * 2
            classHeight = bodyH / 24 * 2
            dateList = that.setDateList(dateList)
            let month = Number(dateList[0].StartTime.split('-')[1])
            that.setData({ dateList: dateList, classList: classList, month: month, page: query.page, query: query, childrenID: query.childrenID, tabW: mtabW, swiperHeight: hSwiper, bodyHeight: bodyH * 2, itemHeight: itemHeight, classHeight: classHeight })
          }
        })
      }
    })
  }, setClassList: function (classList) {
    classList.map((o, index) => {
      let hour = Number(o.ShowDate.split(' ')[1].split(':')[0])
      if (o.DayOfWeek.indexOf('一') != -1) { o.day = 0 } else if (o.DayOfWeek.indexOf('二') != -1) { o.day = 1 } else if (o.DayOfWeek.indexOf('三') != -1) { o.day = 2 } else if (o.DayOfWeek.indexOf('四') != -1) { o.day = 3 } else if (o.DayOfWeek.indexOf('五') != -1) { o.day = 4 } else if (o.DayOfWeek.indexOf('六') != -1) { o.day = 5 } else { o.day = 6 } if (o.CourseType == 1) { o.type = 0 } else if (o.CourseType == 2) { o.type = 1 } else { o.type = 2 } return o
    })
    return classList
  }, setDateList: function (dateList) {
    dateList.map((o, index) => {
      let startTimeStamp = Date.parse(o.StartTime.split('-').join('/') + " 00:00:00")
      dateList[index].className = startTimeStamp < timestamp ? 'lastDate' : (startTimeStamp > timestamp ? 'nextDate' : '')
      if (!!o.IsToday) { dateList[index].className = 'isToday' } dateList[index].curWeek = o.DayOfWeek.substr(2)
      dateList[index].curDay = o.StartTime.split('-')[2]
    })
    return dateList
  }, prevWeekHandler: function () {
    let query = this.data.query, page = this.data.page - 1
    query.page = page
    this.setClassData(query)
  }, nextWeekHandler: function () {
    let query = this.data.query, page = this.data.page + 1
    query.page = page
    this.setClassData(query)
  }, onShareAppMessage: function () {
    let data = this.data, query = data.query
    return { title: '', desc: '', path: '/pages/login/login', imageUrl: '/imgs/accredit/pic2.jpg' }
  }
})