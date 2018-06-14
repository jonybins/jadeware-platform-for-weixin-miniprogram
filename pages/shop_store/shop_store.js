// pages/shop_store/shop_store.js
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    shopInfo:{},
    proList:[],
    tabArr: { 
      curHdIndex: 0, 
      curBdIndex: 0 
    }, 
    current: 0,
    page:2,
  },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
  },
//窗体加载事件  
onLoad: function (options) {
  var sid = options.shopId;
  var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shangchang/index',
      method:'post',
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        var pro = res.data.pro;
        console.log(res);
        var status = res.data.status;
        if(status==1){
           that.setData({
            proList:pro,
          });
        }else{
          // wx.showToast({
          //   title: res.data.err,
          //   duration: 2000
          // });
        }
      },
      error:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
},
getMore: function (e) {
  var that = this;
  var page = that.data.page;
  wx.request({
    url: app.d.ceshiUrl + '/Api/Shangchang/index',
    method: 'post',
    data: { page: page },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var pro = res.data.pro;
      if (pro == '') {
        wx.showToast({
          title: '没有更多数据！',
          duration: 2000
        });
        return false;
      }
      that.setData({
        page: page + 1,
        proList: that.data.proList.concat(pro)
      });
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    }
  })
},
  //详情页跳转
lookdetail: function (e) {
    console.log(e)
    var lookid = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: "../index/detail?id=" + lookid.id
    })
  },
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  changeSlider: function (e) {
    this.setData({
      current: e.detail.current
    })
  },

})
