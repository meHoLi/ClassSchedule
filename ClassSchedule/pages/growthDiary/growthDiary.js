// pages/growthDiary /growthDiary .js
const app = getApp()
let util = require('../../utils/util.js');
let myDate = new Date(); //获取系统当前时间
let year = myDate.getFullYear()
let month = myDate.getMonth() + 1
let day = myDate.getDate()
let currentDate = '' + year + '-' + (month < 10 ? '0' + Number(month) : month) + '-' + (day < 10 ? '0' + Number(day) : day)//myDate.toLocaleDateString(); //获取当前日期
let faceList = [
  "/imgs/face/0.gif",
  "/imgs/face/1.gif",
  "/imgs/face/10.gif",
  "/imgs/face/11.gif",
  "/imgs/face/13.gif",
  "/imgs/face/21.gif",
  "/imgs/face/28.gif",
  "/imgs/face/9.gif"
]
let weatherList = [
  "/imgs/weather/562694.png",
  "/imgs/weather/562696.png",
  "/imgs/weather/562697.png",
  "/imgs/weather/562698.png",
  "/imgs/weather/562699.png",
  "/imgs/weather/562700.png"
]

Page({
  data: {
    ratio: 150/105,
    originUrl: '',

    growthDiaryDis: true,
    // growthDiaryPreviewDis: false,
    hiddenmodalput: true,
    imgList: [
      // { url: '../../imgs/head/head.png' }
    ],
    faceList: faceList,
    myMood: '',
    weatherList: weatherList,
    weather: '',
    radioList: [
      { name: '仅自己可见', value: 1, checked: true},
      { name: '家庭成员可见', value: 2 }
    ],
    radioChecked: 1,
    hiddenmodalput: true,
    showData: null
  },
  onLoad: function (options) {
    let that = this,
      growthDiaryDis = this.data.growthDiaryDis,
      publicBoxID = !!options && !!options.publicBoxID ? options.publicBoxID : (!!this.data.publicBoxID ? this.data.publicBoxID : null);

    // 页面初始化 options为页面跳转所带来的参数
    wx.hideShareMenu()

    this.initEleWidth();

    wx.getSystemInfo({
      success: function (res) {
        let winHeight = res.windowHeight * app.globalData.pxRate,
          bodyHeight = winHeight - 70,
          diaryInputHeight = bodyHeight/4;

        that.setData({
          bodyHeight: bodyHeight,
          diaryInputHeight: diaryInputHeight,
          publicBoxID: publicBoxID
        });

        if (!growthDiaryDis) {
          that.happyTimeData();
        }else{
          
        }
      }
    });
  },
  onShow() { //返回显示页面状态函数
    if (!!this.data.isEmptyDiary){
      let radioList = [
        { name: '仅自己可见', value: 1, checked: true },
        { name: '家庭成员可见', value: 2 }
      ]

      this.setData({
        ID: '',
        myMood: '',
        weather: '',
        diary: '',
        imgList: [],
        isEmptyDiary: false,
        radioChecked: 1,
        radioList: radioList,
        showData: null
      })
    }
    this.onLoad()//再次加载，实现返回上一页页面刷新
  },

  ///////////////成长日记///////////////
  //展开心情图标
  unfoldFaceList: function(){
    this.setData({
      faceClassName: 'width100'
    })
  },
  //设置心情
  selectFace: function(e){
    let item = e.currentTarget.dataset.item

    this.setData({
      myMood: item,
      faceClassName: 'width0'
    })
  },
  //展开天气图标
  unfoldWeatherList: function () {
    this.setData({
      weatherClassName: 'width100'
    })
  },
  //设置天气
  selectWeather: function (e) {
    let item = e.currentTarget.dataset.item

    this.setData({
      weather: item,
      weatherClassName: 'width0'
    })
  },
  //设置心情日记内容
  setDiaryInput: function (e) {
    this.setData({
      diary: e.detail.value
    })
  },

  //单选框处理
  radioChange: function (e) {
    let that = this,
      value = e.detail.value,
      data = this.data,
      radioList = this.data.radioList,
      item = radioList.filter(item => { return item.value == value })[0],
      radioChecked = item.value,
      hiddenmodalput = false;

    if (radioChecked == 2){
      hiddenmodalput = false
    }else{
      hiddenmodalput = true
    }
    that.setData({
      radioChecked: radioChecked,
      hiddenmodalput: hiddenmodalput,
      sharePublicBoxID: ''
    });
  },

  handleConfirm: function(){
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
      url: app.globalData.url +  '/PublicBox/GetPublicBoxByLoginNameAndPassword', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger
        let obj = res.data.Data

        if (!obj) {
          wx.showToast({
            title: '用户名或密码错误，请检查',
            icon: 'none',
            duration: 1500,
            mask: true
          })
          return
        }else{
          wx.showToast({
            title: '登陆成功',
            icon: 'none',
            duration: 1000,
            mask: true
          })

          that.setData({
            hiddenmodalput: true,
            comClassUserName: '',
            passWord: '',
            sharePublicBoxID: obj.model.ID
          })
        }
      }
    })
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

  //上传图片
  setUploadImg: function () {
    var that = this,
      imgList = that.data.imgList;

    if (!!imgList[0]){
      wx.showToast({
        title: '亲，只能上传一张照片呦',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return
    }

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {debugger
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        that.setData({
          originUrl: tempFilePaths[0],
        })
        // that.upload(tempFilePaths[0])
      }
    })
  },
  upload: function(path) {
    let that = this;

    wx.showToast({
      icon: "loading",
      title: "正在上传"
    }),
    wx.uploadFile({
      url: app.globalData.url + '/FileUpload/HandleFileSave',
      filePath: path,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        //和服务器约定的token, 一般也可以放在header中
        'session_token': wx.getStorageSync('session_token'),
        domainName: app.globalData.url
      },
      success: function (res) {debugger
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        let filePath = JSON.parse(res.data).Data.filePath,
          imgList = that.data.imgList

        imgList.push({ url: filePath})

        that.setData({ //上传成功修改显示头像
          imgList: imgList,
          originUrl: ''
        })
      },
      fail: function (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
        that.setData({
          originUrl: '',
        })
      },
      complete: function () {
        wx.hideToast(); //隐藏Toast
      }
    })
  },

  getCropperImg(e) {
    this.upload(e.detail.url);
  },

  //发布
  release: function(){
    let that = this,
      data = that.data,
      query = {
        OpenID: app.globalData.openID,
        Mood: data.myMood,
        Weather: data.weather,
        Content: data.diary,
        Img: data.imgList,
      },
      showData = that.data.showData;

    if (!!showData){
      showData = JSON.stringify(showData)
    }

    if(!!data.ID){
      query.ID = data.ID
      query.CreateName = that.data.showData.CreateName
      query.UpdateName = app.globalData.userInfo.nickName
      query.CreateTime = that.data.showData.CreateTime
    }else{
      query.CreateName = app.globalData.userInfo.nickName
      query.UpdateName = app.globalData.userInfo.nickName
    }

    if (!!data.publicBoxID){
      query.PublicBoxID = data.publicBoxID//共享空间点进来的ID
    }

    if (!!data.sharePublicBoxID){
      query.SharePublicBoxID = data.sharePublicBoxID//家庭成员可见的ID
    }

    if (!query.Mood) {
      wx.showToast({
        title: '请选择心情',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    } else if (!query.Weather) {
      wx.showToast({
        title: '请选择天气',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    } else if (!query.Content) {
      wx.showToast({
        title: '请输入心情日记',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    query = JSON.stringify(query)

    wx.navigateTo({
      url: '../growthDiaryTemp/growthDiaryTemp?query=' + query + '&showData=' + showData
    })
  },

  ///////////////美好时光///////////////
  //美好时光查询数据
  happyTimeData: function () {
    let that = this,
      data = that.data,
      query = {
        key: '',
        openID: app.globalData.openID
      };

    if (!!data.publicBoxID) {
      query.publicBoxID = data.publicBoxID//共享空间点进来的ID
      query.entrance = 2
    }else{
      query.publicBoxID = 0
      query.entrance = 1
    }

    wx.request({
      url: app.globalData.url + '/GrowthDiary/Index', //仅为示例，并非真实的接口地址
      data: query,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let happyTimeList = that.parseData(res.data.Data);

        if (!!happyTimeList[0]) {
          that.setData({
            noClassDis: 'none',
            haveClassDis: 'block',
            happyTimeList: happyTimeList
          });
        } else {
          that.setData({
            noClassDis: 'block',
            haveClassDis: 'none',
            happyTimeList: happyTimeList
          });
        }
      }
    })
  },
  parseData: function (happyTimeList){
    happyTimeList = happyTimeList.map(o=>{
      o.Img = JSON.parse(o.Img)
      o.time = !!o.CreateTime ? o.CreateTime.split(' ')[0] : o.UpdateTime.split(' ')[0]

      return o
    })

    return happyTimeList
  },

  //美好时光单条查询
  happyTimeDetail: function(e){
    let that = this,
      data = that.data,
      item = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: '../growthDiaryDetails/growthDiaryDetails?id=' + item.ID
    })
  },

  //美好时光单条编辑
  editHappyTime: function (e) {debugger
    let that = this,
      data = that.data,
      item = e.currentTarget.dataset.item;
    
    this.setData({
      ID: item.ID,
      myMood: item.Mood,
      weather: item.Weather,
      diary: item.Content,
      imgList: item.Img,
      showData: {
        CreateName: item.CreateName,
        CreateTime: item.CreateTime,
        UpdateName: item.UpdateName,
        UpdateTime: item.UpdateTime
      },
      growthDiaryDis: true
    })

    // wx.navigateTo({
    //   url: '../growthDiaryTemp/growthDiaryTemp?query=' + query
    // })
  },

  // 开始滑动事件
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置 
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var that = this;

    if (e.touches.length == 1) {
      //手指移动时水平方向位置 
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值 
      var disX = this.data.startX - moveX;
      var editBtnWidth = this.data.editBtnWidth;
      // var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变 
        // txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离 
        // txtStyle = "left:-" + disX + "px";
        if (disX >= editBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度 
          // txtStyle = "left:-" + editBtnWidth + "px";
        }
      }

    }
  },
  // 滑动中事件
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置 
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离 
      var disX = this.data.startX - endX;
      var editBtnWidth = this.data.editBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮 
      var txtStyle = "";
      txtStyle = disX > editBtnWidth / 2 ? "left:-" + editBtnWidth + "px" : "left:0px";

      //获取手指触摸的是哪一项 
      var index = e.currentTarget.dataset.index;
      var happyTimeList = this.data.happyTimeList;

      happyTimeList[index].shows = txtStyle;

      //更新列表的状态 
      this.setData({
        happyTimeList: happyTimeList
      });
    } else {
      console.log("2");
    }
  },

  //获取元素自适应后的实际宽度 
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应 
      // console.log(scale); 
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error 
    }
  },
  initEleWidth: function () {
    var editBtnWidth = this.getEleWidth(150);
    this.setData({
      editBtnWidth: editBtnWidth
    });
  },


  ///////////////页签切换///////////////
  //点击成长日记
  toGrowthDiary: function () {
    let growthDiaryDis = this.data.growthDiaryDis;

    if (!!growthDiaryDis) return

    this.setData({
      growthDiaryDis: true
    })
  },
  //点击美好时光
  toHappyTime: function () {
    let growthDiaryDis = this.data.growthDiaryDis

    if (!growthDiaryDis) return

    this.setData({
      growthDiaryDis: false
    })

    this.happyTimeData();
  },


})