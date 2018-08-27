// pages/commonClassLogin/commonClassLogin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    commonClassName: '课程表',

    comClassUserName: '', //公共课程表用户名
    passWord: '', //公共课程表密码
  },
  onLoad: function (options) {debugger
    let that = this,
      publicCourseTypeID = options.publicCourseTypeID,
      commonClassName = !!options.commonClassName ? options.commonClassName : (publicCourseTypeID == -1 ? '家庭课程表' : '班级课程表')

    that.setData({
      publicCourseTypeID: publicCourseTypeID,
      commonClassName: commonClassName
    })

    wx.hideShareMenu()

    this.tempData(publicCourseTypeID);
  },

  onShow(options) { //返回显示页面状态函数
    let publicCourseTypeID = !!options && !!options.publicCourseTypeID ? options.publicCourseTypeID : this.data.publicCourseTypeID

    this.tempData(publicCourseTypeID)//再次加载，实现返回上一页页面刷新
  },

  //录入用户名
  setClassUserNameInput: function (e) {
    this.setData({
      comClassUserName: e.detail.value
    })
  },
  //录入密码
  setPassWord: function (e) {
    this.setData({
      passWord: e.detail.value
    })
  },
  
  //注册
  signUp: function(){
    wx.navigateTo({
      url: '../commonClassSignUp/commonClassSignUp?publicCourseTypeID=' + this.data.publicCourseTypeID
    })
  },

  //设置数据
  tempData: function (publicCourseTypeID) {
    let that = this;

    wx.request({
      url: app.globalData.url + '/PublicCourseInfo/Index',
      data: {
        openID: app.globalData.openID,
        publicCourseTypeID: publicCourseTypeID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let list = res.data.Data

        that.setData({
          list: list,
          publicCourseTypeID: publicCourseTypeID
        })
      }
    })
  },
  
  //登陆
  login: function (e) {
    let that = this,
      data = this.data,
      query = {
        loginName: data.comClassUserName,
        password: data.passWord
      }

    if (!query.loginName) {
      wx.showToast({
        title: '请填写用户名',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    } else if (!query.password) {
      wx.showToast({
        title: '请填写密码',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    wx.request({
      url: that.data.url + '/PublicCourseInfo/GetPublicCourseInfoByLoginNameAndPassword', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {debugger
        let obj = res.data.Data

        wx.navigateTo({
          url: '../commonClass/commonClass?id=' + obj.ID + '&comonClassTitle=' + obj.Name + '&publicCourseTypeID=' + obj.PublicCourseTypeID + '&outOpenId=' + obj.OpenID
        })
      }
    })
  },

  //打开课程表
  openCommonClass: function(e){debugger
    wx.navigateTo({
      url: '../commonClass/commonClass?id=' + e.currentTarget.dataset.item.ID + '&comonClassTitle=' + e.currentTarget.dataset.item.Name + '&publicCourseTypeID=' + this.data.publicCourseTypeID + '&outOpenId=' + app.globalData.openID
    })
  },

  //编辑课程信息
  editInfo: function (e) {
    wx.navigateTo({
      url: '../commonClassSignUp/commonClassSignUp?publicCourseTypeID=' + this.data.publicCourseTypeID + '&id=' + e.currentTarget.dataset.item.ID
    })
  }
})