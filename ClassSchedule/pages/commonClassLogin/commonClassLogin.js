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
  onLoad: function (options) {
    let that = this,
      publicBoxType = options.publicBoxType,
      commonClassName = !!options.commonClassName ? options.commonClassName : (publicBoxType == -1 ? '家庭账户' : '班级账户')

    that.setData({
      publicBoxType: publicBoxType,
      commonClassName: commonClassName
    })

    wx.hideShareMenu()

    this.tempData(publicBoxType);
  },

  onShow(options) { //返回显示页面状态函数
    let publicBoxType = !!options && !!options.publicBoxType ? options.publicBoxType : this.data.publicBoxType

    this.tempData(publicBoxType)//再次加载，实现返回上一页页面刷新
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
      url: '../commonClassSignUp/commonClassSignUp?publicBoxType=' + this.data.publicBoxType
    })
  },

  //设置数据
  tempData: function (publicBoxType) {
    let that = this;

    wx.request({
      url: app.globalData.url + '/PublicBox/Index',
      data: {
        openID: app.globalData.openID,
        publicBoxType: publicBoxType
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let list = res.data.Data

        that.setData({
          list: list,
          publicBoxType: publicBoxType
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
      url: that.data.url + '/PublicBox/GetPublicBoxByLoginNameAndPassword', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let obj = res.data.Data

        if (!obj) {
          wx.showToast({
            title: '用户名或密码错误，请检查',
            icon: 'none',
            duration: 1500,
            mask: true
          })
          return
        }

        // wx.navigateTo({
        //   url: '../commonClass/commonClass?id=' + obj.ID + '&comonClassTitle=' + obj.Name + '&publicCourseTypeID=' + obj.PublicCourseTypeID + '&outOpenId=' + obj.OpenID
        // })

        wx.navigateTo({
          url: '../sharedSpace/sharedSpace?id=' + obj.model.ID + '&name=' + obj.model.Name + '&publicBoxType=' + obj.model.publicBoxType + '&outOpenId=' + obj.model.OpenID
        })
      }
    })
  },

  //打开课程表
  openCommonClass: function(e){debugger
    // wx.navigateTo({
    //   url: '../commonClass/commonClass?id=' + e.currentTarget.dataset.item.ID + '&comonClassTitle=' + e.currentTarget.dataset.item.Name + '&publicCourseTypeID=' + this.data.publicCourseTypeID + '&outOpenId=' + app.globalData.openID
    // })

    wx.navigateTo({
      url: '../sharedSpace/sharedSpace?id=' + e.currentTarget.dataset.item.ID + '&name=' + e.currentTarget.dataset.item.Name + '&publicBoxType=' + this.data.publicBoxType + '&outOpenId=' + app.globalData.openID
    })
  },

  //编辑课程信息
  editInfo: function (e) {
    wx.navigateTo({
      url: '../commonClassSignUp/commonClassSignUp?publicBoxType=' + this.data.publicBoxType + '&id=' + e.currentTarget.dataset.item.ID
    })
  }
})