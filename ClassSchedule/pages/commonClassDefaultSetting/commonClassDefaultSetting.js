// pages/commonClassDefaultSetting/commonClassDefaultSetting.js
const app = getApp()

let list = [
  { ID: 0, StartTime: '08:00', EndTime: '08:20', Name: 1, CourseIndex: 1 },
  { ID: 0, StartTime: '08:30', EndTime: '09:00', Name: 2, CourseIndex: 2 },
  { ID: 0, StartTime: '09:01', EndTime: '09:30', Name: 3, CourseIndex: 3 },
  { ID: 0, StartTime: '09:31', EndTime: '10:00', Name: 4, CourseIndex: 4 },
  { ID: 0, StartTime: '10:01', EndTime: '10:30', Name: 5, CourseIndex: 5 },
  { ID: 0, StartTime: '10:31', EndTime: '11:00', Name: 6, CourseIndex: 6 },
  { ID: 0, StartTime: '11:01', EndTime: '11:30', Name: 7, CourseIndex: 7 },
  { ID: 0, StartTime: '11:30', EndTime: '12:00', Name: 8, CourseIndex: 8 },
  { ID: 0, StartTime: '12:01', EndTime: '12:20', Name: 9, CourseIndex: 9 },
  { ID: 0, StartTime: '12:30', EndTime: '13:00', Name: 10, CourseIndex: 10 },
  { ID: 0, StartTime: '13:01', EndTime: '13:30', Name: 11, CourseIndex: 11 },

  { ID: 0, StartTime: '13:31', EndTime: '14:00', Name: 12, CourseIndex: 12 },
  { ID: 0, StartTime: '13:01', EndTime: '14:30', Name: 13, CourseIndex: 13 },
  { ID: 0, StartTime: '14:31', EndTime: '15:00', Name: 14, CourseIndex: 14 },
  { ID: 0, StartTime: '15:01', EndTime: '15:30', Name: 15, CourseIndex: 15 },
  { ID: 0, StartTime: '15:31', EndTime: '16:00', Name: 16, CourseIndex: 16 },
  { ID: 0, StartTime: '19:00', EndTime: '19:30', Name: 17, CourseIndex: 17 },
  { ID: 0, StartTime: '19:31', EndTime: '20:00', Name: 18, CourseIndex: 18 },
  { ID: 0, StartTime: '20:01', EndTime: '20:30', Name: 19, CourseIndex: 19 },
  { ID: 0, StartTime: '20:31', EndTime: '21:00', Name: 20, CourseIndex: 20 },
  { ID: 0, StartTime: '21:01', EndTime: '21:30', Name: 21, CourseIndex: 21 },
  { ID: 0, StartTime: '21:31', EndTime: '22:00', Name: 22, CourseIndex: 22 },
  { ID: 0, StartTime: '22:01', EndTime: '22:30', Name: 23, CourseIndex: 23 },
  { ID: 0, StartTime: '22:31', EndTime: '23:00', Name: 24, CourseIndex: 24 }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    IsOpen: 0,//开关
    firstMorningNum: 8,//初次进来上午课程的值
    MorningNum: 8,//上午课程次数值
    firstAfternoonNum: 8,//初次进来下午课程的值
    AfternoonNum: 8,//下午课程次数值
    firstNightNum: 8,//初次进来晚上课程的值
    NightNum: 8,//晚上课程次数值

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
    frequencyValue: 2,
    frequencyId: 3,

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
  },

  onLoad: function (options) {
    wx.hideShareMenu()

    this.tempData(options.publicCourseInfoID)
  },

  tempData: function (publicCourseInfoID) {
    let that = this;

    wx.request({
      url: app.globalData.url + '/DefaultCourseSetting/GetDefaultCourseSettingByPublicCourseInfoID', //仅为示例，并非真实的接口地址
      data: {
        publicCourseInfoID: publicCourseInfoID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let value1 = res.data.Data

        wx.request({
          url: app.globalData.url + '/DefaultCourseTimeSetting/IndexByPublicCourseInfoID', //仅为示例，并非真实的接口地址
          data: {
            publicCourseInfoID: publicCourseInfoID
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            let value2 = res.data.Data,
              obj = {
                publicCourseInfoID: publicCourseInfoID
              };

            if (!value2 || !value2[0]) {
              obj.defaultTimeList = list
            } else {
              obj.defaultTimeList = value2
            }

            if (!!value1) {
              let frequencyIndex, typeIndex;

              that.data.frequencyList.map((o, index) => {
                if (o.id == value1.Frequency) frequencyIndex = index
              })

              that.data.typeList.map((o, index) => {
                if (o.id == value1.CourseType) typeIndex = index
              })

              obj.IsOpen = !!value1.IsOpen ? 1 : 0//开关
              obj.firstMorningNum = Number(value1.MorningNum)//初次进来上午课程的值
              obj.firstAfternoonNum = Number(value1.AfternoonNum)//初次进来下午课程的值
              obj.firstNightNum = Number(value1.NightNum)//初次进来晚上课程的值
              obj.MorningNum = Number(value1.MorningNum)//上午课程次数值
              obj.AfternoonNum = Number(value1.AfternoonNum)//下午课程次数值
              obj.NightNum = Number(value1.NightNum)//晚上课程次数值
              obj.ID = value1.ID
              obj.frequencyValue = frequencyIndex
              obj.frequencyId = value1.Frequency
              obj.typeValue = typeIndex
              obj.typeId = value1.CourseType
            }
            that.setData(obj)
          }
        })

      }
    })
  },

  //切换开关
  switchChange: function (e) {
    let value = e.detail.value

    this.setData({
      IsOpen: !!value ? 1 : 0
    })
  },
  //输入上午课次次数
  setMorningNumInput: function (e) {
    this.setData({
      MorningNum: Number(e.detail.value),
    })
  },
  //设置上午课次次数焦点离开
  setMorningNumInputBlur: function (e) {
    debugger
    let MorningNum = Number(this.data.MorningNum),
      firstMorningNum = Number(this.data.firstMorningNum),
      defaultTimeList = this.data.defaultTimeList,
      minus = Math.abs(MorningNum - firstMorningNum);

    if (MorningNum > firstMorningNum) {
      defaultTimeList = defaultTimeList.map(o => {
        if (Number(o.CourseIndex) > Number(firstMorningNum)) {
          o.CourseIndex = Number(o.CourseIndex) + minus
          o.Name = o.CourseIndex
        }
        return o
      })

      for (let i = 0; i < minus; i++) {
        defaultTimeList = this.addOrDelMorningTime(defaultTimeList, 'add')
      }

    } else if (MorningNum < firstMorningNum) {
      defaultTimeList = defaultTimeList.map(o => {
        if (Number(o.CourseIndex) > Number(firstMorningNum)) {
          o.CourseIndex = Number(o.CourseIndex) - minus
          o.Name = o.CourseIndex
        }
        return o
      })

      for (let i = 0; i < minus; i++) {
        defaultTimeList = this.addOrDelMorningTime(defaultTimeList, 'del')
      }

    }

    this.setData({
      defaultTimeList: defaultTimeList
    })
  },
  //添加上午时间行
  addOrDelMorningTime: function (defaultTimeList, isAddOrDel) {
    debugger
    let firstMorningNum = Number(this.data.firstMorningNum),
      item = { ID: 0, StartTime: '00:00', EndTime: '23:59', Name: firstMorningNum + 1, CourseIndex: firstMorningNum + 1 }

    if (isAddOrDel == 'add') {
      defaultTimeList.splice(firstMorningNum, 0, item)
      this.setData({
        firstMorningNum: firstMorningNum + 1
      })
    } else if (isAddOrDel == 'del') {
      defaultTimeList.splice(firstMorningNum - 1, 1)
      this.setData({
        firstMorningNum: firstMorningNum - 1
      })
    }

    return defaultTimeList
  },
  //输入下午课次次数
  setAfternoonNumInput: function (e) {
    this.setData({
      AfternoonNum: Number(e.detail.value)
    })
  },
  //设置下午课次次数焦点离开
  setAfternoonNumInputBlur: function (e) {
    let MorningNum = Number(this.data.MorningNum),
      AfternoonNum = Number(this.data.AfternoonNum),
      firstAfternoonNum = Number(this.data.firstAfternoonNum),
      defaultTimeList = this.data.defaultTimeList,
      initSumNum = MorningNum + firstAfternoonNum,
      curSumNum = MorningNum + AfternoonNum,
      minus = Math.abs(AfternoonNum - firstAfternoonNum);

    if (curSumNum > initSumNum) {
      defaultTimeList = defaultTimeList.map(o => {
        if (Number(o.CourseIndex) > Number(initSumNum)) {
          o.CourseIndex = Number(o.CourseIndex) + minus
          o.Name = o.CourseIndex
        }
        return o
      })

      for (let i = 0; i < minus; i++) {
        defaultTimeList = this.addOrDelAfternoonTime(defaultTimeList, 'add')
      }

    } else if (curSumNum < initSumNum) {
      defaultTimeList = defaultTimeList.map(o => {
        if (Number(o.CourseIndex) > Number(initSumNum)) {
          o.CourseIndex = Number(o.CourseIndex) - minus
          o.Name = o.CourseIndex
        }
        return o
      })

      for (let i = 0; i < minus; i++) {
        defaultTimeList = this.addOrDelAfternoonTime(defaultTimeList, 'del')
      }

    }

    this.setData({
      defaultTimeList: defaultTimeList
    })
  },
  //添加下午时间行
  addOrDelAfternoonTime: function (defaultTimeList, isAddOrDel) {
    debugger
    let MorningNum = Number(this.data.MorningNum),
      AfternoonNum = Number(this.data.AfternoonNum),
      firstAfternoonNum = Number(this.data.firstAfternoonNum),
      initSumNum = MorningNum + firstAfternoonNum,
      item = { ID: 0, StartTime: '00:00', EndTime: '23:59', Name: initSumNum + 1, CourseIndex: initSumNum + 1 }

    if (isAddOrDel == 'add') {
      defaultTimeList.splice(initSumNum, 0, item)
      this.setData({
        firstAfternoonNum: firstAfternoonNum + 1
      })
    } else if (isAddOrDel == 'del') {
      defaultTimeList.splice(initSumNum - 1, 1)
      this.setData({
        firstAfternoonNum: firstAfternoonNum - 1
      })
    }

    return defaultTimeList
  },
  //输入晚上课次次数
  setNightNumInput: function (e) {
    this.setData({
      NightNum: Number(e.detail.value)
    })
  },
  //设置晚上课次次数焦点离开
  setNightNumInputBlur: function (e) {
    let MorningNum = Number(this.data.MorningNum),
      AfternoonNum = Number(this.data.AfternoonNum),
      NightNum = Number(this.data.NightNum),
      firstNightNum = Number(this.data.firstNightNum),
      defaultTimeList = this.data.defaultTimeList,
      initSumNum = MorningNum + AfternoonNum + firstNightNum,
      curSumNum = MorningNum + AfternoonNum + NightNum,
      minus = Math.abs(NightNum - firstNightNum);

    if (curSumNum > initSumNum) {
      defaultTimeList = defaultTimeList.map(o => {
        if (Number(o.CourseIndex) > Number(initSumNum)) {
          o.CourseIndex = Number(o.CourseIndex) + minus
          o.Name = o.CourseIndex
        }
        return o
      })

      for (let i = 0; i < minus; i++) {
        defaultTimeList = this.addOrDelNightTime(defaultTimeList, 'add')
      }

    } else if (curSumNum < initSumNum) {
      defaultTimeList = defaultTimeList.map(o => {
        if (Number(o.CourseIndex) > Number(initSumNum)) {
          o.CourseIndex = Number(o.CourseIndex) - minus
          o.Name = o.CourseIndex
        }
        return o
      })

      for (let i = 0; i < minus; i++) {
        defaultTimeList = this.addOrDelNightTime(defaultTimeList, 'del')
      }

    }

    this.setData({
      defaultTimeList: defaultTimeList
    })
  },
  //添加晚上时间行
  addOrDelNightTime: function (defaultTimeList, isAddOrDel) {
    let MorningNum = Number(this.data.MorningNum),
      AfternoonNum = Number(this.data.AfternoonNum),
      NightNum = Number(this.data.NightNum),
      firstNightNum = Number(this.data.firstNightNum),
      initSumNum = MorningNum + AfternoonNum + firstNightNum,
      item = { ID: 0, StartTime: '00:00', EndTime: '23:59', Name: initSumNum + 1, CourseIndex: initSumNum + 1 }

    if (isAddOrDel == 'add') {
      defaultTimeList.splice(initSumNum, 0, item)
      this.setData({
        firstNightNum: firstNightNum + 1
      })
    } else if (isAddOrDel == 'del') {
      defaultTimeList.splice(initSumNum - 1, 1)
      this.setData({
        firstNightNum: firstNightNum - 1
      })
    }

    return defaultTimeList
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

  //选择开始时间
  bindStartTimeChange: function (e) {
    let that = this,
      defaultTimeList = that.data.defaultTimeList,
      item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index,
      value = e.detail.value;

    defaultTimeList[index].StartTime = value

    that.setData({
      defaultTimeList: defaultTimeList
    })
  },

  //选择结束时间
  bindEndTimeChange: function (e) {
    let that = this,
      defaultTimeList = that.data.defaultTimeList,
      item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index,
      value = e.detail.value;

    defaultTimeList[index].EndTime = value

    that.setData({
      defaultTimeList: defaultTimeList
    })
  },

  //取消
  cancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  //保存
  save: function () {
    let that = this,
      data = that.data,
      defaultTimeList = data.defaultTimeList,
      model = {
        PublicCourseInfoID: data.publicCourseInfoID,
        IsOpen: data.IsOpen,
        MorningNum: data.MorningNum,
        AfternoonNum: data.AfternoonNum,
        NightNum: data.NightNum,
        Frequency: data.frequencyId,
        CourseType: data.typeId
      };

    if (!!data.ID) model.ID = data.ID

    defaultTimeList = defaultTimeList.map(o => {
      if (!o.PublicCourseInfoID) {
        o.PublicCourseInfoID = that.data.publicCourseInfoID
      }

      return o
    })

    wx.request({
      url: app.globalData.url + '/DefaultCourseSetting/SetModel', //仅为示例，并非真实的接口地址
      data: {
        model: JSON.stringify(model),
        timeModelList: JSON.stringify(defaultTimeList),
        courseClassType: 2
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (!!res.data.Status) {
          wx.showToast({
            title: '设置成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })

          setTimeout(() => {
            let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
            let prevPage = pages[pages.length - 2];

            prevPage.setData({
              isRefresh: 'isRefresh'
            })

            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showToast({
            title: '设置失败',
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