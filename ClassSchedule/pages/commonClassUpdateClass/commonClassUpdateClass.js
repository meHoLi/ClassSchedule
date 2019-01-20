// pages/commonClassUpdateClass/commonClassUpdateClass.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: app.globalData.url ? app.globalData.url : 'https://www.xiaoshangbang.com',
    CourseName: '', //课程名称
  },
  onLoad: function (options) {
    let that = this;

    wx.hideShareMenu()

    if (!!options.id) {
      that.setAgendaData(options)
    } else {
      this.setData({
        ChildrenID: options.childrenID
      })
    }
  },

  //录入课程
  setClassNameInput: function (e) {
    this.setData({
      CourseName: e.detail.value
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
      content: '确定要删除该课程吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: that.data.url + '/ChildrenStandardCourse/Delete',
            data: { id: that.data.ID },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {

              if (!!res.data.Status) {
                wx.showToast({
                  title: '课程删除成功',
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
                  title: '课程删除失败',
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
        CourseName: data.CourseName,
      }

    if (!query.CourseName) {
      wx.showToast({
        title: '请填写课程名称',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    if (!!data.ID) {
      query.ID = data.ID
      query.Sort = data.Sort

      wx.request({
        url: that.data.url + '/ChildrenStandardCourse/Update',
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {

          if (!!res.data.Status) {
            wx.showToast({
              title: '课程保存成功',
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
              title: '课程保存失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
        }
      })
    } else {
      wx.request({
        url: that.data.url + '/ChildrenStandardCourse/Add', //仅为示例，并非真实的接口地址
        data: query,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (!!res.data.Status) {
            wx.showToast({
              title: '课程保存成功',
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
              title: '课程保存失败',
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
  setAgendaData: function (options) {
    let that = this

    wx.request({
      url: that.data.url + '/ChildrenStandardCourse/GetChildrenStandardCourseByID', //仅为示例，并非真实的接口地址
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger
        let value = res.data.Data

        that.setData({
          ChildrenID: value.ChildrenID,
          CourseName: value.CourseName,
          ID: value.ID,
          Sort: value.Sort
        })
      }
    })
  },


})