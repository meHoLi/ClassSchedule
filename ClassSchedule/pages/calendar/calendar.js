// pages/calendar/calendar.js
var mtabW
Page({
  data: {
    list:[],
    activeIndex: 0,
    slideOffset: 0,
    tabW: 0,
    isUnfoldType: false
  },

  onLoad: function () {
    var that = this;
    this.setTabData();

    wx.getSystemInfo({
      success: function (res) {
        
        mtabW = (res.windowWidth - 20 - 8) / 3; //设置tab的宽度
        that.setData({
          tabW: mtabW
        })
      }
    });

  },

  //点击左上角折叠展开按钮
  isUnfold: function(){
    if (!this.data.isUnfoldType){
      this.setData({
        isUnfoldType: true
      })
    }else{
      this.setData({
        isUnfoldType: false
      })
    }
  },

  //点击新增和具体的日期项
  addClassTable: function () {
    wx.navigateTo({
      url: '../addNewClass/addNewClass'
    })
  },

  //页签切换
  tabClick: function (e) {
    var that = this;
    var idIndex = e.currentTarget.id;
    var offsetW = e.currentTarget.offsetLeft; //2种方法获取距离文档左边有多少距离
    this.setData({
      activeIndex: idIndex,
      slideOffset: offsetW
    });
  },
  //页签项滑动切换
  bindChange: function (e) {
    var current = e.detail.current;
    if ((current + 1) % 4 == 0) {

    }
    var offsetW = current * mtabW; //2种方法获取距离文档左边有多少距离
    this.setData({
      activeIndex: current,
      slideOffset: offsetW
    });
  },

  //设置数据
  setTabData: function(){
    let list = [
      {
        tab: "李大宝的课程表",
        headUrl: "/imgs/head/boy.png",
        txt: "向左滑动可以删除"
      },
      {
        tab: "李二宝的课程表",
        headUrl: "/imgs/head/girl.png",
        txt: "微信小程序|联盟（wxapp-union.com）"
      },
      {
        tab: "李小宝的课程表",
        headUrl: "/imgs/head/girl1.png",
        txt: "圣诞老人是爸爸，顺着烟囱往下爬，礼物塞满圣诞袜，平安糖果一大把"
      }
    ];
    this.setData({
      list: list
    });
  }
})