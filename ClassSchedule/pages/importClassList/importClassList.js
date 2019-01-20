// pages/importClassList/importClassList.js
const app = getApp()

Page({
  data: {

  },
  onLoad: function (options) {debugger
    // 页面初始化 options为页面跳转所带来的参数
    let that = this,
      publicBoxID = !!options ? options.id : that.data.publicBoxID,
      publicBoxType = !!options ? options.publicBoxType : that.data.publicBoxType,
      name = !!options ? options.name : that.data.name,
      outOpenId = !!options ? options.outOpenId : that.data.outOpenId,
      childrenID = !!options ? options.childrenID : that.data.childrenID,
      toPublicCourseInfoID = !!options ? options.toPublicCourseInfoID : that.data.toPublicCourseInfoID

    this.setData({
      name: name,
      publicBoxID: publicBoxID,
      publicBoxType: publicBoxType,
      outOpenId: outOpenId,
      childrenID: childrenID,
      toPublicCourseInfoID: toPublicCourseInfoID
    })

    this.tempData();
  },
  onShow() { //返回显示页面状态函数
    this.onLoad()//再次加载，实现返回上一页页面刷新
  },

  //设置数据
  tempData: function () {
    let that = this;

    wx.request({
      url: app.globalData.url + '/PublicCourseInfo/Index',
      data: {
        openID: app.globalData.openID,
        publicBoxID: that.data.publicBoxID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let list = res.data.Data

        that.setData({
          familyCurriculum: list.familyCurriculum
        })
      }
    })
  },

  // 点击课程表
  toCommonClass: function (e) {
    debugger
    let item = e.currentTarget.dataset.item

    // wx.navigateTo({
    //   url: '../commonClass/commonClass?publicCourseTypeID=' + item.PublicCourseTypeID + '&comonClassTitle=' + item.Name + '&outOpenId=' + item.OpenID + '&id=' + item.ID
    // })
    
    wx.navigateTo({
      url: '../importClass/importClass?id=' + item.ID + '&comonClassTitle=' + item.Name + '&publicCourseTypeID=' + item.PublicCourseTypeID + '&childrenID=' + this.data.childrenID + '&toPublicCourseInfoID=' + this.data.toPublicCourseInfoID
    })
  },

  //修改公共课程表信息
  editInfo: function (e) {
    let item = e.currentTarget.dataset.item,
      id = item.ID

    wx.navigateTo({
      url: '../commonSignUpClass/commonSignUpClass?publicBoxType=' + this.data.publicBoxType + '&publicBoxID=' + this.data.publicBoxID + "&id=" + id
    })
  },

  // 新增公共课程表
  addNewClass: function () {

    wx.navigateTo({
      url: '../commonSignUpClass/commonSignUpClass?publicBoxType=' + this.data.publicBoxType + '&publicBoxID=' + this.data.publicBoxID
    })
  }

})