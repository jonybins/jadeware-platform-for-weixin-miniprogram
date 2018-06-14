// app.js
//这里是全局的方法
App({
  d: {
    hostUrl: 'http://127.0.0.1/navigate',
    hostImg: 'https://www.langrs.top/Data/',
    hostVideo: 'http://zhubaotong-file.oss-cn-beijing.aliyuncs.com',
    userId: '',
    appId:"wx45eec35db7ee6740",
    appKey:"f90f4b6f55c0ac4c158abe445d0c778b",
    //http://127.0.0.1/wechat_shop-master  https://www.langrs.top
    ceshiUrl:'http://127.0.0.1/navigate',
  },
  globalData:{
    userInfo:{
      class_sta:0,
    },
  },
  //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //login这里进入小程序会自动登录
    //this.getUserInfo();
  },

  //
  //下面的代码防止使用了回调，意思是再次请求的时候，直接使用上次使用过的结果
  //
  // getUserInfo: function (cb) {
  //   var that = this
  //   if(this.globalData.userInfo){
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   }else{
  //   //调用登录接口
  //   wx.login({
  //     success: function (res) {
  //       var code = res.code;
  //       //get wx user simple info
  //       wx.getUserInfo({
  //         success: function (res) {
  //           that.globalData.userInfo = res.userInfo
  //           typeof cb == "function" && cb(that.globalData.userInfo);
  //           //get user sessionKey
  //           //get sessionKey
  //           //执行完上面的后，就返回了用户数据。
  //           //并不是想要的经过处理的用户数据。
  //           that.getUserSessionKey(code);
  //         }
  //       });
  //     }
  //   });
  //   }
  // },

  ///////////////////////////////
  getUserInfo:function(cb){
    var that = this
    // if(this.globalData.userInfo){
    //   typeof cb == "function" && cb(this.globalData.userInfo)
    // }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          var code = res.code;
          //get wx user simple info
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              // typeof cb == "function" && cb(that.globalData.userInfo);
              //get user sessionKey
              //get sessionKey
              //执行完上面的后，就返回了用户数据。
              //并不是想要的经过处理的用户数据。
              that.getUserSessionKey(code);
            }
          });
        }
      });
    // }
  },

  getUserSessionKey:function(code){
    //用户的订单状态
    var that = this;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/getsessionkey',
      method:'post',
      data: {
        code: code
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if(data.status==0){
          wx.showToast({
            title: data.err,
            duration: 2000
          });
          return false;
        }
        that.globalData.userInfo['sessionId'] = data.session_key;
        that.globalData.userInfo['openid'] = data.openid;
        that.onLoginUser();
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },
  onLoginUser:function(){
    var that = this;
    var user = that.globalData.userInfo;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/authlogin',
      method:'post',
      data: {
        SessionId: user.sessionId,
        gender:user.gender,
        NickName: user.nickName,
        HeadUrl: user.avatarUrl,
        openid:user.openid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        // console.log(res);
        var data = res.data.arr;
        var status = res.data.status;
        if(status!=1){
          wx.showToast({
            title: res.data.errMsg,//垃圾
            duration: 3000
          });
          return false;
        }
        // console.log(data);
        that.globalData.userInfo['id'] = data.ID;
        that.globalData.userInfo['NickName'] = data.NickName;
        that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
        that.globalData.userInfo['status'] = data.status;        
        that.globalData.userInfo['class_sta'] = data.class;
        var userId = data.ID;
        if (!userId){
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
          return false;
        }
        that.d.userId = userId;
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });
  },

  getOrBindTelPhone:function(returnUrl){
    var user = this.globalData.userInfo;
    if(!user.tel){
      wx.navigateTo({
        url: 'pages/binding/binding'
      });
    }
  },

 globalData:{
    userInfo:null
  },

  onPullDownRefresh: function (){
    wx.stopPullDownRefresh();
  }

});





