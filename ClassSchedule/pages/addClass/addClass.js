// pages/addClass/addClass.js
const app = getApp()
var timestamp = new Date().getTime();//当前日期时间戳

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseColors: ['#000000', '#c00000', '#538035'], // 0学校正课 1课外课 2其他
    hiddenmodalput: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    wx.hideShareMenu()

    wx.request({
      url: app.globalData.url + '/PageCommon/IsFirstOpenPage', //仅为示例，并非真实的接口地址
      data: {
        openID: app.globalData.openID,
        page: 'class'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!!res.data.Data){
          that.setData({
            hiddenmodalput: false,
            childrenID: options.childrenID
          })
        }

        that.setInitData(options.childrenID)
      }
    })

  },

  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function (options) {
    let that = this;

    wx.hideShareMenu()

    if (this.data.tempObj) {
      let data = that.data,
        tempObj = data.tempObj,
        listName = tempObj.listName,
        index = tempObj.index,
        classindex = tempObj.classindex,
        curList = data[listName],
        curClassItem = curList[index][classindex],
        obj = {};

      curClassItem.CourseName = !!tempObj.CourseName ? tempObj.CourseName : null
      curClassItem.SchoolName = !!tempObj.SchoolName ? tempObj.SchoolName : null
      curClassItem.StartTime = !!tempObj.StartTime ? tempObj.StartTime : null
      curClassItem.EndTime = !!tempObj.EndTime ? tempObj.EndTime : null
      curClassItem.Frequency = !!tempObj.Frequency ? tempObj.Frequency : null
      curClassItem.CourseType = !!tempObj.CourseType ? tempObj.CourseType : null
      curClassItem.Address = !!tempObj.Address ? tempObj.Address : null
      curClassItem.Teacher = !!tempObj.Teacher ? tempObj.Teacher : null
      curClassItem.Phone = !!tempObj.Phone ? tempObj.Phone : null
      curClassItem.RemindTime = !!tempObj.RemindTime ? tempObj.RemindTime : null
      curClassItem.Remarks = !!tempObj.Remarks ? tempObj.Remarks : null

      curList[index][classindex] = curClassItem

      obj[listName] = curList
      obj.tempObj = null

      that.setData(obj)
    } else if (!!this.data.childrenID) {
      this.setInitData(this.data.childrenID, 'onShow')
    }
  },

  handleConfirm: function () {//知道了弹窗
    let data = this.data,
      that = this;

    wx.request({
      url: app.globalData.url + '/PageCommon/Add', //仅为示例，并非真实的接口地址
      data: {
        openID: app.globalData.openID,
        page: 'class'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          hiddenmodalput: true,
        })
        // this.setInitData(options.childrenID)
      }
    })
  },

  //单击课程名称
  pressTap: function (e) {
    let item = e.currentTarget.dataset.item,
      index = e.currentTarget.dataset.index,
      comClassList = this.data.comClassList,
      model = this.data.model;

    comClassList = comClassList.map((o, rowIndex)=>{
      if (!model || !model.IsOpen) {
        if (rowIndex == index){
          o.className = 'commonColor'
        }else{
          o.className = ''
        }
      } else {
        if (rowIndex == index) {
          o.className = 'specialColor' + model.CourseType
        } else {
          o.className = ''
        }
      }

      return o
    })

    this.setData({
      comClassList: comClassList,
      comClassItem: comClassList[index]
    })
  },
  //长按修改课程名称
  handleLongPress: function(e){
    let item = e.currentTarget.dataset.item

    wx.navigateTo({
      url: '../updateClass/updateClass?id=' + item.ID + '&childrenID=' + this.data.childrenID,
    })
  },
  //点击添加课程名称
  addClass: function(e){
    wx.navigateTo({
      url: '../updateClass/updateClass?childrenID=' + this.data.childrenID,
    })
  },
  //初始化数据
  setInitData: function (childrenID, isFrom){
    let that = this,
      classWidth = (app.globalData.windowWidth * app.globalData.pxRate - 20 - 20 - 60) / 4 - 4,
      weekWidth = (app.globalData.windowWidth * app.globalData.pxRate - 52)/7;

    wx.request({
      url: app.globalData.url + '/ChildrenStandardCourse/Index', //仅为示例，并非真实的接口地址
      data: {
        childrenID: childrenID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let list = res.data.Data

        wx.request({
          url: app.globalData.url + '/DefaultCourseSetting/GetDefaultCourseSettingByChildrenID', //仅为示例，并非真实的接口地址
          data: {
            childrenID: childrenID
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            let value = res.data.Data

            list = list.map((o,index)=>{
              if (!value || !value.IsOpen) {
                if (index == 0) {
                  o.className = 'commonColor'
                } else {
                  o.className = ''
                }
              } else {
                if (index == 0) {
                  o.className = 'specialColor' + value.CourseType
                } else {
                  o.className = ''
                }
              }

              return o
            })

            that.setData({
              childrenID: childrenID,
              classWidth: classWidth,
              weekWidth: weekWidth,
              comClassList: list,
              comClassItem: !!list[0] ? list[0] : undefined,
              model: value
            })

            if (!!isFrom && isFrom == 'onShow') {
              if (that.data.isRefresh == 'isRefresh'){
                that.setData({
                  isRefresh: null
                })
                that.setClassData(childrenID);
              }
            } else {
              that.setClassData(childrenID);
            }

          }
        })
      }
    })
  },

  //查询日历
  setClassData: function (childrenID) {
    let that = this,
      query = {
        "childrenID": childrenID,
        "page": 1,
        "pageSize": 7
      }

    wx.request({
      url: app.globalData.url + '/Course/Index', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let dateList = res.data.Data

        that.setClassBodyData(dateList, query)
      }
    })
  },

  //查询课程，设置课程
  setClassBodyData: function (dateList, query) {debugger
    let that = this,
      startDate = dateList[0].StartTime + ' 00:00',
      endDate = dateList[dateList.length - 1].StartTime + ' 23:59:59'

    wx.request({
      url: app.globalData.url + '/Course/GetChildrenCourseByDateFormatOfEasy', //仅为示例，并非真实的接口地址
      data: { 
        childrenID: query.childrenID, 
        startTime: startDate, 
        endTime: endDate,
        courseClassType: 1,
        publicCourseInfoID: 0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {debugger
        let value = res.data.Data;

        wx.getSystemInfo({
          success: function (res) {
            let bodyH = res.windowHeight - 10 - 28 - 30 - 55 - 8;

            dateList = that.setDateList(dateList)
            let month = Number(dateList[0].StartTime.split('-')[1])

            that.setData({
              morningList: value.morningList,
              afternoonList: value.afternoonList,
              nightList: value.nightList,
              dateList: dateList,
              month: month,
              page: query.page,
              query: query,
              childrenID: query.childrenID,
              bodyHeight: bodyH * 2
            })
          }
        });
      },
      fail: function (error) {
        console.log(error)
        wx.showToast({
          title: '请求超时，请稍后再试',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    })

  },

  //设置时间戳
  setDateList: function (dateList) {
    dateList.map((o, index) => {
      let startTimeStamp = Date.parse(o.StartTime.split('-').join('/') + " 00:00:00")//当前日期时间戳

      dateList[index].className = startTimeStamp < timestamp ? 'lastDate' : (startTimeStamp > timestamp ? 'nextDate' : '')

      if (!!o.IsToday) {
        dateList[index].className = 'isToday'
      }
      dateList[index].curWeek = o.DayOfWeek.substr(2)
      dateList[index].curDay = o.StartTime.split('-')[2]
    })

    return dateList
  },

  //点击课程或加号
  classClick: function(e){
    let index = e.currentTarget.dataset.index,
      classindex = e.currentTarget.dataset.classindex,
      isfrom = e.currentTarget.dataset.isfrom,
      listName = isfrom == 'morning' ? 'morningList' : (isfrom == 'afternoon' ? 'afternoonList' : 'nightList'),
      curList = this.data[listName],
      comClassItem = this.data.comClassItem,
      obj={};

    if (!curList[index][classindex].CourseName){
      curList[index][classindex].CourseName = comClassItem.CourseName
    }else{
      curList[index][classindex].CourseName = null
    }

    obj[listName] = curList

    this.setData(obj)
  },

  //长按课次编辑当节课信息
  classLongPress: function(e){debugger 
    let index = e.currentTarget.dataset.index,
      classindex = e.currentTarget.dataset.classindex,
      isfrom = e.currentTarget.dataset.isfrom,
      listName = isfrom == 'morning' ? 'morningList' : (isfrom == 'afternoon' ? 'afternoonList' : 'nightList'),
      curList = this.data[listName],
      curClassItem = curList[index][classindex],
      date = curClassItem.StartTime.split(' ')[0];

    curClassItem = JSON.stringify(curClassItem)

    wx.navigateTo({
      url: '../setAgenda/setAgenda?childrenID=' + this.data.childrenID + '&date=' + date + '&isFrom=' + 'BatchAdd' + '&index=' + index + '&classindex=' + classindex + '&listName=' + listName + '&classItem=' + curClassItem
    })

    // if (!!curClassItem.ID){
    //   wx.navigateTo({
    //     url: '../setAgenda/setAgenda?childrenID=' + this.data.childrenID + '&date=' + curClassItem.StartTime.split(' ')[0] + '&ID=' + curClassItem.ID + '&isFrom=' + 'BatchAdd' + '&index=' + index + '&classindex=' + classindex + '&listName=' + listName
    //   })
    // } else if (!curClassItem.ID && !!curClassItem.CourseName){
    //   wx.navigateTo({
    //     url: '../setAgenda/setAgenda?childrenID=' + this.data.childrenID + '&date=' + curClassItem.StartTime.split(' ')[0] + '&courseName=' + curClassItem.CourseName + '&isFrom=' + 'BatchAdd' + '&index=' + index + '&classindex=' + classindex + '&listName=' + listName
    //   })
    // }
  },

  //课程默认设置
  defaultSetting: function () {
    wx.navigateTo({
      url: '../defaultSetting/defaultSetting?childrenID=' + this.data.childrenID,
    })
  },

  //保存
  save: function(){
    let that = this,
      morningList = that.data.morningList,
      afternoonList = that.data.afternoonList,
      nightList = that.data.nightList,
      modelList = [];//morningList.concat(afternoonList, nightList);
    
    morningList.map(o=>{
      modelList = modelList.concat(o)
    })

    afternoonList.map(o => {
      modelList = modelList.concat(o)
    })

    nightList.map(o => {
      modelList = modelList.concat(o)
    })

    wx.request({
      url: app.globalData.url + '/Course/SaveList', //仅为示例，并非真实的接口地址
      data: {
        modelList: JSON.stringify(modelList),
        childrenID: that.data.childrenID,
        publicCourseInfoID: '',
        courseClassType: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {debugger
        if (!!res.data.Status) {
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })

          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          if (res.data.Result == '700'){

            wx.showModal({
              title: '提示',
              content: '您未进行课程默认设置，请长按单独设置课程。',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                 
                } else if (res.cancel) {

                }
              }
            })
          }else{
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        }
      },
      fail: function (error) {
        console.log(error)
        wx.showToast({
          title: '请求超时，请稍后再试',
          icon: 'none',
          duration: 1500,
          mask: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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