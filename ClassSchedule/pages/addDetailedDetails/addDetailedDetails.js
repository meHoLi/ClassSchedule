// pages/addDetailedDetails/addDetailedDetails.js
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

    this.initEleWidth();

    if (!!options.id){
      this.setData({
        id:options.id,
        name:options.name
      })
    }
    this.detailedListData();
  },
  onShow() { //返回显示页面状态函数

    if (!!this.id){
      this.onLoad()//再次加载，实现返回上一页页面刷新
    }
  },

  //设置清单数据
  detailedListData: function () {
    let that = this;

    wx.request({
      url: app.globalData.url + '/Memorandum/GetListByGroupID', //仅为示例，并非真实的接口地址
      data: {
        "groupID": that.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {debugger
        let detailedList = res.data.Data;

        if (!!detailedList[0]) {
          that.setData({
            noClassDis: 'none',
            haveClassDis: 'block',
            detailedList: detailedList
          });
        } else {
          that.setData({
            noClassDis: 'block',
            haveClassDis: 'none',
            detailedList: detailedList
          });
        }
      }
    })
  },

  //编辑清单名称
  editDetaileInfo: function (e) {
    let detailedList = this.data.detailedList,
      index = e.target.dataset.index;

    detailedList[index].MemorandumContent = e.detail.value

    this.setData({
      detailedList: detailedList
    })
  },

  //删除单条清单明细
  delItem: function (e) {
    let that = this,
      id = e.target.dataset.item.ID,
      name = e.target.dataset.item.Name;

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/Memorandum/Delete', //仅为示例，并非真实的接口地址
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

  //保存
  saveDetaileInfo: function (e) {
    let that = this,
      id = e.target.dataset.item.ID,
      memorandumContent = e.target.dataset.item.MemorandumContent;;

    if (!memorandumContent) {
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
        url: app.globalData.url + '/Memorandum/Add', //仅为示例，并非真实的接口地址
        data: {
          groupID: that.data.id,
          OpenID: app.globalData.openID,
          MemorandumContent: memorandumContent,
          Type: 2
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
        url: app.globalData.url + '/Memorandum/Update', //仅为示例，并非真实的接口地址
        data: {
          groupID: that.data.id,
          OpenID: app.globalData.openID,
          MemorandumContent: memorandumContent,
          Id: id,
          Type: 2
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

  //新增清单明细
  addNewDetailed: function () {
    let detailedList = this.data.detailedList

    detailedList.push({})

    this.setData({
      noClassDis: 'none',
      haveClassDis: 'block',
      detailedList: detailedList
    })
  },

  //删除整个清单
  delAllDetailed: function(){
    let that = this;

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/MemorandumGroup/Delete', //仅为示例，并非真实的接口地址
            data: {
              "id": that.data.id
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

              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
        } else if (res.cancel) {

        }
      }
    })
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