var app = getApp();
// pages/search/search.js
Page({
  data:{
    focus:true,
    hotKeyShow:true,
    historyKeyShow:true,
    searchValue:'',
    page:0,
    productData:[],
    historyKeyList:[],
    hotKeyList:[],
    is_pr:false,
  },
  onLoad:function(options){
    var that = this;
    //加载热门搜索和历史搜索
    wx.request({
      url: app.d.ceshiUrl + '/Api/Search/index',
      method:'post',
      data: {uid:app.d.userId},
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var remen = res.data.remen;
        var history = res.data.history;

        that.setData({
          historyKeyList:history,
          hotKeyList:remen,
        });
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
    // that.getSto();
  },
  onReachBottom:function(){
      //下拉加载更多多...
      this.setData({
        page:(this.data.page+10)
      })
      
      this.searchProductData();
  },
  //按照热门搜索
  doKeySearch:function(e){
    var that=this;
    var key = e.currentTarget.dataset.key;
    this.setData({
      searchValue: key,
       hotKeyShow:false,
       historyKeyShow:false,
    });

    this.data.productData.length = 0;
    this.searchProductData();
  },
  //点击搜索按钮
  doSearch:function(){
    var searchKey = this.data.searchValue;
    if (!searchKey) {
        this.setData({
            focus: true,
            hotKeyShow:true,
            historyKeyShow:true,
        });
        return;
    };

    this.setData({
      hotKeyShow:false,
      historyKeyShow:false,
    })
    this.data.productData.length = 0;
    this.searchProductData();
    // this.SetSearchHistory(searchKey);
  },
  searchValueInput:function(e){
    var value = e.detail.value;
    this.setData({
      searchValue:value,
    });
if(!value){
  this.setData({
    hotKeyShow: true,
    historyKeyShow: true,
  });
}else{
  this.setData({
    hotKeyShow: false,
    historyKeyShow: false,
  });
}
      
      
    this.searchProductData();
  },
  searchProductData:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Search/searches',
      method:'post',
      data: {
        keyword:that.data.searchValue,
        uid: app.d.userId,
        page:that.data.page,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {   
        var data = res.data.pro;
        that.setData({
          productData:data,
        });
        
      },
      fail:function(e){
        that.setData({
          is_pr: false,
        })
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

});