var app = getApp();

Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    productData: [],
    proCat:[],
    page: 2,
    all_num:0,
    index: 2,
    brand:[],
    // 滑动
    imgUrl: [],
    kbs:[],
    lastcat:[],
    iconArray: [
      // {
      //   "id":66,
      //   'index':3,
      //   "iconUrl": '/images/fenlei/banjie.jpg',
      //   "iconText": '戒指扳指'
      // },
      // {
      //   "id":29,
      //   'index': 2,
      //   "iconUrl": '/images/fenlei/bajian.jpg',
      //   "iconText": '吊坠挂件'
      // },
      // {
      //   "id":65,
      //   'index': 3,//属于哪个类中如：器型
      //   "iconUrl": '/images/fenlei/shouchuan.png',
      //   "iconText": '手串项链'
      // },
      // {
      //   "id": 21,
      //   "index":1,
      //   "iconUrl": '/images/fenlei/yushi.png',
      //   "iconText": '手把玩件'
      // },
      {
        // "id": 0,
        "index":-1,
        "iconUrl": '/images/fenlei/all.jpg',
        "iconText": '全部宝贝'
      },
      // {
      //   "id": 64,
      //   "index": 3,
      //   "iconUrl": '/images/fenlei/shouzuo.png',
      //   "iconText": '精美手镯'
      // },
      // {
      //   "id": 47,
      //   "index":2,
      //   "iconUrl": '/images/fenlei/shangwu.png',
      //   "iconText": '酒具茶具'
      // },
      // {
       
      //    "id": 27,
      //   "index": 1,
      //   "iconUrl": '/images/fenlei/chegua.jpg',
      //   "iconText": '精美车挂'
      // }
    ],
    course:[]
  },
  onLoad: function (options) {
    var that = this;
    that.get_index();
  },
  //获取商品信息
  get_index: function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/index',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var ggtop = res.data.ggtop;
        var prolist = res.data.prolist;
        var all_num = res.data.all_num;
        var list = res.data.list;
        var cate = res.data.cate_l;//这里是分类栏
        //that.initProductData(data);
        var all = that.data.iconArray.concat(cate);
        that.setData({
          imgUrls: ggtop,
          productData: prolist,
          all_num: all_num,
          iconArray:all,
        });
        try {
          wx.setStorageSync('cache_tabTxt', list)
        } catch (e) {
        }
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
    //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    var that = this;
    that.get_index();
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
//获取分类点击值
pick_cate:function(e){
  var index = e.currentTarget.dataset.index;
  var txt = e.currentTarget.dataset.txt;
  var id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: '../all_cat/all_cates?id='+id+'&index='+index+'&txt='+txt,
  })
  // 
  //e.currentTarget.dataset.index;
  },

//跳转商品列表页   
listdetail:function(e){
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../listdetail/listdetail?title='+e.currentTarget.dataset.title,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
//跳转商品搜索页  
search:function(e){
    wx.navigateTo({
      url: '../search/search',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

makephone:function(){
  wx.makePhoneCall({
    phoneNumber: '13333678823',
  })
},
//点击加载更多
getMore:function(e){
  var that = this;
  var page = that.data.page;
  wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getlist',
      method:'post',
      data: {page:page},
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        var prolist = res.data.prolist;
        if(prolist==''){
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page+1,
          productData:that.data.productData.concat(prolist)
        });
        //endInitData
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
},

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },


  // getFilter: function (options) {
  //   var that = this;
  //   wx.request({
  //     url: app.d.ceshiUrl + '/Api/Category/index',
  //     method: 'post',
  //     data: {},
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       //--init data 
  //       var status = res.data.status;
  //       if (status == 1) {
  //         var list = res.data.list;

  //         //var catList = res.data.catList;
  //         that.setData({
  //           tabTxt: list,
  //           datas: list
  //           //typeTree: catList,
  //         });
  //         // wx.setStorage({
  //         //   key: "cache_tabTxt",
  //         //   data: list
  //         // });
          
  //       } else {
  //         wx.showToast({
  //           title: res.data.err,
  //           duration: 2000,
  //         });
  //       }
  //       //获取全部数据


  //     },
  //     error: function (e) {
  //       wx.showToast({
  //         title: '网络异常！',
  //         duration: 2000,
  //       });
  //     },

  //   });
  // },
  onScroll: function (e) {
    if (e.detail.scrollTop > 100 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 100 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }
  },
  onShareAppMessage: function () {
    return {
      title: '中玉玉器微商平台',
      path: '/pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }



});