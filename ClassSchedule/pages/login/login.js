const app = getApp()

Page({
  data: {

  },
  onLoad: function() {
    let that = this;

    wx.hideShareMenu()
    wx.login({
      success: function(res) {
        debugger
        wx.request({
          //获取openid接口
          url: app.globalData.url + '/WeChatAppAuthorize/GetOpenIdAndSessionKeyString',
          data: {
            code: res.code,
          },
          success: function(res) {
            debugger
            let data = JSON.parse(res.data.Data);

            app.globalData.openID = data.openid,
            app.globalData.session_key = data.session_key

            if (!!data.openid) {
              that.accredit()
            }
          }
        })
      }
    })
  },
  accredit: function() {
    wx.request({
      url: app.globalData.url + '/Children/Index', //仅为示例，并非真实的接口地址
      data: {
        openID: app.globalData.openID
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (!!res.data.Data[0]) {
          wx.switchTab({ //跳转到tabBar页面，并关闭其他所有tabBar页面
            url: "/pages/calendar/calendar"
          })
        }else{
          wx.redirectTo({
            url: "/pages/home/home"
          })
        }
      }
    })
  },

  //保存
  save: function(e) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/WeChatAppAuthorize/GetToken',
      data: {},
      success: function(res) {
        debugger
        let data = JSON.parse(res.data.Data)

        that.setInfoTemplate(e.detail.formId, data.access_token)
      }
    })
    //this.setInfoTemplate(e.detail.formId)
  },

  //设置消息提醒模板
  setInfoTemplate: function(formId, access_token) {
    var openId = app.globalData.openID;
    var messageDemo = {
      touser: openId, //openId
      template_id: '4enGevzsNuqrNO6UmM3YyMzfgLMadYIBkqdGXgb4oOA', //模板消息id，  
      page: 'pages/setAgenda/setAgenda?childrenID=' + this.data.childrenID + '&date=' + this.data.date + '&ID=' + this.data.ID, //点击详情时跳转的主页
      form_id: formId, //formId
      data: { //下面的keyword*是设置的模板消息的关键词变量  
        "keyword1": {
          "value": '2018年7月23日 15:00'
        },
        "keyword2": {
          "value": '钢琴'
        },
        "keyword3": {
          "value": 'ddd'
        },
        "keyword4": {
          "value": '北京市昌平区沙河镇小沙河存'
        }
      }
    }

    wx.request({
      url: app.globalData.url + '/WeChatAppAuthorize/SendTemplateMsg',
      data: {
        accessToken: access_token,
        data: messageDemo
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {

      },
      fail: function(err) {

      }
    });
  },

  //保存
  sendMsg: function (e) {
    let that = this;
    wx.request({
      url: app.globalData.url + '/WeChatAppAuthorize/GetToken',
      data: {},
      success: function (res) {
        debugger
        let data = JSON.parse(res.data.Data)

        that.setInfoTemplate2(e.detail.formId, data.access_token)
      }
    })
    //this.setInfoTemplate(e.detail.formId)
  },

  //设置消息提醒模板
  setInfoTemplate2: function (formId, access_token) {
    var openId = app.globalData.openID;
    var messageDemo = {
      touser: openId, //openId
      template_id: '4enGevzsNuqrNO6UmM3YyMzfgLMadYIBkqdGXgb4oOA', //模板消息id，  
      page: 'pages/setAgenda/setAgenda?childrenID=' + this.data.childrenID + '&date=' + this.data.date + '&ID=' + this.data.ID, //点击详情时跳转的主页
      form_id: formId, //formId
      data: { //下面的keyword*是设置的模板消息的关键词变量  
        "keyword1": {
          "value": '2018年7月23日 15:00'
        },
        "keyword2": {
          "value": '英语'
        },
        "keyword3": {
          "value": 'lll'
        },
        "keyword4": {
          "value": '北京市昌平差顺沙路'
        }
      }
    }

    wx.request({
      url: app.globalData.url + '/WeChatAppAuthorize/SendMsgAsync',
      data: {
        accessToken: access_token,
        data: messageDemo,
        StartTime: '2018-7-24' + ' 09:30:00',
        RemindTime: '10'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

      },
      fail: function (err) {

      }
    });
  }


})