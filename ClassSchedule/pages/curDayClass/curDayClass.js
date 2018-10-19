// pages/curDayClass/curDayClass.js
const app = getApp()
let util = require('../../utils/util.js');
let myDate = new Date(); //获取系统当前时间
let year = myDate.getFullYear()
let month = myDate.getMonth() + 1
let day = myDate.getDate()
let currentDate = '' + year + '-' + (month < 10 ? '0' + Number(month) : month) + '-' + (day < 10 ? '0' + Number(day) : day);//myDate.toLocaleDateString(); //获取当前日期
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

Page({ data: { timeList: timeList, timestamp: timestamp, currentDate: currentDate.split('/').join('-'), date: date, month: month, url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com', list: [], activeIndex: 0, slideOffset: 0, tabW: 0, swiperHeight: 0, page: 1, pageSize: 7, courseColors: ['#ffca7f', '#91d7fd', '#96a4f9'], bodyHeight: 0 }, onLoad: function (options) { let that = this; wx.request({ url: app.globalData.url + '/Memorandum/Index', data: { openID: app.globalData.openID, startTime: date + ' 00:00:00', endTime: '2030-12-31 00:00:00' }, header: { 'content-type': 'application/json' }, success: function (res) { let list = that.setList(res.data.Data)
that.setData({ inforList: list }); if (!!options && options.openID) { that.setTabData(options.openID) } else { that.setTabData() } } }) }, setList: function (list) { list.map(o => { o.eventTime = o.StartTime.split(' ')[0]
return o })
return list }, onShow() { let that = this, query = this.data.query 
wx.request({ url: app.globalData.url + '/Memorandum/Index', data: { openID: app.globalData.openID, startTime: date + ' 00:00:00', endTime: '2030-12-31 00:00:00' }, header: { 'content-type': 'application/json' }, success: function (res) { let list = that.setList(res.data.Data)
that.setData({ inforList: list }); that.setTabData(undefined, query) } }) }, tabClick: function (e) { var that = this; var childrenID = e.currentTarget.dataset.id; var idIndex = e.currentTarget.id; var offsetW = e.currentTarget.offsetLeft; var query = { childrenID: childrenID, page: 1, "pageSize": that.data.pageSize }
this.setData({ childrenID: childrenID, activeIndex: idIndex, slideOffset: offsetW }); that.setClassData(query) }, bindChange: function (e) { var current = e.detail.current; var curNameList = this.data.nameList[current]
var query = { "childrenID": curNameList.ID, "page": 1, "pageSize": this.data.pageSize }
if ((current + 1) % 4 == 0) { } var offsetW = current * mtabW; this.setData({ activeIndex: current, slideOffset: offsetW }); this.setClassData(query) }, changeDay: function (e) { 
let date = e.currentTarget.dataset.time, query = this.data.query, dateList = this.data.dateList, item = e.currentTarget.dataset.item, index = e.currentTarget.dataset.index, month = Number(date.split('-')[1])
dateList.map((o, dateIndex) => { if (o.className.indexOf('isToday') == -1) { if (dateIndex == index) { o.className = 'selectDay' } else { o.className = '' } } return o })
this.setData({ dateList: dateList, month: month })
this.setClassBodyData(query, date) }, setTabData: function (openID, query) { let that = this 
wx.request({ url: that.data.url + '/Children/Index', data: { openID: !!openID ? openID : app.globalData.openID }, header: { 'content-type': 'application/json' }, success: function (res) { let nameList = res.data.Data, activeIndex = that.data.activeIndex 
if (!!query) { let item = nameList.filter(o => { return o.ID == query.childrenID })
if (!item[0]) { query = { "childrenID": nameList[0].ID, "page": that.data.page, "pageSize": that.data.pageSize }
activeIndex = 0 } } else { query = { "childrenID": nameList[0].ID, "page": that.data.page, "pageSize": that.data.pageSize }
activeIndex = 0 } that.setData({ nameList: nameList, activeIndex: activeIndex })
that.setClassData(query) } }) }, setClassData: function (query) { let that = this 
wx.request({ url: that.data.url + '/Course/Index', data: query, header: { 'content-type': 'application/json' }, success: function (res) { let dateList = res.data.Data
 dateList = that.setDateList(dateList)
 let month = Number(dateList[0].StartTime.split('-')[1])
 that.setData({ dateList: dateList, month: month })
 that.setClassBodyData(query) } }) }, setClassBodyData: function (query, date) { let that = this, startDate = (date ? date : that.data.date) + ' 00:00:00', endDate = (date ? date : that.data.date) + ' 23:59:59'
 wx.request({ url: that.data.url + '/Course/GetChildrenCourseByDate', data: { childrenID: query.childrenID, startTime: startDate, endTime: endDate }, header: { 'content-type': 'application/json' }, success: function (res) { let tableList = setDataLocation(res.data.Data); wx.getSystemInfo({ success: function (res) { mtabW = (res.windowWidth - 20 - 8) / 3; hSwiper = res.windowHeight - 10 - 28 
 bodyH = res.windowHeight - 10 - 28 - 30 - 55 - 60 - 8 
 that.setData({ noClassDis: !!tableList[0] ? 'none' : 'block', haveClassDis: !!tableList[0] ? 'block' : 'none', tableList: tableList, date: date ? date : that.data.date, page: query.page, query: query, childrenID: query.childrenID, tabW: mtabW, swiperHeight: hSwiper, bodyHeight: bodyH }) } }) } }) }, setDateList: function (dateList) { 
 let date = this.data.date, currentDate = this.data.currentDate 
 dateList.map((o, index) => { let startTimeStamp = Date.parse(o.StartTime.split('-').join('/') + " 00:00:00")
 dateList[index].className = startTimeStamp < timestamp ? 'lastDate' : (startTimeStamp > timestamp ? 'nextDate' : '')
 if (!!o.IsToday) { dateList[index].className = 'isToday' } if (o.StartTime == date && o.StartTime != currentDate) { dateList[index].className = 'selectDay' } dateList[index].curWeek = o.DayOfWeek.substr(2)
 dateList[index].curDay = o.StartTime.split('-')[2] })
 return dateList }, prevWeekHandler: function () { let query = this.data.query, page = this.data.page - 1 
 query.page = page 
 this.setClassData(query) }, nextWeekHandler: function () { let query = this.data.query, page = this.data.page + 1 
 query.page = page 
 this.setClassData(query) }, addNewAgenda: function (e) { let childrenID = this.data.childrenID, date = this.data.date 
 if (!e.currentTarget.dataset.item) { wx.navigateTo({ url: '../setAgenda/setAgenda?childrenID=' + childrenID + '&date=' + date, }) } else { wx.navigateTo({ url: '../setAgenda/setAgenda?childrenID=' + childrenID + '&date=' + date + '&ID=' + e.currentTarget.dataset.item.ID, }) } }, importClass: function () { let childrenID = this.data.childrenID 
 wx.navigateTo({ url: '../importLogin/importLogin?childrenID=' + childrenID, }) }, toNotice: function () { let that = this 
 wx.navigateTo({ url: '../notice/notice', }) }, onShareAppMessage: function () { let data = this.data, query = data.query 
 return { title: '', desc: '', path: '/pages/login/login', imageUrl: '/imgs/accredit/pic2.jpg' } } })
 function setDataLocation(list) { if (!!list) { for (let i = 0; i < list.length; i++) { let item = list[i], startTime = item.StartTime.split(' ')[1], endTime = item.EndTime.split(' ')[1], startHour = Number(startTime.split(':')[0]), startMinute = Number(startTime.split(':')[1]), endHour = Number(endTime.split(':')[0]), endMinute = Number(endTime.split(':')[1]), height = 0, marginTop = 0 
 if (endHour - startHour == 1) { height = height + 40 } else if (endHour - startHour > 1) { height = height + 40 + 40 * (endHour - startHour - 1) } height = height + (endMinute - startMinute) / 60 * 40 
 if (startHour - 0 > 0) { marginTop = 42 * (startHour + 1) } marginTop = marginTop + startMinute / 60 * 40 
 item.startTime = startTime 
 item.endTime = endTime 
 item.height = height * 2 
 item.marginTop = marginTop * 2 } return list } else { return [] } }