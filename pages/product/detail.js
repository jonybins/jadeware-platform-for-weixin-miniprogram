//index.js  
//获取应用实例  
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  firstIndex: -1,
  data:{
    bannerApp:true,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, //tab切换  
    is_agent:false,
    isdow:false,//是否显示进度条
    jindu:0,//默认0进度
    agent_name:'一键复制简介和下载图片',
    shiyong:0,
    renqi:0,
    img:'shc.png',
    productId:0,
    itemData:{},
    bannerItem:[],
    num:0,
    // 产品图片轮播
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // 属性选择
    firstIndex: -1,
    //准备数据
    //数据结构：以一组一组来进行设定
     commodityAttr:[],
     attrValueList: []
  },

//检查是否登录
kickDow:function(){
  var that = this;
  //判断是否登录
  if (app.d.userId == 0) {
    wx.showToast({
      title: '请先登录',
      image: '/images/icons/aah.png'
    })
  }else{
    //判断是否为代理用户
    if(app.globalData.userInfo.status==0){
      wx.showModal({
        title: '代理提示',
        content: '请联系客服，升级为代理用户',
        showCancel: false,
        confirmText: "确定"
      })
    }else{
      //点击下载复制
     that.downlod();
     that.copy();
     that.dowNum();
     that.recoder_num();
    }
  }
},
//下载记录的统计
recoder_num:function(){
  var that = this;
  wx: wx.request({
    url: app.d.ceshiUrl + '/Api/Order/recoder',
    data: {
      uid: app.d.userId,
      pid: that.data.productId
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    success: function (res) {
      console.log(res);
    },
    fail: function (res) { },
  })
},
// 传值
onLoad: function (option) {
  //this.initNavHeight();
  var that = this;
  console.log(option);
  that.setData({
    productId: option.productId,
    renqi:option.renqi,
  });
  that.loadProductDetail();
  that.visitNum();
  that.check_col();
},
//访问量的统计
visitNum:function(){
  var that = this;
  var visit = that.data.renqi;
  wx: wx.request({
    url: app.d.ceshiUrl + '/Api/Product/visit_num',
    data: {
      visit: visit,
      pid: that.data.productId
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    success: function (res) {
      var num = res.data.visit;
      that.setData({
        renqi:num,
      })
    },
    fail: function (res) { },
  })
},

//下载量统计
dowNum:function(){
  var that = this;
  var data = that.data.itemData;
  that.setData({
    shiyong:data.shiyong
  })
  wx:wx.request({
    url: app.d.ceshiUrl +'/Api/Product/dow_num',
    data: {
      num :that.data.shiyong,
      pid :data.id
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    success: function(res) {
      console.log(res);
    },
    fail: function(res) {},
  })
},
//下载内容
downlod:function(){
  var that = this;
  var data = that.data.bannerItem;
  console.log(data[0]);
  for(var i=0;i<data.length;i++){
    const downloadTask=wx.downloadFile({
      url:data[i],
      success:function(res){
        var temp = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: temp,
          success:function(){
            that.setData({
              isdow:false,
            })
          }
        })
      }
  })
    downloadTask.onProgressUpdate((res) => {
      that.setData({
        jindu:res.progress,
        isdow:true,
      })
      if(res.progress==100){
        wx.showToast({
          title: '下载完成',
        })
      }
    })

    // downloadTask.abort() // 取消下载任务
  }
  
},
//复制内容
copy:function (){
  var that = this;
  var data = that.data.itemData;
  console.log(data);
  wx.setClipboardData({
    data: '【'+data.brad+'】'+data.cat_name+data.name+data.intro,
    success:function(res){
      wx.showToast({
        title: '复制简介成功',
        icon: 'success',
        duration: 3000,
      })
    },
    fail:function(){
      wx.showToast({
        title: '复制简介失败',
        image:'/images/icons/aah.png',
        duration: 3000,
      })
    }
  })
},

// 商品详情数据获取
  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/index',
      method:'post',
      data: {
        pro_id: that.data.productId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        if(status==1) {   
          var pro = res.data.pro;
          console.log(pro);
          var content=pro.content;
          //that.initProductData(data);
          WxParse.wxParse('content', 'html', content, that, 3);
          that.setData({
            itemData:pro,
            bannerItem:pro.img_arr,
            commodityAttr:res.data.commodityAttr,
            attrValueList:res.data.attrValueList,
          });
        } else {
          wx.showToast({
            title:res.data.err,
            duration:2000,
          });
        }
      },
      error:function(e){
        wx.showToast({
          title:'网络异常！',
          duration:2000,
        });
      },
    });
  },
 
  initProductData: function(data){
    data["LunBoProductImageUrl"] = [];

    var imgs = data.LunBoProductImage.split(';');
    for(let url of imgs){
      url && data["LunBoProductImageUrl"].push(app.d.hostImg + url);
    }

    data.Price = data.Price/100;
    data.VedioImagePath = app.d.hostVideo + '/' +data.VedioImagePath;
    data.videoPath = app.d.hostVideo + '/' +data.videoPath;
  },
//检测是否已经收藏过了，前提是已经登录
check_col:function(){
  var that=this;
  wx.request({
    url: app.d.ceshiUrl+'/Api/Product/check_col',
    method: 'post',
    data: {
      uid: app.d.userId,
      pid: that.data.productId,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success:function(res){
      if(res.data.status==1){
        that.setData({
          img: 'shced.png'
        })
      }else{
        that.setData({
          img: 'shc.png'
        })
      }
    }
  })
},
//添加到收藏
  addFavorites:function(e){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/col',
      method:'post',
      data: {
        uid: app.d.userId,
        pid: that.data.productId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // //--init data        
        var data = res.data;
        if(data.status == 1){
          that.setData({
            img: 'shced.png'
          })
          
        }else{
          that.setData({
            img: 'shc.png'
          })
          wx.showToast({
            title: data.err,
            duration: 2000,
          });
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

  bindChange: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  initNavHeight:function(){////获取系统信息
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bannerClosed:function(){
    this.setData({
      bannerApp:false,
    })
  },
  swichNav: function (e) {//点击tab切换
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  share:function(){
  console.log(77777);
    var that = this;
    that.onShareAppMessage();
  },
  onShareAppMessage: function () {
    return {
      title: '中玉玉器微商平台',
      path: '/pages/product/detail?productId='+this.data.productId+'&renqi='+this.data.renqi,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
});
