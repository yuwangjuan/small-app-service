const WXAPI = require('apifm-wxapi')
const wxbarcode = require('wxbarcode')
const AUTH = require('../../utils/auth')
const APP = getApp()
APP.configLoadOK = () => {

}
Page({
  data: {
    apiOk: false,
    isLogined: true
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "签约"
    })
  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        isLogined
      })
      if (isLogined) {
        this.orderList();
      }
    })
  },
  toIndexPage: function() {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  async orderList() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.orderList({
      token: wx.getStorageSync('token'),
      statusBatch: '1,2'
    })
    wx.hideLoading()
    if (res.code == 0) {
      this.setData({
        orderList: res.data.orderList,
        logisticsMap: res.data.logisticsMap,
        goodsMap: res.data.goodsMap,
        apiOk: true
      })
      wxbarcode.qrcode('qrcode_0', res.data.orderList[0].hxNumber, 400, 400);
    } else {
      this.setData({
        orderList: null,
        logisticsMap: null,
        goodsMap: null,
        apiOk: true
      })
    }
  },
  bindchange(e) {
    const index = e.detail.current
    const hxNumber = this.data.orderList[index].hxNumber
    if (!hxNumber) {
      return
    }    
    wxbarcode.qrcode('qrcode_' + index, hxNumber, 400, 400);
  },
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none',
      })
      return;
    }
    AUTH.register(this);
  },
})