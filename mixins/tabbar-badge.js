import {mapGetters} from 'vuex'
export default {
  // 生命周期函数---页面刚展示时调用
  onShow() {
    // 在页面刚展示时,调用购物车的数字徽标
    this.setBradge()
  },
  
  methods:{
   setBradge(){
     // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
     uni.setTabBarBadge({
       index: 2,  // TabBar的索引
       text: this.total + ''  // text 的值必须是字符串，不能是数字
     })
   },
  },
  
  // 计算属性
  computed:{
    ...mapGetters('m_cart',['total']),
  },
  
  watch:{
    // 监听total的值,如果改变,则马上调用右上角徽标方法
    total(newValue){
      this.setBradge()
      immediate:true
    },
  }
}