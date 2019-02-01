// pages/growthDiaryDetails/growthDiaryDetails.js
const app = getApp()
let util = require('../../utils/util.js');
let myDate = new Date(); //获取系统当前时间
let currentDate = myDate.toLocaleDateString(); //获取当前日期

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: currentDate
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    
    if (!!options.id) {
      this.getDetailData(options.id)
    }
  },

  getDetailData:function(id){
    let that = this;

    wx.request({
      url: app.globalData.url + '/GrowthDiary/GetGrowthDiaryByID', //仅为示例，并非真实的接口地址
      data: {
        "id": id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let value = res.data.Data;

        value.Img = JSON.parse(value.Img)

        that.setData({
          id: id,
          query: value,
          headURL: app.globalData.userInfo.avatarUrl
        });
      }
    })
  },

  //长按保存图片
  handleLongPress: function () {
    let that = this;

    wx.showModal({
      title: '提示',
      content: '您要保存此图片到本地吗？',
      success: function (res) {
        if (res.confirm) {
          wx.getImageInfo({ //将获取图片的信息
            src: !!that.data.query.Img[0] ? that.data.query.Img[0].url : '/imgs/accredit/pic4.jpg',// 需要下载的图片
            success(res) {
              var filePath = res.path //得到本地的路径
              wx.saveImageToPhotosAlbum({
                filePath: filePath,
                success(res) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                  })
                }
              })
            }
          })
        } else if (res.cancel) {

        }
      }
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