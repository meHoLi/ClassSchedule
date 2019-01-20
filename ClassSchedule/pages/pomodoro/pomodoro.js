// pages/pomodoro/pomodoro.js
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

Page({
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    activeIndex: 0,
    slideOffset: 0,
    tabW: 0,
    swiperHeight: 0,
    bodyHeight: 0,
    delBtnWidth: 180, //删除按钮宽度单位（rpx）
  },

  onLoad: function (options) {
    let that = this;

    wx.hideShareMenu()

    this.initEleWidth();

    if (!!options.childrenID){
      this.setData({
        childrenID: options.childrenID,
        query: {
          childrenID: options.childrenID
        }
      })

      that.setTabData({ childrenID: options.childrenID });
    }else{
      that.setTabData()
    }
  },

  onShow() { //返回显示页面状态函数
    let that = this,
      query = this.data.query

    wx.hideShareMenu()

    that.setTabData(query);
  },

  //页签切换
  tabClick: function (e) {debugger
    var that = this;
    var childrenID = e.currentTarget.dataset.id;
    var idIndex = e.currentTarget.id;
    var offsetW = e.currentTarget.offsetLeft; //2种方法获取距离文档左边有多少距离
    var query = {
      childrenID: childrenID
    }
    this.setData({
      childrenID: childrenID,
      activeIndex: idIndex,
      slideOffset: offsetW
    });

    that.setListData(query)
  },
  //页签项滑动切换
  bindChange: function (e) {
    var current = e.detail.current;
    var curNameList = this.data.nameList[current]
    var query = {
      "childrenID": curNameList.ID
    }
    if ((current + 1) % 4 == 0) {

    }
    var offsetW = current * mtabW; //2种方法获取距离文档左边有多少距离
    this.setData({
      activeIndex: current,
      slideOffset: offsetW
    });

    this.setListData(query)
  },

  //设置tab数据
  setTabData: function (query) {
    let that = this
    wx.request({
      url: that.data.url + '/Children/Index', //仅为示例，并非真实的接口地址
      data: {
        openID: app.globalData.openID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let nameList = res.data.Data,
          activeIndex = that.data.activeIndex

        if (!!query) {
          let listIndex,
            item = nameList.filter((o,index) => {
              if (o.ID == query.childrenID){
                listIndex = index
                return o
              } 
            })

          if (!item[0]) {
            query = {
              "childrenID": nameList[0].ID
            }
            activeIndex = 0
          }else {
            activeIndex = listIndex
          }
        } else {
          query = {
            "childrenID": nameList[0].ID
          }
          activeIndex = 0
        }

        that.setData({
          nameList: nameList,
          activeIndex: activeIndex
        })

        that.setListData(query)
      }
    })
  },

  setListData: function (query) {
    let that = this;

    wx.request({
      url: that.data.url + '/Clock/GetTomatoHabit', //仅为示例，并非真实的接口地址
      data: {
        childrenID: query.childrenID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let value = res.data.Data,
          haveDate = !value.todayClockList[0] && !value.mouthClockList[0] && !value.weekList[0] && !value.todayAddList[0] ? false : true,
          todayClockList = that.disposeList(value.todayClockList),
          mouthClockList = that.disposeList(value.mouthClockList),
          weekList = that.disposeList(value.weekList),
          todayAddList = that.disposeList(value.todayAddList)

        wx.getSystemInfo({
          success: function (res) {
            mtabW = (res.windowWidth - 20 - 8) / 3; //设置tab的宽度
            hSwiper = res.windowHeight - 10 - 34 - 28
            bodyH = res.windowHeight - 10 - 34 - 28 - 130

            that.setData({
              query: query,
              childrenID: query.childrenID,
              haveDate: haveDate,
              todayClockList: todayClockList,
              mouthClockList: mouthClockList,
              weekList: weekList,
              todayAddList: todayAddList,
              tabW: mtabW,
              swiperHeight: hSwiper,
              bodyHeight: bodyH
            })
          }
        });

      }
    })
  },

  //处理列表数据
  disposeList: function (list) {
    list = list.map((o, index) => {
      let percent = o.ExecutedNum / o.ExecuteNum * 100

      o.percent = percent

      return o
    })

    return list
  },

  //删除打卡习惯
  delItem: function (e) {
    debugger
    let that = this,
      item = e.currentTarget.dataset.item,
      query = {
        childrenID: that.data.childrenID
      };

    wx.request({
      url: app.globalData.url + '/Clock/Delete', //仅为示例，并非真实的接口地址
      data: {
        batchID: item.BatchID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!!res.data.Status) {
          that.setListData(query)

          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        } else {
          wx.showToast({
            title: '删除失败，请稍后再试',
            icon: 'none',
            duration: 1500,
            mask: true
          })
        }

      }
    })
  },

  //倒计时
  countDown: function (e) {
    let that = this,
      item = e.currentTarget.dataset.item,
      childrenID = that.data.childrenID;

    if (item.ExecuteNum == item.ExecutedNum){
      wx.showToast({
        title: '已完成打卡',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return
    }
    wx.navigateTo({
      url: '../countDown/countDown?id=' + item.ID
    })
  },

  //新增或编辑打卡任务
  toIntegral: function (e) {
    let childrenID = this.data.childrenID

    wx.navigateTo({
      url: '../limitProject/limitProject?childrenID=' + childrenID
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
    debugger
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
      var listType = e.currentTarget.dataset.type;
      var name = listType == 'day' ? 'todayClockList' : (listType == 'week' ? 'weekList' : (listType == 'month' ? 'mouthClockList' : 'todayAddList'))
      var list = this.data[name];
      var obj = {}

      list[index].shows = txtStyle;

      obj[name] = list

      //更新列表的状态 
      this.setData(obj);
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
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

})