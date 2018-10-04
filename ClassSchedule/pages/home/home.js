// pages/home/home.js
const app = getApp()

Page({

  /** 页面的初始数据 */
  data: {
    hiddenmodalput: true,
    initChildNum: 1,
    hiddenmodalput2: true
  },

  /** 生命周期函数--监听页面加载 */
  onLoad: function(options) {
    wx.hideShareMenu()
    this.setShowModal1();
  },

  //设置弹窗的显示
  setShowModal1: function() {
    this.setData({
      hiddenmodalput: false,

    })
  },

  //确认  
  confirm: function() {
    let childNum = this.data.initChildNum

    if (!childNum) {
      wx.showToast({
        title: '请先设置孩子数量',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      let childNum = this.data.initChildNum,
        childList = []
      for (let i = 0; i < childNum; i++) {
        childList.push(i + 1)
      }
      this.setData({
        hiddenmodalput: true,
        hiddenmodalput2: false,
        childList: childList
      })
    }
  },
  //输入孩子数量
  setChildNum: function(e) {
    this.setData({
      initChildNum: e.detail.value
    })
  },
  //减
  minus: function() {
    let childNum = this.data.initChildNum

    childNum = childNum - 1
    childNum = childNum <= 0 ? 1 : childNum

    this.setData({
      initChildNum: childNum
    })
  },
  //加
  plus: function() {
    let childNum = this.data.initChildNum

    childNum = childNum + 1

    this.setData({
      initChildNum: childNum
    })
  },

  //设置孩子姓名
  setChildName: function(e) {
    let childNum = this.data.initChildNum,
      childNameList = !!this.data.childNameList ? this.data.childNameList : []

    childNameList[e.currentTarget.dataset.index] = { "OpenID": app.globalData.openID,"name":e.detail.value}

    this.setData({
      childNameList: childNameList
    })
  },

  //确认  
  confirm2: function() {
    let childNameList = this.data.childNameList,
      childNum = this.data.initChildNum

    if (!childNameList || childNameList.length != childNum) {
      wx.showToast({
        title: '请先设置完全孩子姓名',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      wx.request({
        url: app.globalData.url + '/Children/AddList', //仅为示例，并非真实的接口地址
        data: {
          modelList: JSON.stringify(childNameList)
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {

          if (!!res.data.Status){
            wx.switchTab({ //跳转到tabBar页面，并关闭其他所有tabBar页面
              url: "/pages/curDayClass/curDayClass"//"/pages/calendar/calendar"
            })
          }
        }
      })

      this.setData({
        hiddenmodalput2: true,
        childNameList: childNameList
      })
    }
  }

})