// pages/countDown/countDown.js
const app = getApp();

let myTimer = null;

function formatTime(time) {
  time = Math.floor(time / 1000)
  const minute = Math.floor(time / 60)
  const second = time % 60
  return (minute < 10 ? '0' : '') + minute + (second < 10 ? ':0' : ':') + second
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',

    progress_txt: '', 
    initNum: 0,
    currentNum: 0,
    resetTime: 0,

    isRunning: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    wx.request({
      url: that.data.url + '/Clock/GetClockByID', //仅为示例，并非真实的接口地址
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let value = res.data.Data

        that.setData({
          details: value,
          name: value.Name,
          progress_txt: value.LimitedTime < 10 ? '0' + value.LimitedTime + ':00' : value.LimitedTime + ':00',
          initNum: value.LimitedTime * 60 * 1000,
          currentNum: value.LimitedTime * 60 * 1000,
          resetTime: 0
        })
        
        that.timer();
      }
    });

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
    // if (myTimer != null) {
    //   clearInterval(myTimer);
    //   myTimer = null;
    // }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (myTimer != null) {
      clearInterval(myTimer);
      myTimer = null;
    }
  },

  //定时器
  timer: function(){
    let data = this.data,
      initNum = data.initNum,
      resetTime = data.resetTime,
      currentNum = data.currentNum;

    myTimer = setInterval(() => {
      currentNum = currentNum - 1000
      resetTime = resetTime + 1000

      if (currentNum <= 0) {
        this.drawCircle(2) 
        this.setData({
          currentNum: 0,
          progress_txt: '00:00',
          resetTime: resetTime,
        })
      } else {
        this.drawCircle(resetTime / initNum * 2) 
        this.setData({
          currentNum: currentNum,
          progress_txt: formatTime(currentNum),
          resetTime: resetTime
        })
      }
    }, 1000)
  },

  //暂停
  pauseCount: function(){
    if (myTimer != null) {
      clearInterval(myTimer);
      myTimer = null;
    }

    this.setData({
      isRunning: false
    })
  },
  //继续
  continueCount: function(){
    this.timer();

    this.setData({
      isRunning: true
    })
  },

  //未完成
  unfinished: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  //完成
  finish: function () {
    let that = this,
      details = that.data.details;

    wx.request({
      url: app.globalData.url + '/Clock/ExecuteClock', //仅为示例，并非真实的接口地址
      data: {
        id: details.ID,
        executeType: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!!res.data.Status) {
          wx.showToast({
            title: '打卡成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })

          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          // if (res.data.Result == 800) {
          //   wx.showToast({
          //     title: '已完成打卡',
          //     icon: 'none',
          //     duration: 1500,
          //     mask: true
          //   })
          //   return
          // }
          wx.showToast({
            title: '打卡失败，请稍后再试',
            icon: 'none',
            duration: 1500,
            mask: true
          })
        }

      }
    })
  },

  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(1);// 设置圆环的宽度
    ctx.setStrokeStyle('#ffffff'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    //设置一个原点(100,100)，半径为90的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    // var gradient = context.createLinearGradient(200, 100, 100, 200);
    // gradient.addColorStop("0", "#2661DD");
    // gradient.addColorStop("0.5", "#40ED94");
    // gradient.addColorStop("1.0", "#5956CC");

    context.setLineWidth(4);
    context.setStrokeStyle('#ffffff');
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(110, 110, 100, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawProgressbg();
    this.drawCircle(0) 
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