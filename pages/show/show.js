// pages/show/show.js
Page({
  data: {
    currentUser: null,
    restaurantId: null,
    restaurant: {},
    reviews: [],
    ratingValues: [5,4,3,2,1],
    rating: 5,
    meals: []
    // ratingValues: ['很好', '一般', '不好'], 注意数据库里的数据类型
    // rating: ['很好']
  },
  onLoad: function(options) {
    // 在页面上保存 restaurantId 便于其他 function 使用
    this.setData({
      restaurantId: options.id
    })

    // 在 onLoad 方法里面，以下两行代码等价，但是在其他 function 里只能使用下面这一行
    // let restaurantId = options.id
    let restaurantId = this.data.restaurantId

    // 获取餐厅详情
    let Restaurant = new wx.BaaS.TableObject('restaurants')
    let page = this
    Restaurant.get(restaurantId).then(function(res) {
      page.setData({
        restaurant: res.data
      })
    })
    // 获取餐厅评论
    this.fetchReviews() 
    this.fetchMeals()

    // 获取当前用户
    wx.BaaS.auth.getCurrentUser().then(function (res) {
      // console.log('用户登录成功')
      page.setData({
        currentUser: res
      })
    })
  },
  fetchMeals: function () {
    let Meal = new wx.BaaS.TableObject('meals')
    let query = new wx.BaaS.Query()
    let restaurantId = this.data.restaurantId
    query.compare('restaurant_id', '=', restaurantId)
    let page = this
    Meal.setQuery(query).find().then(function (res) {
      page.setData({
        meals: res.data.objects
      })
    })
  },
  fetchReviews: function() {
    let Review = new wx.BaaS.TableObject('reviews')
    let query = new wx.BaaS.Query()
    let restaurantId = this.data.restaurantId
    query.compare('restaurant_id', '=', restaurantId)
    let page = this
    Review.setQuery(query).find().then(function(res) {
      page.setData ({
        reviews: res.data.objects
      })
    })
  },
  onChangeRating: function(event) {
    let index = event.detail.value
    let rating = this.data.ratingValues[index]
    this.setData({
      rating: rating
    })
  },
  onSubmitReview: function(event){
    let content = event.detail.value.content
    let rating = this.data.rating

    let Review = new wx.BaaS.TableObject('reviews')
    let review = Review.create()

    review.set({
      user_id: this.data.currentUser.id.toString(),
      restaurant_id: this.data.restaurantId,
      content: content,
      rating: rating
    })

    let page = this
    review.save().then(function(res) {
      page.fetchReviews()
    })
  },
  onSubmitOrder: function(event) {
    let mealId = event.currentTarget.dataset.id
    // wx.showModal({
    //   title: "准备下订单",
    //   content: mealId
    // })
    let Order = new wx.BaaS.TableObject('orders')
    let order = Order.create()
    order.set({
      user_id: this.data.currentUser.id.toString(),
      meal_id: mealId,
      quantity: 1
    })
    order.save().then(function(res) {
      wx.showModal({
        title: '订单创建成功',
        content: '请前往个人中心查看',
      })
    }).catch(function (err) {
      wx.showModal({
        title: '订单创建识别',
        content: 'err.message',
      })
    })
  }
})