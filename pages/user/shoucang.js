var app = getApp();
// pages/user/shoucang.js
Page({
  data:{
    page:1,
    callback:5,
    productData:[],
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    isNullList: true,   // 用于判断orderList数组是不是空数组，默认true，空的数组 
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    var that = this;
    that.setData({
      productData: [],
    });
    that.loadProductData();
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //下拉加载
  onReachBottom(e) {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        page: that.data.page + 1,  //每次触发上拉事件，把searchPageNum+1  
       // isNullList: false  //触发到上拉事件，把isNullList设为为false  
      });
      that.loadProductData();
    }
  },
  onLoad:function(options){
    if(app.d.userId==0){
      wx.showToast({
        title: '请先登录',
      })
    }
    this.loadProductData();
  },

  removeFavorites:function(e){
    var that = this;
    console.log(e)
    var pid = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Product/remove',
          method:'post',
          data: {
            uid:app.d.userId,
            pid:pid,
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.data;
            //todo
            if(data.status == '1'){
              that.onPullDownRefresh();
            }else{
              wx.showToast({
                title: data.err,
                duration:3000
              })
            }
          },
        });

      }
    });
  },
  loadProductData:function(){
    var that = this;
    if (app.d.userId == 0) {
      wx.showToast({
        title: '请先登录',
      })
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/product/shoucang',
      method:'post',
      data: {
        userId: app.d.userId,
        page: that.data.page,
        callback:that.data.callback,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var data = res.data.data;
        var status = res.data.status;
        var nu = res.data.i;
        if(status == 1){
          that.initProductData(data);
        if(nu < that.data.callback){
          that.setData({
            productData: that.data.productData.concat(data),
            //searchLoading: true   //把"上拉加载"的变量设为true，显示
          });
        }else{
          that.setData({
            productData: that.data.productData.concat(data),
            searchLoading: true   //把"上拉加载"的变量设为true，显示
          });
        }
          
        }else{
          that.setData({
            searchLoadingComplete: false, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
          });
        }
         
        //endInitData
      },
    });
  },
  initProductData: function (data){
    var that = this;
    for(var i=0; i<data.length; i++){
      console.log(data[i]);
      var item = data[i];
      data[i].ImgUrl = app.d.hostImg + item.ImgUrl;

    }
    // that.setData({
    //       productData:data,
    //     });

  },
});