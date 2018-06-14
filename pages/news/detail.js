// pages/news/detail.js
var app=getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    info:{},
    carts:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
    })
    
    this.detail();//加载详情
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  detail:function(){
    var that= this;
    console.log(this.data.id)
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/detail',
      data:{
        id: that.data.id,
      },
      method:'post',
      header:{
        'Content-Type':'application/x-www-form-urlencoded',
      },
      success:function(res){
        var data = res.data;
        console.log(data.info);
        if(data.status=0){
          wx.showToast({
            title: data.err,
            duration:3000
          })
        }else{
          var content = data.info.content;
          WxParse.wxParse('content', 'html', content, that, 3);
          that.setData({
            info :data.info,
            carts :data.carts,
          })
        }

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})