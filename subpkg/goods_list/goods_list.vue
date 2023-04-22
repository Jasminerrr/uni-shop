<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj:{
          query:'', // 查询关键字
          cid:'', // 商品ID
          pagenum:1, // 当前页码
          pagesize:10, // 每页展示数据的条数
        },
        goodsList:[], // 商品列表
        total:0, // 商品总数量，用来实现分页
        isloading:false, // 设置节流阀的状态(关闭)
      };
    },
    
    // 生命周期函数--监听页面加载（获取页面初始数据）,options:可以获取当前页面路径中的参数
    onLoad(options) {
      // 将获取到的参数转存到data里面,供其他方法使用（因为函数内部不可读）
      // 如果没有参数则赋值为空串
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      // 调用获取商品列表的方法
      this.getGoodsList()
      
      
    },
    
    methods:{
      // 获取商品列表的方法，在下拉刷新时，此方法接受cb函数（停止刷新）
      async getGoodsList(cb){
        // 打开节流阀,不允许其他请求
        this.isloading = true
        // 发请求,传参数
        const {data:res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
        // 如果有传了cb则调用,不传则为undefined,不走此判断
        cb && cb()
        if(res.meta.status !== 200) return uni.$showMsg()
        // 当数据回来时,将新数据与旧数据合并,不能直接赋值
        // 关闭节流阀,此次请求结束后，可以继续请求数据了
        this.isloading = false
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
       
      },
      
      // 点击跳转商品详情页
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      
      
      
      
    },
    
    // onReachBottom函数，用来监听页面的上拉触底行为
    onReachBottom(){
      // 判断是否还有下一页数据，没有就返回 并调用展示信息
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕')
      // 如果节流阀打开，则不请求数据
      if(this.isloading) return 
      // 让页码值自增+1
      this.queryObj.pagenum += 1
      // 重新获取商品列表
      this.getGoodsList()
    },
    
    // 下来刷新函数
    onPullDownRefresh(){
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.queryObj.total = 0
      this.goodsList = []
      this.isloading = false // 关闭节流阀
      // 重新发请求,获取数据，并停止下拉刷新函数传给获取列表的事件
      this.getGoodsList(()=> uni.stopPullDownRefresh())
    },
    
    
  }
</script>

<style lang="scss">
  
</style>
