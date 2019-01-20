// pages/setAgenda/setAgenda.js
const app = getApp()
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()// 获取**全局唯一**的语音识别管理器**recordRecoManager**
let util = require('../../utils/util.js');
let myDate = new Date(); //获取系统当前时间
let currentDate = myDate.toLocaleDateString(); //获取当前日期
let timestamp = new Date().getTime();//当前日期时间戳

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    date: '',//currentDate,

    CourseName: '', //课程名称
    SchoolName: '', //学校名称

    StartTime: '07:00', //开始时间
    EndTime: '08:00', //结束时间

    //课程频率
    frequency: ['仅今天', '每天这个时段', '每周这个时段'],
    frequencyList: [
      {
        id: 1,
        name: '仅今天'
      },
      {
        id: 2,
        name: '每天这个时段'
      },
      {
        id: 3,
        name: '每周这个时段'
      }
    ],
    frequencyValue: 0,
    frequencyId: 1,

    //课程类型
    typeD: ['学校正课 ', '课外班', '其他'],
    typeList: [
      {
        id: 1,
        name: '学校正课'
      },
      {
        id: 2,
        name: '课外班'
      },
      {
        id: 3,
        name: '其他'
      }
    ],
    typeValue: 0,
    typeId: 1,

    Address: '', //地址
    Teacher: '', //老师姓名
    Phone: '', //联系方式

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

    Remarks: '', //备注
    isShowEditBtn: true,

    voiceURL: '../../imgs/accredit/voice.png',
    recording: false,  // 正在录音
    recordStatus: 0,
    isPopDis: false
  },
  onLoad: function(options) {
    let that = this;

    wx.hideShareMenu()

    if (!!options.isFrom && options.isFrom == 'BatchAdd'){debugger
      let classTime = options.date.split('-').join('/') + ' ' + this.data.StartTime,
        classTimestamp = Date.parse(classTime),
        classItem = JSON.parse(options.classItem)


      let remindList = that.data.remindList,
        remindItem = remindList.filter(o => { return o.time == classItem.RemindTime }),

        obj = {
          date: options.date,
          childrenID: options.childrenID,
          ID: classItem.ID,
          BatchID: classItem.BatchID,
          CourseName: classItem.CourseName ? classItem.CourseName : '', //课程名称
          SchoolName: classItem.SchoolName ? classItem.SchoolName : '', //学校名称
          StartTime: classItem.StartTime.split(' ')[1], //开始时间
          EndTime: classItem.EndTime.split(' ')[1], //结束时间
          frequencyValue: Number(classItem.Frequency) - 1,//课程频率
          frequencyId: classItem.Frequency,//课程频率id
          typeValue: Number(classItem.CourseType) - 1,//课程类型
          typeId: classItem.CourseType,//课程类型id
          Address: classItem.Address ? classItem.Address : '', //地址
          Teacher: classItem.Teacher ? classItem.Teacher : '', //老师姓名
          Phone: classItem.Phone ? classItem.Phone : '', //联系方式
          remindValue: !!remindItem[0] ? remindItem[0].id : 0,//提醒
          RemindTime: !!classItem.RemindTime ? classItem.RemindTime : -9999,//提醒
          Remarks: !!classItem.Remarks ? classItem.Remarks : '',//备注
          isShowEditBtn: classTimestamp > timestamp || classTimestamp == timestamp ? true : false,

          isFrom: options.isFrom,
          index: options.index,
          classindex: options.classindex,
          listName: options.listName
        };
      that.setData(obj)
    }else{
      if (!!options.ID){
        that.setAgendaData(options)
      }else{
        let classTime = options.date.split('-').join('/') + ' ' + this.data.StartTime,
          classTimestamp = Date.parse(classTime) 
          
        that.setData({
          date: options.date,
          childrenID: options.childrenID,
          isShowEditBtn: classTimestamp > timestamp || classTimestamp == timestamp ? true : false,
          isFrom: options.isFrom
        })
      }
    }

    this.initRecord()

    // app.getRecordAuth()
  },

  //录入课程
  setCourseNameInput: function(e) {
    this.setData({
      CourseName: e.detail.value
    })
  },
  //录入学校
  setSchoolNameInput: function(e) {
    this.setData({
      SchoolName: e.detail.value
    })
  },
  //点击开始时间组件确定事件  
  bindStartTimeChange: function(e) {
    let StartTime = e.detail.value,
      strtHour = Number(StartTime.split(':')[0]) + 1,
      EndTime = strtHour < 10 ? '0' + strtHour + ':00' : (strtHour == 24 ? '23:59' : strtHour + ':00'),
      classTime = this.data.date.split('-').join('/') + ' ' + StartTime,
      classTimestamp = Date.parse(classTime)

    this.setData({
      StartTime: e.detail.value,
      EndTime: EndTime,
      isShowEditBtn: classTimestamp > timestamp || classTimestamp == timestamp ? true : false
    })
  },
  //点击结束时间组件确定事件  
  bindEndTimeChange: function(e) {
    this.setData({
      EndTime: e.detail.value
    })
  },
  //选择课程频率
  bindFrequencyPickerChange: function (e) {
    let frequencyId = this.data.frequencyList[e.detail.value].id

    this.setData({
      frequencyValue: e.detail.value,
      frequencyId: frequencyId
    })
  },
  //选择课程类型
  bindTypePickerChange: function (e) {
    let typeId = this.data.typeList[e.detail.value].id

    this.setData({
      typeValue: e.detail.value,
      typeId: typeId
    })
  },
  //录入地址
  setAddressInput: function(e) {
    this.setData({
      Address: e.detail.value
    })
  },
  //录入老师
  setTeacherInput: function(e) {
    this.setData({
      Teacher: e.detail.value
    })
  },
  //录入联系方式
  setTelPhoneInput: function(e) {
    this.setData({
      Phone: e.detail.value
    })
  },
  //选择提醒方式
  bindRemindPickerChange: function(e) {
    let time = this.data.remindList[e.detail.value].time

    this.setData({
      remindValue: e.detail.value,
      RemindTime: time
    })
  },
  //录入备注
  setRemarkInput: function(e) {
    this.setData({
      Remarks: e.detail.value
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
      frequencyId = this.data.frequencyId,
      that = this;
    if (frequencyId == 2 || frequencyId == 3){
      that.delUpdate()

      return
    }

    wx.request({
      url: that.data.url + '/Course/Delete', //仅为示例，并非真实的接口地址
      data: {
        id: ID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        
        let data = res.data.Data

        that.setData({
          ID: null,
          CourseName: '', //课程名称
          SchoolName: '', //学校名称
          StartTime: '07:00', //开始时间
          EndTime: '08:00', //结束时间
          frequencyValue: 0,//课程频率
          frequencyId: 1,//课程频率id
          typeValue: 0,//课程类型
          typeId: 1,//课程类型id
          Address: '', //地址
          Teacher: '', //老师姓名
          Phone: '', //联系方式
          remindValue: 0,
          RemindTime: '-9999',
          Remarks: '' //备注
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
  
  delUpdate: function(){
    let that = this,
      data = this.data,
      ID = data.ID,
      query = {
        PublicCourseTypeID: 0,
        PublicCourseInfoID: 0,
        OpenID: app.globalData.openID,
        ID: data.ID,
        BatchID: data.BatchID,
        ChildrenID: data.childrenID,
        CourseName: data.CourseName,
        SchoolName: data.SchoolName,
        StartTime: data.date + ' ' + data.StartTime,
        EndTime: data.date + ' ' + data.EndTime,
        Frequency: 1,
        CourseType: data.typeId,
        Address: data.Address,
        Teacher: data.Teacher,
        Phone: data.Phone,
        RemindTime: data.RemindTime,
        Remarks: data.Remarks
      }

    wx.request({
      url: that.data.url + '/Course/Update',
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let data = res.data.Data

        if (res.data.Result == '800') {
          wx.showToast({
            title: '请重新打开此页面再删除',
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

        wx.request({
          url: that.data.url + '/Course/Delete', //仅为示例，并非真实的接口地址
          data: {
            id: data.ID
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {

            let data = res.data.Data

            that.setData({
              ID: null,
              CourseName: '', //课程名称
              SchoolName: '', //学校名称
              StartTime: '07:00', //开始时间
              EndTime: '08:00', //结束时间
              frequencyValue: 0,//课程频率
              frequencyId: 1,//课程频率id
              typeValue: 0,//课程类型
              typeId: 1,//课程类型id
              Address: '', //地址
              Teacher: '', //老师姓名
              Phone: '', //联系方式
              remindValue: 0,
              RemindTime: '-9999',
              Remarks: '' //备注
            })

            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        })
      }
    })

  },



  //保存
  save: function(e) {debugger
    let that = this,
      data = this.data,
      query = {
        PublicCourseTypeID:0,
        PublicCourseInfoID:0,
        OpenID: app.globalData.openID,
        ID: data.ID,
        BatchID: data.BatchID,
        ChildrenID: data.childrenID,
        CourseName: data.CourseName,
        SchoolName: data.SchoolName,
        StartTime: data.date + ' ' + data.StartTime,
        EndTime: data.date + ' ' + data.EndTime,
        Frequency: data.frequencyId,
        CourseType: data.typeId,
        Address: data.Address,
        Teacher: data.Teacher,
        Phone: data.Phone,
        RemindTime: data.RemindTime,
        Remarks: data.Remarks
      }
    
    if (!query.CourseName){
      wx.showToast({
        title: '请填写课程名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    } 
    if (!!data.isFrom && data.isFrom == 'BatchAdd'){
      query.index = data.index
      query.classindex = data.classindex
      query.listName = data.listName

      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2];

      prevPage.setData({  
        tempObj: query
      })
      
      wx.navigateBack({
        delta: 1
      })
    }else{
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
          url: that.data.url + '/Course/Add', //仅为示例，并非真实的接口地址
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
    }
  },

  //设置消息提醒模板
  setInfoTemplate: function (formId, access_token){
    var that = this;
    var openId = app.globalData.openID;
    var messageDemo = {
      touser: openId,//openId   
      template_id: '1fubB0p5PAMlP_o5P1R93-35W_TCa2plZTpPogGn87w',//模板消息id，  
      //page: 'pages/setAgenda/setAgenda?childrenID=' + this.data.childrenID + '&date=' + this.data.date + '&ID=' + this.data.ID,//点击详情时跳转的主页 失败原因是此时无法获取课程ID
      page: 'pages/login/login',//点击详情时跳转的主页
      form_id: formId,//formId
      data: {//下面的keyword*是设置的模板消息的关键词变量  
        "keyword1": {
          "value": this.data.date + ' ' + this.data.StartTime
        },
        "keyword2": {
          "value": this.data.CourseName
        },
        "keyword3": {
          "value": this.data.Teacher
        },
        "keyword4": {
          "value": this.data.Address
        }
      }
    }

    wx.request({
      url: that.data.url + '/WeChatAppAuthorize/SendMsgAsync',
      data: {
        accessToken: access_token,
        data: messageDemo,
        StartTime: that.data.date + ' ' + that.data.StartTime + ':00',
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
      success: function (res) {
        let data = res.data.Data,
          remindList = that.data.remindList,
          remindItem = remindList.filter(o =>{return o.time == data.RemindTime}),
          classTime = options.date.split('-').join('/') + ' ' + data.StartTime.split(' ')[1],
          classTimestamp = Date.parse(classTime),
          obj = {
            date: options.date,
            childrenID: options.childrenID,
            ID: options.ID,
            BatchID: data.BatchID,
            CourseName: data.CourseName ? data.CourseName : '', //课程名称
            SchoolName: data.SchoolName ? data.SchoolName : '', //学校名称
            StartTime: data.StartTime.split(' ')[1], //开始时间
            EndTime: data.EndTime.split(' ')[1], //结束时间
            frequencyValue: Number(data.Frequency) - 1,//课程频率
            frequencyId: data.Frequency,//课程频率id
            typeValue: Number(data.CourseType) - 1,//课程类型
            typeId: data.CourseType,//课程类型id
            Address: data.Address ? data.Address : '', //地址
            Teacher: data.Teacher ? data.Teacher : '', //老师姓名
            Phone: data.Phone ? data.Phone : '', //联系方式
            remindValue: !!remindItem[0] ? remindItem[0].id : 0,//提醒
            RemindTime: !!data.RemindTime ? data.RemindTime : -9999,//提醒
            Remarks: !!data.Remarks ? data.Remarks : '',//备注
            isShowEditBtn: classTimestamp > timestamp || classTimestamp == timestamp ? true : false
          }

        that.setData(obj)
      }
    })
  },

  /**
   * 按下按钮开始录音
   */
  streamRecord: function (e) {
    this.setData({
      voiceType: e.currentTarget.dataset.type,
    })
    // 先清空背景音
    wx.stopBackgroundAudio()

    let detail = e.detail || {}

    manager.start({
      lang: "zh_CN",
    })

    this.setData({
      recordStatus: 0,
      recording: true,
      voiceURL: '../../imgs/accredit/voice2.png',
      isPopDis: true
    })
  },

  /**
   * 松开按钮结束录音
   */
  endStreamRecord: function (e) {
    this.setData({
      voiceType: e.currentTarget.dataset.type,
    })

    let detail = e.detail || {}  // 自定义组件触发事件时提供的detail对象
    let buttonItem = detail.buttonItem || {}

    // 防止重复触发stop函数
    if (!this.data.recording || this.data.recordStatus != 0) {
      console.warn("has finished!")
      return
    }

    manager.stop()

    this.setData({
      voiceURL: '../../imgs/accredit/voice.png',
      isPopDis: false,
    })
  },


  /**
   * 识别内容为空时的反馈
   */
  showRecordEmptyTip: function () {
    this.setData({
      recording: false,
    })
    wx.showToast({
      title: '亲，请说话哦~',
      icon: 'success',
      image: '../../imgs/accredit/no_voice.png',
      duration: 2000,
      success: function (res) {

      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  /**
   * 初始化语音识别回调
   * 绑定语音播放开始事件
   */
  initRecord: function () {
    let that = this
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result,
        voiceType = that.data.voiceType

      console.log('startText', text)

      if (voiceType == 'CourseName'){
        setTimeout(()=>{
          this.setData({
            CourseName: text,
          })
        },2000)
      } else if (voiceType == 'SchoolName'){
        setTimeout(() => {
          this.setData({
            SchoolName: text,
          })
        }, 2000)
      }
    }

    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result,
        voiceType = that.data.voiceType

      console.log('endText', text)

      if (text == '') {
        this.showRecordEmptyTip()
        return
      }

      if (voiceType == 'CourseName') {
        setTimeout(() => {
          this.setData({
            CourseName: text,
            recordStatus: 1,
          })
        }, 2000)
      } else if (voiceType == 'SchoolName') {
        setTimeout(() => {
          this.setData({
            SchoolName: text,
            recordStatus: 1,
          })
        }, 2000)
      }

    }

    // 识别错误事件
    manager.onError = (res) => {

      this.setData({
        recording: false,
      })

    }

  },

})