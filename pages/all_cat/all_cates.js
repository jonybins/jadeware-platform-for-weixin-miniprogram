var app = getApp();
Page({
  data: {
    datas: [],
    pro:[],
    data: [
    ],//数据
    cat_id:0,
    id:0,
    index:0,
    tabTxt:[
    ],
    //tab文案'户型', '风格', '面积'
    // { id: "2", tid: "1", name: "杂件" },
      // { id: "3", tid: "1", name: " 吊坠" },
      // { id: "12", tid: "1", name: "商务礼品" },
      // { id: "62", tid: "1", name: "手饰" }
    tab: [true, true, true, true],
    disabled: false,//加载更多按钮状态
    page: 1,//当前页码
    hasMore: false,//加载更多按钮
    moreTxt: '点击加载更多',
    dataNull: true
  },
  onReady: function (options) {
    //初始化数据
    var self=this;
    // self.getFilter(options);
    
  },
  onLoad:function(options){
    var self = this;
    
    //先加载导航的内容。
    if(options.index==-1){
      //加载全部数据，如果点击了全部宝贝
      try {
        var value = wx.getStorageSync('cache_tabTxt')
        if(value){
          this.setData({
            tabTxt:value
          })
        }
      } catch (e) {
        // Do something when catch error
      }
      // self.getFilter(options);
      self.getData();
    }else{
      self.likeFilter(options);
    }
  },
likeFilter:function(options){
  var self=this;
  var index =options.index;
  var txt=options.txt;
  
  var id=options.id;
  var tabTxt=this.data.tabTxt;
  try {
    var value = wx.getStorageSync('cache_tabTxt')
    if (value) {
      tabTxt = value;
      switch (index) {
        case '0':
      tabTxt[0] = {
        id: "2",
        tid: "1",
        name: txt
      };
      self.setData({
        page: 1,
        data: [],
        tab: [true, true, true, true],
        tabTxt: tabTxt,
        cat_id: id
      });
      break;
    case '1':
      tabTxt[1] = {
        id: "3",
        tid: "1",
        name: txt
      };
      self.setData({
        page: 1,
        data: [],
        tab: [true, true, true, true],
        tabTxt: tabTxt,
        cat_id: id
      });
      break;
    case '2':
      tabTxt[2] = {
        id: "12",
        tid: "1",
        name: txt
      };
      self.setData({
        page: 1,
        data: [],
        tab: [true, true, true, true],
        tabTxt: tabTxt,
        cat_id: id
      });
      break;
        case '3':
          tabTxt[3] = {
            id: "62",
            tid: "1",
            name: txt
          };
          self.setData({
            page: 1,
            data: [],
            tab: [true, true, true, true],
            tabTxt: tabTxt,
            cat_id: id
          });
          break;
      }

    }
  } catch (e) {
    // Do something when catch error
  }
  //数据筛选
  self.getData();
},
  // 选项卡
  filterTab: function (e) {
    var that =this;
    var data = [true, true, true, true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];//通过对应下标的真或假，判断是否打开或关闭
    var id = e.currentTarget.dataset.id;//对应分类的id，便于获取子分类
    this.setData({
      tab: data
    });
    //当展开菜单时，请求数据false，关闭时，不请求数据
    if(!data[index]){

      wx.request({
        url: app.d.ceshiUrl + '/Api/Category/getcat',
        method: 'post',
        data: { cat_id: id },//获取子分类
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var status = res.data.status;
          if (status == 1) {
            var catList = res.data.catList;
            // console.log(catList);
            that.setData({
              filterList: catList,
            });
          } else {
            wx.showToast({
              title: res.data.err,
              duration: 2000,
            });
          }
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        }
      });
    }
    
  },
  // 获取筛选项，获取主导航栏分类
  getFilter: function (options) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Category/index',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.list;
          
          //var catList = res.data.catList;
          that.setData({
            tabTxt: list,
            datas:list
            //typeTree: catList,
          });
          try {
            wx.setStorageSync('cache_tabTxt', list)
          } catch (e) {
          }
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000,
          });
        }
        //获取全部数据
        

      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },

    });
  },
  //筛选项点击操作
  filter: function (e) {
    var self = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = {
          id: "2",
          tid: "1",
          name:txt
        };
        self.setData({
          page: 1,
          data: [],
          tab: [true, true, true,true],
          tabTxt: tabTxt,
          cat_id: id
        });
        break;
      case '1':
        tabTxt[1] = {
          id: "3",
          tid: "1",
          name: txt
        };
        self.setData({
          page: 1,
          data: [],
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          cat_id: id
        });
        break;
      case '2':
        tabTxt[2] = {
          id: "4",
          tid: "1",
          name: txt
        };
        self.setData({
          page: 1,
          data: [],
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          cat_id: id
        });
        break;
      case '3':
        tabTxt[3] = {
          id: "12",
          tid: "1",
          name: txt
        };
        self.setData({
          page: 1,
          data: [],
          tab: [true, true, true, true],
          tabTxt: tabTxt,
          cat_id: id
        });
        break;
    }
    //数据筛选
    self.getData();
  },

  //加载数据
  getData: function (callback) {
    var self = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: app.d.ceshiUrl + '/Api/Product/lists',
      method: 'post',
      data: {
        cat_id: self.data.cat_id,
        page:self.data.page,
        // ptype: ptype,
        // brand_id: brandId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      // header: {
      //   'Content-Type': 'application/json' ///为什么这个不行
      // },
      success: function (res) {
        self.dataFormat(res);//数据处理
      },
      fail: function () {
        console.log('error!!!!!!!!!!!!!!')
      }
    })
  },
  //数据处理
  dataFormat: function (d) {
    if (d.data.status == "1") {
      if (d.data.pro) {
        var datas = this.data.data.concat(d.data.pro), flag = d.data.pro.length < 4;//如果小于4,肯定加载完了，否则不确定
        this.setData({
          data: datas,
          disabled: flag ? true : false,
          moreTxt: flag ? "已加载全部数据" : "点击加载更多",
          hasMore: true,
          dataNull: true
        });

      } else {
        this.setData({
          hasMore: false,
          dataNull: false
        });
      }
    } else {
      console.log('接口异常！')
    }
    wx.hideToast();
  },
  //加载更多
  getMore: function () {
    var self = this;
    self.data.page++;
    self.getData(function (d) {
      self.dataFormat(d)
    });
  },
 
});