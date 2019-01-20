// pages/setClock/setClock.js
var app = getApp()
//使用小程序的日期控件
var util = require('../../utils/util.js')
//日期时间选择器
var dateTimePicker = require('../../utils/dateTimePicker.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    weekList:[
      { name: '日', id: 7},
      { name: '一', id: 1 },
      { name: '二', id: 2 },
      { name: '三', id: 3 },
      { name: '四', id: 4 },
      { name: '五', id: 5 },
      { name: '六', id: 6 },
    ],
    dayNumList: [
      { name: '1', isChecked: true},
      { name: '2' },
      { name: '3' },
      { name: '4' },
      { name: '5' },
      { name: '6' },
      { name: '7' },
      { name: '8' },
      { name: '9' },
    ],
    radioList: [
      { name: '习惯养成', value: 1 },
      { name: '学习打卡', value: 2 },
      { name: '其他打卡', value: 3 }
    ],
    clockName: '',//习惯名称
    repetitionPeriodtype: '1',//重复周期 默认固定
    durationTimeStart: '',//持续时间开始
    durationTimeEnd: '',//持续时间开始
    isLimitTime: false,//开关
    limitTime: 25,//限时时间默认25
    bonusPointsValue: '',//积分数

    ExecuteNum: 1,//默认打卡次数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // 获取完整的年月日 时分秒，以及默认显示的数组
    let obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 只获取年月日
    let lastArray = obj.dateTimeArray.slice(0,3);
    let lastTime = obj.dateTime.slice(0,3);
    let query = wx.createSelectorQuery();
    query.select('.day').boundingClientRect();
    query.exec(function (rect) {
      if (rect[0] === null) return;
      if (!!options.isFrom && options.isFrom == 'limitTime'){
        that.setData({
          dayHeight: rect[0].width,
          dateTimeArray: lastArray,
          dateTimeStart: lastTime,
          dateTimeEnd: lastTime,
          ChildrenID: options.childrenID,
          clockName: options.clockName,
          isLimitTime: options.isLimitTime,
          limitTime: options.limitTime,
          isFrom: options.isFrom
        })
      }else{
        that.setData({
          dayHeight: rect[0].width,
          dateTimeArray: lastArray,
          dateTimeStart: lastTime,
          dateTimeEnd: lastTime,
          ChildrenID: options.childrenID
        })
      }
      
      if (!!options.projectId) {
        that.setProjectData(options.projectId)
      } else if (!!options.id){
        that.setClockData(options.id)
      }
    });
  },
  setProjectData: function (projectId){
    let that = this;

    wx.request({
      url: that.data.url + '/ClockProject/GetClockProjectByID', //仅为示例，并非真实的接口地址
      data: {
        id: projectId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger
        let resData = res.data.Data,
          radioList = that.data.radioList,
          radioItem = radioList.filter(o=>{
            return o.value == resData.Type
          });
        console.log(res)

        radioList = radioList.map(o=>{
          if (o.value == resData.Type){
            o.checked = true
          }
          return o
        })
        
        that.setData({
          projectId: resData.ID,
          ChildrenID: resData.ChildrenID,
          clockName: resData.Name,
          Sort: resData.Sort,
          projectType: resData.Type,
          radioList: radioList
        })
      }
    })
  },

  setClockData: function (id) {
    let that = this;

    wx.request({
      url: that.data.url + '/Clock/GetClockById', //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger
        let resData = res.data.Data,
          weekList = that.data.weekList,
          DayOfWeek = !!resData.DayOfWeek && resData.DayOfWeek !='undefined' ? JSON.parse(resData.DayOfWeek) : '', 
          dayNumList = that.data.dayNumList,
          radioList = that.data.radioList;

        if (!!DayOfWeek){
          weekList = weekList.map(o => {
            for (let i = 0; i < DayOfWeek.length; i++) {
              if (o.id == DayOfWeek[i]) {
                o.isChecked = true
                return o
              }
            }
          })
        }
        
        dayNumList = dayNumList.map((o, rowIndex) => {
          if (Number(o.name) <= resData.ExecuteNum) {
            o.isChecked = true
          } else {
            o.isChecked = false
          }
          return o
        })

        radioList = radioList.map(o => {
          if (o.value == resData.ClockType) {
            o.checked = true
          }
          return o
        })

        that.setData({
          id: resData.ID,
          BatchID: resData.BatchID,
          ChildrenID: resData.ChildrenID,
          clockName: resData.Name,
          repetitionPeriodtype: resData.Frequency,
          DayOfWeek: DayOfWeek,//固定周打卡时间
          weekList: weekList,
          ExecuteNum: resData.ExecuteNum,//打卡次数
          dayNumList: dayNumList,
          durationTimeStart: resData.KeepStartTime,//持续时间开始
          durationTimeEnd: resData.KeepEndTime,//持续时间结束
          isLimitTime: resData.IsLimit,//是否限时
          limitTime: resData.LimitedTime,//限时分钟数
          projectType: resData.ClockType,//项目类别
          radioList: radioList,
          bonusPointsValue: resData.RewardPoints//积分数
        })
      }
    })
  },

  //选择重复周期
  selectWeek: function(e){debugger
    let index = e.currentTarget.dataset.index,
      item = e.currentTarget.dataset.item,
      weekList = this.data.weekList,
      array = [];

    if (!!weekList[index].isChecked){
      weekList[index].isChecked = false
    }else{
      weekList[index].isChecked = true
    }

    weekList.map(o=>{
      if (!!o.isChecked){
        array.push(o.id)
      }
    })

    this.setData({
      weekList: weekList,

      DayOfWeek: array,//固定周打卡时间

    })
  },

  //选择重复次数
  selectNum: function (e) {debugger
    let index = e.currentTarget.dataset.index,
      item = e.currentTarget.dataset.item,
      dayNumList = this.data.dayNumList;

    if (!!dayNumList[index].isChecked) {
      dayNumList[index].isChecked = false
    } else {
      dayNumList[index].isChecked = true
    }

    dayNumList = dayNumList.map((o, rowIndex)=>{
      if (rowIndex <= index){
        o.isChecked = true
      }else{
        o.isChecked = false
      }
      return o
    })

    this.setData({
      dayNumList: dayNumList,

      ExecuteNum: Number(index) + 1,//打卡次数
    })
  },

  //输入打卡名称
  setClockNameInput: function (e) {
    this.setData({
      clockName: e.detail.value
    })
  },

  //选择重复周期
  setRepetitionPeriod: function(e){
    let repetitionPeriodtype = e.currentTarget.dataset.type

    this.setData({
      repetitionPeriodtype: repetitionPeriodtype
    })
  },

  //设置持续时间下拉
  changeDateTime(e) {
    let pickerType = e.currentTarget.dataset.type,
      data = this.data,
      dateTime = e.detail.value,
      dateTimeArray = data.dateTimeArray,
      durationTime = this.getServiceTime(dateTime, dateTimeArray);

    if (pickerType == "start"){
      this.setData({
        dateTimeStart: dateTime,
        durationTimeStart: durationTime
      });
    }else{
      this.setData({
        dateTimeEnd: dateTime,
        durationTimeEnd: durationTime
      });
    }
  },

  changeDateTimeColumn(e) {
    let pickerType = e.currentTarget.dataset.type,
      arr = pickerType == "start" ? this.data.dateTimeStart : this.data.dateTimeEnd, 
      dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    if (pickerType == "start"){
      this.setData({
        dateTimeArray: dateArr,
        dateTimeStart: arr
      });
    }else{
      this.setData({
        dateTimeArray: dateArr,
        dateTimeEnd: arr
      });
    }
  },

  //合并搬家时间
  getServiceTime: function (dateTime, dateTimeArray, current) {
    let dateArr = [],
      date = '';

    if (!!dateTime && !!dateTime[0] && !!dateTimeArray && !!dateTimeArray[0]) {
      dateTime.map((item, index) => {
        dateArr.push(dateTimeArray[index][item])
      })

      date = dateArr.join('-')
    }

    return date
  },

  //切换开关
  switchChange: function (e) {
    let value = e.detail.value

    this.setData({
      isLimitTime: !!value ? true : false
    })
  },

  //输入限时分钟时长
  setLimitTimeNum: function (e) {
    this.setData({
      limitTime: e.detail.value
    })
  },
  //减
  minus: function () {
    let num = this.data.limitTime

    num = num - 1
    num = num <= 0 ? 1 : num

    this.setData({
      limitTime: num
    })
  },
  //加
  plus: function () {
    let num = this.data.limitTime

    num = num + 1

    this.setData({
      limitTime: num
    })
  },

  //项目类别单选框处理
  radioChange: function (e) {
    let that = this,
      value = e.detail.value,
      data = this.data,
      radioList = this.data.radioList,
      item = radioList.filter(item => { return item.value == value })[0],
      project = item.value

    that.setData({
      projectType: project
    });
  },

  //录入积分数
  setBonusPointsInput: function (e) {
    this.setData({
      bonusPointsValue: e.detail.value
    })
  },

  //取消
  cancel: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  //保存
  save: function () {debugger
    let that = this,
      data = that.data,
      url = that.data.url + (!!data.id ? '/Clock/Update' : '/Clock/Add'),
      query = {
        ChildrenID: data.ChildrenID,
        Name: data.clockName,
        Frequency: data.repetitionPeriodtype,//重复周期类型
        DayOfWeek: data.DayOfWeek,//固定周打卡时间
        ExecuteNum: data.ExecuteNum,//打卡次数
        ExecutedNum: 0,//已经打卡次数
        KeepStartTime: data.durationTimeStart,//持续时间开始
        KeepEndTime: data.durationTimeEnd,//持续时间结束
        IsLimit: data.isLimitTime,//是否限时
        LimitedTime: data.limitTime,//限时分钟数
        RemindTime: -9999,//提醒
        ClockType: data.projectType,//项目类别
        RewardPoints: data.bonusPointsValue,//积分数
        IsComplated: 0//是否完成
      }

    if (!!data.id){
      query.ID = data.id
      query.BatchID = data.BatchID
    }

    if (!query.Name) {
      wx.showToast({
        title: '请输入习惯名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (query.Frequency == 1 && (!query.DayOfWeek || !query.DayOfWeek[0])){
      wx.showToast({
        title: '固定模式最少选择一天',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return
    }

    if (!query.KeepStartTime) {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (!query.KeepEndTime) {
      wx.showToast({
        title: '请选择结束时间',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    wx.request({
      url: url, //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger
        if (!!res.data.Status) {
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })

          setTimeout(() => {
            if (!!data.isFrom && data.isFrom == 'limitTime'){
              wx.navigateBack({
                delta: 1
              })
            }else{
              wx.navigateBack({
                delta: 2
              })
            }
          }, 1000)
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
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