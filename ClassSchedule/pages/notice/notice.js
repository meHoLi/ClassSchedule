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
    noticeDis: true,
    hiddenmodalput: true
  },
  onLoad: function (options) {
    let noticeDis = this.data.noticeDis;

    // 页面初始化 options为页面跳转所带来的参数
    wx.hideShareMenu()


    if (!!noticeDis) {
      this.noticeData();
    }else{
      this.detailedListData();
    }
  },
  onShow() { //返回显示页面状态函数

    this.onLoad()//再次加载，实现返回上一页页面刷新
  },

  //设置备忘录数据
  noticeData: function () {
    let that = this;

    wx.request({
      url: app.globalData.url + '/Memorandum/Index', //仅为示例，并非真实的接口地址
      data: {
        "openID": app.globalData.openID,
        "startTime": currentDate.split('/').join('-') + ' 00:00:00', 
        "endTime": '2030-12-31 00:00:00'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {debugger
        let list = that.setList(res.data.Data),
          startTime = util.getDateStr(undefined, -7),
          endTime = util.getDateStr(undefined, -1);

        wx.request({
          url: app.globalData.url + '/Memorandum/Index', //仅为示例，并非真实的接口地址
          data: {
            "openID": app.globalData.openID,
            "startTime": startTime + ' 00:00:00',
            "endTime": endTime + ' 00:00:00'
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {debugger
            let pastDueList = that.setList(res.data.Data);

            wx.getSystemInfo({
              success: function (res) {
                let bodyHeight = res.windowHeight * app.globalData.pxRate - 70;

                if (!!list[0]) {
                  that.setData({
                    noClassDis: 'none',
                    haveClassDis: 'block',
                    list: list,
                    pastDueList: pastDueList,
                    bodyHeight: bodyHeight
                  });
                } else {
                  that.setData({
                    noClassDis: 'block',
                    haveClassDis: 'none',
                    list: list,
                    pastDueList: pastDueList,
                    bodyHeight: bodyHeight
                  });
                }
              }
            });
          }
        })
      }
    })
  },

  setList: function (list){
    list.map(o=>{
      o.eventTime = o.StartTime.split(' ')[0]

      return o
    })

    return list
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
  },

  //设置清单数据
  detailedListData: function(){
    let that = this;

    wx.request({
      url: app.globalData.url + '/MemorandumGroup/Index', //仅为示例，并非真实的接口地址
      data: {
        "openID": app.globalData.openID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger
        let detailedList = res.data.Data;

        wx.getSystemInfo({
          success: function (res) {
            let bodyHeight = res.windowHeight * app.globalData.pxRate - 70;

            if (!!detailedList[0]) {
              that.setData({
                noClassDis2: 'none',
                haveClassDis2: 'block',
                detailedList: detailedList,
                bodyHeight: bodyHeight
              });
            } else {
              that.setData({
                noClassDis2: 'block',
                haveClassDis2: 'none',
                detailedList: detailedList,
                bodyHeight: bodyHeight
              });
            }
          }
        });
      }
    })
  },
  //新增清单
  addNewDetailed: function(){
    this.setData({
      hiddenmodalput: false
    })
  },
  //输入清单名称
  detailedName: function(e){
    this.setData({
      detailedName: e.detail.value
    })
  },
  //取消
  handleCancel: function(){
    this.setData({
      hiddenmodalput: true,
      detailedId: '',
      detailedName: ''
    })
  },
  //确定添加
  handleConfirm: function () {
    let that = this;

    if (!that.data.detailedName){
      wx.showToast({
        title: '请填写清单名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (!that.data.detailedId){
      wx.request({
        url: app.globalData.url + '/MemorandumGroup/Add', //仅为示例，并非真实的接口地址
        data: {
          "OpenID": app.globalData.openID,
          "Name": that.data.detailedName
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          debugger
          if (!res.data.Status) {
            wx.showToast({
              title: '添加失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            return
          }
          that.setData({
            hiddenmodalput: true,
            detailedId: '',
            detailedName: ''
          })

          that.detailedListData();
        }
      })
    }else{
      wx.request({
        url: app.globalData.url + '/MemorandumGroup/Update', //仅为示例，并非真实的接口地址
        data: {
          "OpenID": app.globalData.openID,
          "Name": that.data.detailedName,
          "ID": that.data.detailedId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          debugger
          if (!res.data.Status) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            return
          }
          that.setData({
            hiddenmodalput: true,
            detailedId: '',
            detailedName: ''
          })

          that.detailedListData();
        }
      })
    }
  },
  //编辑清单名称
  editDetaileInfo: function(e){debugger
    let id = e.target.dataset.item.ID,
      name = e.target.dataset.item.Name;

    this.setData({
      hiddenmodalput:false,
      detailedId: id,
      detailedName: name
    })
  },
  //添加清单明细
  addDetailedDetails: function (e) {
    let id = e.target.dataset.item.ID,
      name = e.target.dataset.item.Name;

    wx.navigateTo({
      url: '../addDetailedDetails/addDetailedDetails?id=' + id + '&name=' + name
    })
  },

  //切换备忘录和清单
  changeToNotice: function(){
    let noticeDis = this.data.noticeDis;

    if (!!noticeDis) return

    this.setData({
      noticeDis: true
    })

    this.noticeData();    
  },
  detailedList: function(){
    let noticeDis = this.data.noticeDis

    if (!noticeDis) return

    this.setData({
      noticeDis: false
    })

    this.detailedListData();
  },


})