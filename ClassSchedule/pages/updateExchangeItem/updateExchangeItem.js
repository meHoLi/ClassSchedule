// pages/updateExchangeItem/updateExchangeItem.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    Name: '', 
  },
  onLoad: function (options) {
    let that = this;

    wx.hideShareMenu()

    if (!!options.id) {
      that.setExchangeData(options)
    } else {
      this.setData({
        ChildrenID: options.childrenID
      })
    }
  },

  //录入积分兑换项
  setNameInput: function (e) {
    this.setData({
      Name: e.detail.value
    })
  },

  //录入兑换金额
  setValueInput: function(e){
    this.setData({
      Value: e.detail.value
    })
  },

  //取消
  cancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //删除
  del: function () {
    let that = this;

    wx.showModal({
      title: '提示',
      content: '确定要删除该兑换项吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: that.data.url + '/ExchangeProject/Delete',
            data: { id: that.data.ID },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {

              if (!!res.data.Status) {
                wx.showToast({
                  title: '删除成功',
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
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                  duration: 1000,
                  mask: true
                })
              }
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  //保存
  save: function (e) {
    debugger
    let that = this,
      data = this.data,
      query = {
        ChildrenID: data.ChildrenID,
        Name: data.Name,
        Value: data.Value
      }

    if (!query.Name) {
      wx.showToast({
        title: '请填写课程名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    
    if (!query.Value){
      wx.showToast({
        title: '请填写积分兑换数额',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return
    }

    if (!!data.ID) {
      query.ID = data.ID
      query.Sort = data.Sort

      wx.request({
        url: that.data.url + '/ExchangeProject/Update',
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {

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
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        }
      })
    } else {
      query.Sort = 999
      wx.request({
        url: that.data.url + '/ExchangeProject/Add', //仅为示例，并非真实的接口地址
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
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
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        }
      })
    }
  },

  //初始化查询数据
  setExchangeData: function (options) {
    let that = this

    wx.request({
      url: that.data.url + '/ExchangeProject/GetExchangeProjectByID', //仅为示例，并非真实的接口地址
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let value = res.data.Data

        that.setData({
          ChildrenID: value.ChildrenID,
          Name: value.Name,
          Value: value.Value,
          ID: value.ID,
          Sort: value.Sort
        })
      }
    })
  },


})