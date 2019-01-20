// pages/treasureChest/treasureChest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      { 
        picUrl: '/imgs/accredit/noticeLogo.png',
        goToUrl: '/pages/notice/notice',
        name:'备忘录'
      }, {
        picUrl: '/imgs/accredit/growthMemory.png',
        goToUrl: '/pages/growthDiary/growthDiary',
        name: '成长日记'
      }, {
        picUrl: '/imgs/accredit/tomato.png',
        goToUrl: '/pages/pomodoro/pomodoro',
        name: '番茄钟'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    wx.getSystemInfo({
      success: function (res) {
        let itemW = (res.windowWidth - 20 - 20 - 20) / 3;

        that.setData({
          itemW: itemW
        })
      }
    });

  },

  //跳转页面
  editInfo: function(e){
    let item = e.target.dataset.item;

    wx.navigateTo({
      url: item.goToUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})