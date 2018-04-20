//index.js
//获取应用实例

const app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
      locationstatus:false,
      userLocation:'',
      userMsg:{},
      weatherMsg:{},
      animation:{}

    },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onLoad: function () {
    var weather = new QQMapWX({
      key: '7VSBZ-USSWQ-32752-G67JN-FGSSF-UVBPH' // 必填
    });
    var that = this;
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success(res) {
              // 用户已经同意小程序使用定位功能，后续调用 wx.wx.chooseLocation() 接口不会弹窗询问
              that.showWeather()
            },
            fail:function(err){
                   console.log(err)
            }
          })
        }else{
          that.showWeather()
        }
      }
    })
  },
showWeather:function(){
  let that = this;
  var weather = new QQMapWX({
    key: '7VSBZ-USSWQ-32752-G67JN-FGSSF-UVBPH' // 必填
  });
  wx.getLocation({
    
    success: function (res) {
      console.log(res)
      weather.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function (res) {
          console.log(res)
          if (res.status == 0) {
            let city = res.result.ad_info.city;
            let cityId = res.result.ad_info.city_code
            wx.request({
              url: 'https://way.jd.com/jisuapi/weather?city=' + city + '&appkey=9c1016ecc6851a21ec12ba3be09e8415 ',
              method: 'GET',
              success: function (res) {
                console.log(res)
                if (res.data.code == '10000') {
                  that.setData({
                    locationstatus:true,
                    userMsg: {
                      userCity: res.data.result.result.city,
                      userdate: res.data.result.result.week,
                      userWeather: res.data.result.result.weather,
                      weatherWind: res.data.result.result.winddirect,
                      windpower: res.data.result.result.windpower,
                      weatherImg: res.data.result.result.img
                    },
                    weatherMsg:{
                      temp:res.data.result.result.temp,
                      tempHigh:res.data.result.result.temphigh,
                      pm2_524:res.data.result.result.pm2_524,
                      templow:res.data.result.result.templow,
                      MovementIndex:res.data.result.result.index[1].detail,
                      hourly:res.data.result.result.hourly
                    }
                  })
                }
              }
            })
          }
        },
        fail: function (err) {
          console.log(err)
        }
      })
    },
    fail: function (err) {
      console.log(err)
    }
  })
},

})
