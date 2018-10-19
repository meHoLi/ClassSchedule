// pages/settings/settings.js
const app = getApp()

Page({
  data: {
    delBtnWidth: 180
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // wx.hideShareMenu()

    // this.initEleWidth();
    this.tempData();
  },
  onShow() { //返回显示页面状态函数
    // wx.hideShareMenu()
    
    this.onLoad()//再次加载，实现返回上一页页面刷新
  },
  
  //设置数据
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
  
  // 编辑孩子
  editInfo: function (e) {
    let item = e.target.dataset.item;
      
    wx.navigateTo({
      url: '../addNewClass/addNewClass?id=' + item.ID + '&openID=' + app.globalData.openID
    })
  },

  // 新增孩子
  addNewClass: function() {
    wx.navigateTo({
      url: '../addNewClass/addNewClass?openID=' + app.globalData.openID
    })
  },

  // 公共课程表
  commonClass: function(){
    wx.navigateTo({
      url: '../commonClassList/commonClassList'
    })
  },
  // 帮助
  help: function(){
    wx.navigateTo({
      url: '../usingHelp/usingHelp'
    })
  },

  //分享
  onShareAppMessage: function () {
    let data = this.data,
      query = data.query

    return {
      title: '',
      desc: '',
      path: '/pages/login/login',
      imageUrl: '/imgs/accredit/pic2.jpg'
    }
  }
})