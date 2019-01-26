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
    noticeDis: true
  },
  onLoad: function (options) {
    let noticeDis = this.data.noticeDis;

    // 页面初始化 options为页面跳转所带来的参数
    wx.hideShareMenu()

    if (!!noticeDis) {
      this.noticeData();
    }else{
      this.initEleWidth();
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
      success: function (res) {
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
          success: function (res) {
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
  
  //输入清单名称
  detailedName: function(e){
    let detailedList = this.data.detailedList,
      index = e.target.dataset.index;

    detailedList[index].Name = e.detail.value
    
    this.setData({
      detailedList: detailedList
    })
  },
  
  //修改清单明细
  editDetails: function (e) {
    let id = e.target.dataset.item.ID,
      name = e.target.dataset.item.Name;

    wx.navigateTo({
      url: '../addDetailedDetails/addDetailedDetails?id=' + id + '&name=' + name
    })
  },

  //新增清单名
  addNewDetailed: function(){
    let detailedList = this.data.detailedList

    detailedList.push({})

    this.setData({
      noClassDis2: 'none',
      haveClassDis2: 'block',
      detailedList: detailedList
    })
  },

  //完成
  saveInfo: function(e){
    let that = this,
      id = e.target.dataset.item.ID,
      name = e.target.dataset.item.Name;

    if (!name) {
      wx.showToast({
        title: '请填写清单名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (!id) {
      wx.request({
        url: app.globalData.url + '/MemorandumGroup/Add', //仅为示例，并非真实的接口地址
        data: {
          "OpenID": app.globalData.openID,
          "Name": name
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (!res.data.Status) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            return
          }
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          that.detailedListData();
        }
      })
    } else {
      wx.request({
        url: app.globalData.url + '/MemorandumGroup/Update', //仅为示例，并非真实的接口地址
        data: {
          "OpenID": app.globalData.openID,
          "Name": name,
          "ID": id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (!res.data.Status) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            return
          }
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          that.detailedListData();
        }
      })
    }
  },

  //删除整个清单
  delItem: function(e){
    let that = this,
      id = e.target.dataset.item.ID,
      name = e.target.dataset.item.Name;

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/MemorandumGroup/Delete', //仅为示例，并非真实的接口地址
            data: {
              "id": id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              if (!res.data.Status) {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
                return
              }
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 1000,
                mask: true
              })
              that.detailedListData();
            }
          })
        } else if (res.cancel) {

        }
      }
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

    this.initEleWidth();

    this.detailedListData();
  },

  // 开始滑动事件
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置 
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var that = this;

    if (e.touches.length == 1) {
      //手指移动时水平方向位置 
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值 
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      // var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变 
        // txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离 
        // txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度 
          // txtStyle = "left:-" + delBtnWidth + "px";
        }
      }

    }
  },
  // 滑动中事件
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置 
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离 
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮 
      var txtStyle = "";
      txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";

      //获取手指触摸的是哪一项 
      var index = e.currentTarget.dataset.index;
      var detailedList = this.data.detailedList;

      detailedList[index].shows = txtStyle;

      //更新列表的状态 
      this.setData({
        detailedList: detailedList
      });
    } else {
      console.log("2");
    }
  },

  //获取元素自适应后的实际宽度 
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应 
      // console.log(scale); 
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error 
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(150);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

})