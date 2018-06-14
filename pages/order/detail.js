var app = getApp();
// pages/order/detail.js
Page({
  data:{
    uid:0,
    dowData:{},
  },
  onLoad:function(options){
    this.loadProductDetail();
  },
  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/index',
      method:'post',
      data: {
        uid: app.d.userId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var status = res.data.status;
        if(status==1){
          var info = res.data.list;
          that.setData({
            dowData:info,
          })
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
      }
    });
  },

})