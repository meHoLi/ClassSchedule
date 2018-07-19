// pages/addNewClass/addNewClass.js
var util = require('../../utils/util.js');
var myDate = new Date();//获取系统当前时间
var currentDate = myDate.toLocaleDateString(); //获取当前日期
var mradioW

Page({

  /**
   * 页面的初始数据
   */
  data: {
    HeadPortrait:"../../imgs/head/head.png",

    Name:'',

    Birthday: currentDate.split('/').join('-'),
    endDate: currentDate.split('/').join('-'),

    gender: ['男', '女'],
    genderList: [
      { id: 0, name: '男' },
      { id: 1, name: '女' }
    ],
    Sex: 0,

    radio: [
      { 'value': '#54cbf0', checked:true },
      { 'value': '#1daca9' },
      { 'value': '#f4b3b3' },
      { 'value': '#ff527f' },
      { 'value': '#f9b72b' },
      { 'value': '#ffda44' },

      { 'value': '#939393' },
      { 'value': '#656565' },
      { 'value': '#3c3c3c' }
    ],
    Background: '#54cbf0',
    radioW: 0
  },
  onLoad: function (options) {debugger
    var that = this;

    if (!!options.id){
      that.setPesonData(options.id)
    }else{
      that.setTabW()
    }
  },

  setPhotoInfo: function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        upload(that, tempFilePaths);
      }
    })
  },
  //录入姓名
  setNameInput: function (e) {
    this.setData({
      Name: e.detail.value
    })
  },
  //选择生日
  bindDateChange: function (e) {
    this.setData({
      Birthday: e.detail.value
    })
  },
  //选择性别
  bindPickerChange: function (e) {
    this.setData({
      Sex: e.detail.value
    })
  },
  //选择单选
  getradio: function (e) {
    let index = e.currentTarget.dataset.id;
    let radio = this.data.radio;
    for (let i = 0; i < radio.length; i++) {
      this.data.radio[i].checked = false;
    }
    if (radio[index].checked) {
      this.data.radio[index].checked = false;
    } else {
      this.data.radio[index].checked = true;
      this.data.Background = this.data.radio[index].value
    }
    let userRadio = radio.filter((item, index) => {
      return item.checked == true;
    })
    this.setData({ 
      radio: this.data.radio,
      Background: this.data.Background
    })
  },
  //取消
  cancel: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  //关闭
  save: function(){
    console.log('保存')
  },


  setPesonData: function(id){
    let that = this;

    wx.request({
      url: 'http://192.168.0.3:61242/Children/GetChildrenByID', //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger
        let data = res.data.Data

        that.setTabW(data)
      }
    })
  },

  setTabW: function (formData){
    let that = this;

    wx.getSystemInfo({
      success: function (res) {
        mradioW = (res.windowWidth - 20 - 30) / 3; //设置tab的宽度

        if (!!formData){
          that.setData({
            ID: formData.ID,
            HeadPortrait: !!formData.HeadPortrait ? formData.HeadPortrait : that.data.HeadPortrait,
            Name: !!formData.Name ? formData.Name : '',
            Birthday: !!formData.Birthday ? formData.Birthday : that.data.Birthday,
            Sex: formData.Sex === null ? that.data.Sex : formData.Sex,
            Background: formData.Background,
            radioW: mradioW
          })
        }else{
          that.setData({
            radioW: mradioW
          })
        }
      }
    });
  }
})

function upload(page, path) {
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  }),
    wx.uploadFile({
      url: constant.SERVER_URL + "/FileUploadServlet",
      filePath: path[0],
      name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'session_token': wx.getStorageSync('session_token')
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        var data = res.data
        page.setData({  //上传成功修改显示头像
          src: path[0]
        })
      },
      fail: function (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
}