var app = getApp();
// pages/cart/cart.js
Page({
  data:{
    page:1,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    total: 0,
    carts: []
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    var that = this;
    that.loadData();
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

onLoad:function(options){
    this.loadData();
},

// onShow:function(){
//   this.loadData();
// },
moreD:function(e){
  var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail?id='+id,
    })
  },
// 数据案例
  loadData:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shopping/index',
      method:'post',
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var cart = res.data.cart;
        that.setData({
          carts:cart,
        });
        //endInitData
      },
    });
  },

})