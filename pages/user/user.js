// pages/user/user.js
var app = getApp()
Page( {
  data: {
    userInfo: {
    },
    orderInfo:{},
    class_sta:'',
    help_status:false,
    loadingText: '加载中...',
    login:false,
    loadingHidden: false,
  },


  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    var that = this;
    that.login();
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },


  //生命周期函数--监听页面加载
  onLoad: function (option) {
      var that = this
      //这里为了防止异步操作，先加载了APPgetuserInfo函数。因为首次使用该函数，返回的是没有处理过的数据，不是想要的。需要再次使用方可。
      app.getUserInfo();
  },
  onLaunch:function(){
    var that = this
  },
  call_phone:function(){
    wx.makePhoneCall({
      phoneNumber: '13333678823',
      success:function(res){
        
      }
    })
  },
  logout:function(){
    var that= this;
    wx.showModal({
      title: '确定退出吗？',
      content: '',
      success:function(res){
        if(res.confirm){
        //清除数据
          that.setData({
            userInfo: {},
            login: false,
            class_sta:''
          })
          //退出登录后，清除全局变量里的内容
          app.getUserInfo();
        }
      }
    })
    
  },
  login:function(){
    var that = this;
    //调用应用实例的方法获取全局数据（app.js）
// });
    app.getUserInfo();
    that.setData({
      class_sta: app.globalData.userInfo.class_sta,
      userInfo: app.globalData.userInfo,
      login: true
  })
    if (app.globalData.userInfo == null) {
      wx.showToast({
        title: '请登录或刷新',
      })
    }
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  },
findHer:function(){

    wx.openLocation({
      latitude: 33.076751,
      longitude: 112.157189,
      scale:28,
      name: '镇平县石佛寺镇华夏玉都',
      address:'河南省南阳市镇平县石佛寺镇华夏玉都',
    })
    },
//授权设置界面
privSet: function () {
  wx.getSetting({
    success: function (res) {
      console.log(res);
    }
  })
  wx.openSetting({
    success: function (res) {
      console.log(res);
    }
  })
},
  onShareAppMessage: function () {
    return {
      title: '中玉玉器微商平台',
      path: '/pages/user/user',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})