App({
  onLaunch: function () {
    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('6aa7adace90e5f09a004')

    // wx.BaaS.auth.register({ username: 'ifanrx', password: 'ifanrx123' }).then(user => {
    //   console.log(user)
    // })
  },
})
