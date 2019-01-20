// pages/addDetailedDetails/addDetailedDetails.js
const app = getApp()
let util = require('../../utils/util.js');
let myDate = new Date(); //获取系统当前时间
let year = myDate.getFullYear()
let month = myDate.getMonth() + 1
let day = myDate.getDate()
let currentDate = '' + year + '-' + (month < 10 ? '0' + Number(month) : month) + '-' + (day < 10 ? '0' + Number(day) : day)//myDate.toLocaleDateString(); //获取当前日期

Page({
  data: {
    hiddenmodalput: true
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
    wx.hideShareMenu()

    if (!!options.id){
      this.setData({
        id:options.id,
        name:options.name
      })
    }
    this.detailedListData();
  },
  onShow() { //返回显示页面状态函数

    if (!!this.id){
      this.onLoad()//再次加载，实现返回上一页页面刷新
    }
  },

  //设置清单数据
  detailedListData: function () {
    let that = this;

    wx.request({
      url: app.globalData.url + '/Memorandum/GetListByGroupID', //仅为示例，并非真实的接口地址
      data: {
        "groupID": that.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {debugger
        let detailedList = res.data.Data;

        if (!!detailedList[0]) {
          that.setData({
            noClassDis: 'none',
            haveClassDis: 'block',
            detailedList: detailedList
          });
        } else {
          that.setData({
            noClassDis: 'block',
            haveClassDis: 'none',
            detailedList: detailedList
          });
        }
      }
    })
  },
  //新增清单
  addNewDetailed: function () {
    this.setData({
      hiddenmodalput: false
    })
  },
  //输入清单名称
  detailedName: function (e) {
    this.setData({
      detailedName: e.detail.value
    })
  },
  //取消
  handleCancel: function () {
    this.setData({
      hiddenmodalput: true,
      detailedId: '',
      detailedName: ''
    })
  },
  //确定添加
  handleConfirm: function () {
    let that = this;

    if (!that.data.detailedName) {
      wx.showToast({
        title: '请填写清单名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (!that.data.detailedId) {
      wx.request({
        url: app.globalData.url + '/Memorandum/Add', //仅为示例，并非真实的接口地址
        data: {
          groupID: that.data.id,
          OpenID: app.globalData.openID,
          MemorandumContent: that.data.detailedName,
          Type: 2
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          debugger
          if (!res.data.Status) {
            wx.showToast({
              title: '添加失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            return
          }
          that.setData({
            hiddenmodalput: true,
            detailedId: '',
            detailedName: ''
          })

          that.detailedListData();
        }
      })
    } else {
      wx.request({
        url: app.globalData.url + '/Memorandum/Update', //仅为示例，并非真实的接口地址
        data: {
          groupID: that.data.id,
          OpenID: app.globalData.openID,
          MemorandumContent: that.data.detailedName,
          Id: that.data.detailedId,
          Type: 2
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          debugger
          if (!res.data.Status) {
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
            return
          }
          that.setData({
            hiddenmodalput: true,
            detailedId: '',
            detailedName: ''
          })

          that.detailedListData();
        }
      })
    }



  },
  //编辑清单名称
  editDetaileInfo: function (e) {
    debugger
    let id = e.target.dataset.item.ID,
      MemorandumContent = e.target.dataset.item.MemorandumContent;

    this.setData({
      hiddenmodalput: false,
      detailedId: id,
      detailedName: MemorandumContent
    })
  },

  //删除整个清单
  delAllDetailed: function(){
    let that = this;

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/MemorandumGroup/Delete', //仅为示例，并非真实的接口地址
            data: {
              "id": that.data.id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              if (!res.data.Status) {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
                return
              }
              wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 1000,
                mask: true
              })

              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

})