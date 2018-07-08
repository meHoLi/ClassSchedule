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
    src:"../../imgs/head/head.png",

    name:'',

    date: currentDate,
    endDate: currentDate,

    gender: ['男', '女'],
    genderList: [
      { id: 0, name: '男' },
      { id: 1, name: '女' }
    ],
    genderValue: 0,

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
    curRadio: '#54cbf0',
    radioW: 0
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        mradioW = (res.windowWidth - 20 -30) / 3; //设置tab的宽度
        that.setData({
          radioW: mradioW
        })
      }
    });

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
      name: e.detail.value
    })
  },
  //选择生日
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //选择性别
  bindPickerChange: function (e) {
    this.setData({
      genderValue: e.detail.value
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
      this.data.curRadio = this.data.radio[index].value
    }
    let userRadio = radio.filter((item, index) => {
      return item.checked == true;
    })
    this.setData({ 
      radio: this.data.radio,
      curRadio: this.data.curRadio
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