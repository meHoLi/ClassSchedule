// pages/commonClassList/commonClassList.js
const app = getApp()

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
      url: app.globalData.url + '/PublicCourseType/Index', 
      data: {
        openID: app.globalData.openID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {debugger
        let list = res.data.Data

        that.setData({
          list: list
        })
      }
    })
  },

  // 点击课程表
  editInfo: function (e) {
    let publicCourseType = e.currentTarget.dataset.type,
      item = e.currentTarget.dataset.item,
      name = item ? item.Name : ''
      
    wx.navigateTo({
      url: '../commonClassLogin/commonClassLogin?publicCourseTypeID=' + (publicCourseType || item.ID) + '&commonClassName=' + name
    })
  },

  // 新增孩子
  addNewClass: function () {
    wx.navigateTo({
      url: '../addNewCommonClass/addNewCommonClass?openID=' + app.globalData.openID
    })
  }

})
