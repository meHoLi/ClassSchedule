// pages/settings/settings.js
const app = getApp()

Page({
  data: {
    delBtnWidth: 180
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.hideShareMenu()

    this.initEleWidth();
    this.tempData();
  },
  onShow() { //返回显示页面状态函数
    this.onLoad()//再次加载，实现返回上一页页面刷新
  },
  // touchS: function(e) {
  //   if (e.touches.length == 1) {
  //     this.setData({
  //       //设置触摸起始点水平方向位置
  //       startX: e.touches[0].clientX
  //     });
  //   }
  // },

  // touchM: function(e) {
  //   if (e.touches.length == 1) {
  //     //手指移动时水平方向位置
  //     var moveX = e.touches[0].clientX;

  //     //手指起始点位置与移动期间的差值
  //     var disX = this.data.startX - moveX;
  //     var delBtnWidth = this.data.delBtnWidth;
  //     var txtStyle = "";

  //     if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
  //       txtStyle = "left:0px";
  //     }else if(disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
  //       txtStyle = "left:-" + disX + "px";

  //       if (disX >= delBtnWidth) {
  //         //控制手指移动距离最大值为删除按钮的宽度
  //         txtStyle = "left:-" + delBtnWidth + "px";
  //       }
  //     }

  //     //获取手指触摸的是哪一项
  //     var index = e.target.dataset.index;
  //     var list = this.data.list;

  //     list[index].txtStyle = txtStyle;

  //     //更新列表的状态
  //     this.setData({
  //       list: list
  //     });
  //   }
  // },

  // touchE: function(e) {
  //   if (e.changedTouches.length == 1) {
  //     //手指移动结束后水平位置
  //     var endX = e.changedTouches[0].clientX;

  //     //触摸开始与结束，手指移动的距离
  //     var disX = this.data.startX - endX;
  //     var delBtnWidth = this.data.delBtnWidth;

  //     //如果距离小于删除按钮的1/2，不显示删除按钮
  //     var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      
  //     //获取手指触摸的是哪一项
  //     var index = e.target.dataset.index;
  //     var list = this.data.list;

  //     list[index].txtStyle = txtStyle;

  //     //更新列表的状态
  //     this.setData({
  //       list: list
  //     });
  //   }
  // },

  //获取元素自适应后的实际宽度
  getEleWidth: function(w) {
    var real = 0;

    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应
      // console.log(scale);

      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },

  initEleWidth: function() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);

    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  //点击删除按钮事件
  // delItem: function(e) {
  //   let item = e.target.dataset.item,
  //     that = this;

  //   wx.request({
  //     url: app.globalData.url + '/Children/Delete', //仅为示例，并非真实的接口地址
  //     data: {
  //       id: item.ID
  //     },
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     success: function (res) {
  //       that.tempData();
  //     }
  //   })
  // },

  //测试临时数据
  tempData: function() {
    // var list = [{txtStyle: "",headUrl: "/imgs/head/head.png",txt: "向左滑动可以删除"}];
    let that = this;

    wx.request({
      url: app.globalData.url + '/Children/Index', //仅为示例，并非真实的接口地址
      data: {
        openID: app.globalData.openID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        
        console.log(res)
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
        that.setData({
          list: list
        })
      }
    })
  },
  
  editInfo: function (e) {
    let item = e.target.dataset.item;
      
    wx.navigateTo({
      url: '../addNewClass/addNewClass?id=' + item.ID + '&openID=' + app.globalData.openID
    })
  },

  addNewClass: function() {
    wx.navigateTo({
      url: '../addNewClass/addNewClass?openID=' + app.globalData.openID
    })
  }
})