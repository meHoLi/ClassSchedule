// pages/clockProject/clockProject.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    wx.hideShareMenu()

    if (!!options && options.childrenID) {
      that.setDataList(options.childrenID);
    } else {
      that.setDataList();
    }
  },

  setDataList: function (childrenID){
    let that = this;

    wx.request({
      url: that.data.url + '/ClockProject/Index', //仅为示例，并非真实的接口地址
      data: {
        childrenID: childrenID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {debugger
        console.log(res)
        let value = res.data.Data,
          type1List = value.filter(o=>{
            return o.Type == 1
          }),
          type2List = value.filter(o => {
            return o.Type == 2
          }),
          type3List = value.filter(o => {
            return o.Type == 3
          })

        wx.getSystemInfo({
          success: function (res) {
            let itemW = (res.windowWidth - 20 - 20 - 10) / 4;
 
            that.setData({
              childrenID: childrenID,
              type1List: type1List,
              type2List: type2List,
              type3List: type3List,
              itemW: itemW
            })
          }
        });
      }
    })
  },

  addClock: function(){
    let childrenID = this.data.childrenID
    
    wx.navigateTo({
      url: '../setClock/setClock?childrenID=' + childrenID
    })
  },

  setClock: function(e){debugger
    let childrenID = this.data.childrenID,
      item = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: '../setClock/setClock?childrenID=' + childrenID + '&projectId=' + item.ID
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
    let that = this;

    wx.hideShareMenu()
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