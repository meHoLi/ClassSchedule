// pages/notice/notice.js
const app = getApp()
let util = require('../../utils/util.js');
let myDate = new Date(); //获取系统当前时间
let year = myDate.getFullYear()
let month = myDate.getMonth() + 1
let day = myDate.getDate()
let currentDate = '' + year + '-' + (month < 10 ? '0' + Number(month) : month) + '-' + (day < 10 ? '0' + Number(day) : day)//myDate.toLocaleDateString(); //获取当前日期

Page({
  data: {
    
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.hideShareMenu()

    this.tempData();
  },
  onShow() { //返回显示页面状态函数
    this.onLoad()//再次加载，实现返回上一页页面刷新
  },

  //设置数据
  tempData: function () {
    let that = this;

    wx.request({
      url: app.globalData.url + '/Memorandum/Index', //仅为示例，并非真实的接口地址
      data: {
        openID: app.globalData.openID,
        startTime: currentDate.split('/').join('-') + ' 00:00:00', 
        endTime: '2030-12-31 00:00:00'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let list = res.data.Data

        if (!!list[0]) {
          that.setData({
            noClassDis: 'none',
            haveClassDis: 'block',
            list: list
          });
        } else {
          that.setData({
            noClassDis: 'block',
            haveClassDis: 'none',
            list: list
          });
        }
      }
    })
  },

  editInfo: function (e) {
    let id = e.target.dataset.item.ID;

    wx.navigateTo({
      url: '../addNewNotice/addNewNotice?id=' + id
    })
  },

  addNewNotice: function () {
    wx.navigateTo({
      url: '../addNewNotice/addNewNotice'
    })
  }
})