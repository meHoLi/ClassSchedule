// pages/setAgenda/setAgenda.js
const app = getApp()
var util = require('../../utils/util.js');
var myDate = new Date(); //获取系统当前时间
var currentDate = myDate.toLocaleDateString(); //获取当前日期
var timestamp = new Date().getTime();//当前日期时间戳

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    date: '',//currentDate,

    className: '', //课程名称
    schoolName: '', //学校名称

    startTime: '07:00', //开始时间
    endTime: '08:00', //结束时间

    address: '', //地址
    teacher: '', //老师姓名
    phone: '', //联系方式

    //提醒时间
    remind: ['无', '准时', '提前十分钟', '提前半小时', '提前两小时', '提前一天'],
    remindList: [{
        id: 0,
        name: '无',
        time: '-9999'
      },
      {
        id: 1,
        name: '准时',
        time: '0'
      },
      {
        id: 2,
        name: '提前十分钟',
        time: '10'
      },
      {
        id: 3,
        name: '提前半小时',
        time: '30'
      },
      {
        id: 4,
        name: '提前两小时',
        time: '120'
      },
      {
        id: 5,
        name: '提前一天',
        time: '1440'
      }
    ],
    remindValue: 0,
    RemindTime: '-9999',

    remark: '', //备注
    isShowEditBtn: true
  },
  onLoad: function(options) {debugger
    let that = this;

    wx.hideShareMenu()

    if (!!options.ID) {
      that.setAgendaData(options)
    } else {
      let classTime = options.date.split('-').join('/') + ' ' + this.data.StartTime,
        classTimestamp = Date.parse(classTime) 

      console.log(classTimestamp > timestamp || classTimestamp == timestamp ? true : false)
      that.setData({
        date: options.date,
        childrenID: options.childrenID,
        isShowEditBtn: classTimestamp > timestamp || classTimestamp == timestamp ? true : false
      })
    }
  },

  //录入课程
  setClassNameInput: function(e) {
    this.setData({
      className: e.detail.value
    })
  },
  //录入学校
  setSchoolNameInput: function(e) {
    this.setData({
      schoolName: e.detail.value
    })
  },
  //点击开始时间组件确定事件  
  bindStartTimeChange: function(e) {
    let startTime = e.detail.value,
      strtHour = Number(startTime.split(':')[0]) + 1,
      endTime = strtHour < 10 ? '0' + strtHour + ':00' : (strtHour == 24 ? '23:59' : strtHour + ':00'),
      classTime = this.data.date.split('-').join('/') + ' ' + startTime,
      classTimestamp = Date.parse(classTime)

    this.setData({
      startTime: e.detail.value,
      endTime: endTime,
      isShowEditBtn: classTimestamp > timestamp || classTimestamp == timestamp ? true : false
    })
  },
  //点击结束时间组件确定事件  
  bindEndTimeChange: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  //录入地址
  setAddressInput: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  //录入老师
  setTeacherInput: function(e) {
    this.setData({
      teacher: e.detail.value
    })
  },
  //录入联系方式
  setTelPhoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //选择提醒方式
  bindPickerChange: function(e) {
    let time = this.data.remindList[e.detail.value].time

    this.setData({
      remindValue: e.detail.value,
      RemindTime: time
    })
  },
  //录入备注
  setRemarkInput: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  //取消
  cancel: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  //删除
  del: function(){
    let ID = this.data.ID,
      that = this;

    wx.request({
      url: that.data.url + '/Course/Delete', //仅为示例，并非真实的接口地址
      data: {
        id: ID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger
        let data = res.data.Data

        that.setData({
          ID: null,
          className: '', //课程名称
          schoolName: '', //学校名称
          startTime: '07:00', //开始时间
          endTime: '08:00', //结束时间
          address: '', //地址
          teacher: '', //老师姓名
          phone: '', //联系方式
          remindValue: 0,
          RemindTime: '-9999',
          remark: '' //备注
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
  save: function(e) {debugger
    let that = this,
      data = this.data,
      query = {
        ID: data.ID,
        ChildrenID: data.childrenID,
        CourseName: data.className,
        SchoolName: data.schoolName,
        StartTime: data.date + ' ' +data.startTime,
        EndTime: data.date + ' ' +data.endTime,
        Address: data.address,
        Teacher: data.teacher,
        Phone: data.phone,
        RemindTime: data.RemindTime,
        Remarks: data.remark
      }
    
    if (!query.CourseName){
      wx.showToast({
        title: '请填写课程名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    } else if (!query.SchoolName) {
      wx.showToast({
        title: '请填写学校名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (!!data.ID) {
      wx.request({
        url: that.data.url + '/Course/Update',
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.Result == '800') {
            wx.showToast({
              title: '当前时间已经有其他安排，请重新选择时间',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            return
          } else if (res.data.Result == '500') {
            wx.showToast({
              title: '当前服务器异常，请稍后再试',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            return
          }

          wx.navigateBack({
            delta: 1
          })

          // wx.request({
          //   url: that.data.url + '/WeChatAppAuthorize/GetToken',
          //   data: {},
          //   success: function (res) {
          //     debugger
          //     let data = JSON.parse(res.data.Data)

          //     if (that.data.RemindTime != '-9999') {
          //       that.setInfoTemplate(e.detail.formId, data.access_token)
          //     } else {
          //       wx.navigateBack({
          //         delta: 1
          //       })
          //     }
          //   }
          // })
        }
      })
    } else {
      wx.request({
        url: that.data.url + '/Course/Add', //仅为示例，并非真实的接口地址
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.Result == '800'){
            wx.showToast({
              title: '当前时间已经有其他安排，请重新选择时间',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            return
          } else if (res.data.Result == '500'){
            wx.showToast({
              title: '当前服务器异常，请稍后再试',
              icon: 'none',
              duration: 1500,
              mask: true
            })
            return
          }

          wx.request({
            url: that.data.url + '/WeChatAppAuthorize/GetToken',
            data: {},
            success: function (res) {
              debugger
              let data = JSON.parse(res.data.Data)
              
              if (that.data.RemindTime != '-9999'){
                that.setInfoTemplate(e.detail.formId, data.access_token)

                wx.navigateBack({
                  delta: 1
                })
              }else{
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
  setInfoTemplate: function (formId, access_token){
    var that = this;
    var openId = app.globalData.openID;
    var messageDemo = {
      touser: openId,//openId   
      template_id: '1fubB0p5PAMlP_o5P1R93-35W_TCa2plZTpPogGn87w',//模板消息id，  
      // page: 'pages/setAgenda/setAgenda?childrenID=' + this.data.childrenID + '&date=' + this.data.date + '&ID=' + this.data.ID,//点击详情时跳转的主页
      form_id: formId,//formId
      data: {//下面的keyword*是设置的模板消息的关键词变量  
        "keyword1": {
          "value": this.data.date + ' ' + this.data.startTime
        },
        "keyword2": {
          "value": this.data.className
        },
        "keyword3": {
          "value": this.data.teacher
        },
        "keyword4": {
          "value": this.data.address
        }
      }
    }

    wx.request({
      url: that.data.url + '/WeChatAppAuthorize/SendMsgAsync',
      data: {
        accessToken: access_token,
        data: messageDemo,
        StartTime: that.data.date + ' ' + that.data.startTime + ':00',
        RemindTime: that.data.RemindTime
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
  setAgendaData: function (options) {
    let that = this

    wx.request({
      url: that.data.url + '/Course/GetCourseByID', //仅为示例，并非真实的接口地址
      data: {
        id: options.ID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {debugger
        let data = res.data.Data,
          remindList = that.data.remindList,
          remindItem = remindList.filter(o =>{return o.time == data.RemindTime}),
          classTime = options.date.split('-').join('/') + ' ' + data.StartTime.split(' ')[1],
          classTimestamp = Date.parse(classTime) 
        
        that.setData({
          date: options.date,
          childrenID: options.childrenID,
          ID: options.ID,
          className: data.CourseName, //课程名称
          schoolName: data.SchoolName, //学校名称
          startTime: data.StartTime.split(' ')[1], //开始时间
          endTime: data.EndTime.split(' ')[1], //结束时间
          address: data.Address ? data.Address : '', //地址
          teacher: data.Teacher ? data.Teacher : '', //老师姓名
          phone: data.Phone ? data.Phone : '', //联系方式
          remindValue: remindItem[0].id,//提醒
          RemindTime: data.RemindTime,//提醒
          remark: !!data.Remarks ? data.Remarks : '',//备注
          isShowEditBtn: classTimestamp > timestamp || classTimestamp == timestamp ? true : false
        })
      }
    })
  }

})