// pages/addNewNotice/addNewNotice.js
const app = getApp()
var util = require('../../utils/util.js');
var myDate = new Date(); //获取系统当前时间
let year = myDate.getFullYear()
let month = myDate.getMonth() + 1
let day = myDate.getDate()
let currentDate = '' + year + '-' + (month < 10 ? '0' + Number(month) : month) + '-' + (day < 10 ? '0' + Number(day) : day)//myDate.toLocaleDateString(); //获取当前日期

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    dates: currentDate.split('/').join('-'),//currentDate,
    currentDate: currentDate,
    remark: ''//备注
  },
  onLoad: function (options) {
    let that = this;

    wx.hideShareMenu()

    if (!!options.id) {
      that.setRemark(options)
    }
  },

  //点击日期组件确定事件  
  bindDateChange: function (e) {
    this.setData({
      dates: e.detail.value
    })
  },

  //录入备注
  setRemarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  //取消
  cancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //删除
  del: function () {
    let id = this.data.id,
      that = this;

    if (!id) return

    wx.request({
      url: that.data.url + '/Memorandum/Delete', //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        let data = res.data.Data

        that.setData({
          ID: null,
          dates: currentDate.split('/').join('-'),
          remark: ''
        })

        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  },
  //保存
  save: function (e) {
    let that = this,
      data = this.data,
      query = {
        Id: data.id,
        openID: app.globalData.openID,
        startTime: data.dates+' 00:00:00',
        endTime: data.dates + ' 23:59:59',
        MemorandumContent: data.remark,
        RemindTime: 0
      }

    if (!query.MemorandumContent) {
      wx.showToast({
        title: '请填写事项',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (!!data.id) {
      wx.request({
        url: that.data.url + '/Memorandum/Update',
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.Result == '500') {
            wx.showToast({
              title: '当前服务器异常，请稍后再试',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            return
          }

          // wx.navigateBack({
          //   delta: 1
          // })

          wx.request({
            url: that.data.url + '/WeChatAppAuthorize/GetToken',
            data: {},
            success: function (res) {
              
              let data = JSON.parse(res.data.Data)

              if (that.data.RemindTime != '-9999') {
                that.setInfoTemplate(e.detail.formId, data.access_token)
                
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      })
    } else {
      wx.request({
        url: that.data.url + '/Memorandum/Add', //仅为示例，并非真实的接口地址
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.Result == '500') {
            wx.showToast({
              title: '当前服务器异常，请稍后再试',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            return
          }

          // wx.navigateBack({
          //   delta: 1
          // })

          wx.request({
            url: that.data.url + '/WeChatAppAuthorize/GetToken',
            data: {},
            success: function (res) {

              let data = JSON.parse(res.data.Data)

              if (that.data.RemindTime != '-9999') {
                that.setInfoTemplate(e.detail.formId, data.access_token)

                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      })
    }
  },

  //设置消息提醒模板
  setInfoTemplate: function (formId, access_token) {
    var that = this;
    var openId = app.globalData.openID;
    var messageDemo = {
      touser: openId,//openId   
      template_id: '4EB4NYbFc6hvSyEofy3kKeYhBejiyJ1nEOpw_D9oCm0',//模板消息id， 
      page: 'pages/login/login',//点击详情时跳转的主页 
      form_id: formId,//formId
      data: {//下面的keyword*是设置的模板消息的关键词变量  
        "keyword1": {
          "value": this.data.remark
        },
        "keyword2": {
          "value": this.data.dates
        }
      }
    }

    wx.request({
      url: that.data.url + '/WeChatAppAuthorize/SendMsgAsync',
      data: {
        accessToken: access_token,
        data: messageDemo,
        StartTime: that.data.dates + ' 00:00:00',
        RemindTime: 0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function (err) {
        console.log("push err")
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },

  //初始化查询数据
  setRemark: function (options) {
    let that = this

    wx.request({
      url: that.data.url + '/Memorandum/GetMemorandumByID', //仅为示例，并非真实的接口地址
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let data = res.data.Data

        that.setData({
          id: data.ID,
          dates: data.StartTime.split(' ')[0],
          remark: data.MemorandumContent
        })
      }
    })
  }

})