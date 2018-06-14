// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var common = require("../../utils/common.js");
Page({  
  data: {  
    winWidth: 0,  
    winHeight: 0,  
    // tab切换  
    currentTab: 0,  
    isStatus:'pay',//10待付款，20待发货，30待收货 40、50已完成
    page:1,
    i :1,
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    isNullList: true,   // 用于判断orderList数组是不是空数组，默认true，空的数组  
    refundpage:1,
    orderList0:[],
    orderList1:[],
    orderList2:[],
    orderList3:[],
    orderList4:[],
  }, 
  //下拉刷新
  onPullDownRefresh: function () {
    wx.setNavigationBarTitle({
      title: '正在刷新',
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    var that = this;
    if (that.data.currentTab != 4) {
      this.setData({
        i:1,
        page: 1,   //第一次加载，设置1  
        orderList0: [],  //放置返回数据的数组,设为空  
        orderList1: [],  //放置返回数据的数组,设为空  
        orderList2: [],  //放置返回数据的数组,设为空  
        orderList3: [],  //放置返回数据的数组,设为空  
        isNullList: true,  //第一次加载，设置true  
        searchLoading: false,  //把"上拉加载"的变量设为true，显示  
        searchLoadingComplete: false //把“没有数据”设为false，隐藏  
      });
      that.loadOrderList();
    } else {
      this.setData({
        i: 1,
        page: 1,   //第一次加载，设置1  
        orderList4: [],  //放置返回数据的数组,设为空  
        isNullList: true,  //第一次加载，设置true  
        searchLoading: false,  //把"上拉加载"的变量设为true，显示  
        searchLoadingComplete: false //把“没有数据”设为false，隐藏  
      });
      that.loadReturnOrderList();
    }

    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.setNavigationBarTitle({
        title: '我的订单',
      })
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }, 
  //上拉加载
  onReachBottom(e) {
    let that = this;
    console.log('上啦l')
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        page: that.data.page + 1,  //每次触发上拉事件，把searchPageNum+1  
        isNullList: false  //触发到上拉事件，把isNullList设为为false  
      });
      if (that.data.currentTab != 4) {
        that.loadOrderList();
      }else{
        that.loadReturnOrderList();
      }
      
    }
  },
  onLoad: function(options) {  
    this.initSystemInfo();
    this.setData({
      currentTab: parseInt(options.currentTab),
      isStatus:options.otype
    });

    if(this.data.currentTab == 4){
      this.loadReturnOrderList();
    }else{
      this.setData({
        page: 1,   //第一次加载，设置1  
        orderList0: [],
        orderList1: [],
        orderList2: [],
        orderList3: [], 
        isNullList: true,  //第一次加载，设置true  
        searchLoading: false,  //把"上拉加载"的变量设为true，显示  
        searchLoadingComplete: false //把“没有数据”设为false，隐藏  
      });
      this.loadOrderList();
    }
  },  
  getOrderStatus:function(){
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ?2 :this.data.currentTab == 3 ? 3:0;
  },

  loadOrderList: function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/index',
      method:'post',
      data: {
        uid:app.d.userId,
        order_type:that.data.isStatus,
        page:that.data.page,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data      
        var status = res.data.status;
        var list = res.data.ord;
        var nu = res.data.i;
        switch(that.data.currentTab){
          case 0:
          var searchList = [];
            if (nu != 0) {
              that.data.isNullList ? searchList = list : searchList = that.data.orderList0.concat(list);
              nu = that.data.i + nu;
              if(nu <5){ //这里判断数据小于5的时候不显示加载更多
                that.setData({
                  i: nu,
                  orderList0: searchList,
                  //searchLoading: true   //把"上拉加载"的变量设为true，显示  
                });
              }else{
                that.setData({
                  i: nu,
                  orderList0: searchList,
                  searchLoading: true   //把"上拉加载"的变量设为true，显示  
                });
              }   
             
            } else {
              that.setData({
                searchLoadingComplete: true, //把“没有数据”设为true，显示  
                searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
              });

            };
            // that.setData({
            //   orderList0: list,
            // });
            break;
          case 1:
            var searchList = [];
            if (nu != 0) {
              that.data.isNullList ? searchList = list : searchList = that.data.orderList1.concat(list);
                nu = that.data.i + nu;
             if(nu < 5) { //这里判断数据小于5的时候不显示加载更多
                that.setData({
                  i: nu,
                  orderList1: searchList,
                  //searchLoading: true   //把"上拉加载"的变量设为true，显示  
                });
              } else {
                that.setData({
                  i: nu,
                  orderList1: searchList,
                  searchLoading: true   //把"上拉加载"的变量设为true，显示  
                });
              }   
            } else {
              that.setData({
                searchLoadingComplete: true, //把“没有数据”设为true，显示  
                searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
              });

            }
            break;  
          case 2:
            var searchList = [];
            if (nu != 0) {
              that.data.isNullList ? searchList = list : searchList = that.data.orderList2.concat(list);
                nu = that.data.i + nu;
             if(nu < 5) { //这里判断数据小于5的时候不显示加载更多
                that.setData({
                  i: nu,
                  orderList2: searchList,
                  //searchLoading: true   //把"上拉加载"的变量设为true，显示  
                });
              } else {
                that.setData({
                  i: nu,
                  orderList2: searchList,
                  searchLoading: true   //把"上拉加载"的变量设为true，显示  
                });
              }   
            } else {
              that.setData({
                searchLoadingComplete: true, //把“没有数据”设为true，显示  
                searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
              });

            }
            break;
          case 3:
            var searchList = [];
            if (nu != 0) {
              that.data.isNullList ? searchList = list : searchList = that.data.orderList3.concat(list);
                nu = that.data.i + nu;
             if(nu < 5) { //这里判断数据小于5的时候不显示加载更多
                that.setData({
                  i: nu,
                  orderList3: searchList,
                  //searchLoading: true   //把"上拉加载"的变量设为true，显示  
                });
              } else {
                that.setData({
                  i: nu,
                  orderList3: searchList,
                  searchLoading: true   //把"上拉加载"的变量设为true，显示  
                });
              }   
            } else {
              that.setData({
                searchLoadingComplete: true, //把“没有数据”设为true，显示  
                searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
              });

            }
            break;
          case 4:
            var searchList = [];
            if (nu != 0) {
              that.data.isNullList ? searchList = list : searchList = that.data.orderList4.concat(list);
                nu = that.data.i + nu;
                if (nu < 5) { //这里判断数据小于5的时候不显示加载更多
                  that.setData({
                    i: nu,
                    orderList4: searchList,
                    //searchLoading: true   //把"上拉加载"的变量设为true，显示  
                  });
                } else {
                  that.setData({
                    i: nu,
                    orderList4: searchList,
                    searchLoading: true   //把"上拉加载"的变量设为true，显示  
                  });
                }   
            } else {
              that.setData({
                searchLoadingComplete: true, //把“没有数据”设为true，显示  
                searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
              });

            }
            break;  
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
  initSystemInfo:function(){
    var that = this;  
  
    wx.getSystemInfo( {
      success: function( res ) {  
        that.setData( {  
          winWidth: res.windowWidth,  
          winHeight: res.windowHeight  
        });  
      }    
    });  
  },
  bindChange: function(e) {  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  },  
  swichNav: function(e) {
    var that = this;  
    if( that.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else {
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
      });

      //没有数据就进行加载
      switch(that.data.currentTab){
          case 0:
          this.setData({
            i:1,
            page: 1,   //第一次加载，设置1  
            orderList0: [],  //放置返回数据的数组,设为空  
            isNullList: true,  //第一次加载，设置true  
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏  
          });
            !that.data.orderList0.length && that.loadOrderList();
            break;
          case 1:
          this.setData({
            i:1,
            page: 1,   //第一次加载，设置1  
            orderList1: [],  //放置返回数据的数组,设为空  
            isNullList: true,  //第一次加载，设置true  
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏  
          });
            !that.data.orderList1.length && that.loadOrderList();
            break;  
          case 2:
          this.setData({
            i:1,
            page: 1,   //第一次加载，设置1  
            orderList2: [],  //放置返回数据的数组,设为空  
            isNullList: true,  //第一次加载，设置true  
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏  
          });
            !that.data.orderList2.length && that.loadOrderList();
            break;
          case 3:
          this.setData({
            i:1,
            page: 1,   //第一次加载，设置1  
            orderList3: [],  //放置返回数据的数组,设为空  
            isNullList: true,  //第一次加载，设置true  
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏  
          });
            !that.data.orderList3.length && that.loadOrderList();
            break;
          case 4:
          this.setData({
            i: 1,
            page: 1,   //第一次加载，设置1  
            orderList4: [],  //放置返回数据的数组,设为空  
            isNullList: true,  //第一次加载，设置true  
            searchLoading: false,  //把"上拉加载"的变量设为true，显示  
            searchLoadingComplete: false //把“没有数据”设为false，隐藏  
          });
            that.data.orderList4.length = 0;
            that.loadReturnOrderList();
            break;
        }
    };
  },
})