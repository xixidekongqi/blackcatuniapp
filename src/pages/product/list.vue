<template>
  <view class="page-container">
    <!-- 顶部横向滚动分类栏 -->
    <scroll-view scroll-x class="category-scroll" :show-scrollbar="false">
      <view
        class="category-tag"
        :class="{ active: currentCategoryId === null }"
        @click="selectCategory(null)"
      >
        全部
      </view>
      <view
        class="category-tag"
        v-for="cat in categories"
        :key="cat.id"
        :class="{ active: currentCategoryId === cat.id }"
        @click="selectCategory(cat.id)"
      >
        {{ cat.name }}
      </view>
    </scroll-view>

    <!-- 商品双列网格 -->
    <view class="product-grid">
      <view
        class="product-card"
        v-for="item in products"
        :key="item.id"
        @click="goToDetail(item)"
      >
        <!-- 商品图片 -->
        <image
          class="product-image"
          :src="formatImageUrl(item.coverImage)"
          mode="aspectFill"
        ></image>

        <!-- 商品信息 -->
        <view class="product-info">
          <text class="product-title">{{ item.title }}</text>
          <view class="bottom-row">
            <text class="product-price">¥ {{ item.price }}</text>
            <text class="product-tag">{{ item.categoryName }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 没数据时的提示 -->
    <view v-if="products.length === 0 && !loading" class="empty-tip">
      该分类下暂无商品哦~
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/request.js'

const categories = ref([])
const products = ref([])
const currentCategoryId = ref(null) // null 代表全部
const loading = ref(true)

// 格式化图片URL
const formatImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/300x300?text=No+Image'
  return url
}

// 获取分类
const fetchCategories = async () => {
  try {
    const res = await request({ url: '/categories' })
    categories.value = res
  } catch (e) {
    console.error('获取分类失败', e)
  }
}

// 获取商品列表 (支持按分类筛选)
const fetchProducts = async () => {
  loading.value = true
  try {
    const url = currentCategoryId.value
      ? `/products?categoryId=${currentCategoryId.value}`
      : '/products'

    const res = await request({ url })

    // 你的后端直接返回数组
    products.value = res || []
  } catch (e) {
    console.error('获取商品失败', e)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 点击分类切换
const selectCategory = (id) => {
  if (currentCategoryId.value === id) return
  currentCategoryId.value = id
  fetchProducts()
}

// 点击商品跳转详情
const goToDetail = (item) => {
  // 1. 把整个商品对象存进本地缓存，详情页直接读取
  uni.setStorageSync('currentProduct', item)

  // 2. 路由跳转
  uni.navigateTo({
    url: `/pages/product/detail?id=${item.id}`
  })
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style>
/* 页面背景 */
.page-container {
  background-color: #f5f7fa;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* 顶部横向滚动分类 */
.category-scroll {
  white-space: nowrap;
  padding: 12px 15px;
  background-color: #fff;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.category-tag {
  display: inline-block;
  padding: 6px 16px;
  background-color: #f0f2f5;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 14px;
  color: #555;
  transition: all 0.2s;
}
/* 选中状态的分类 */
.category-tag.active {
  background-color: #2563eb;
  color: #ffffff;
  font-weight: bold;
}

/* 商品双列网格布局 */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 10px;
}

/* 单个商品卡片 */
.product-card {
  width: 48.5%; /* 两列 */
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
}

.product-image {
  width: 100%;
  height: 175px;
  background-color: #f0f0f0;
}

.product-info {
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  /* 限制两行，超出省略号 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-bottom: 8px;
  height: 40px;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 17px;
  font-weight: bold;
  color: #e4393c; /* 电商红 */
}

.product-tag {
  font-size: 11px;
  color: #999;
  background: #f8f8f8;
  padding: 2px 6px;
  border-radius: 4px;
}

.empty-tip {
  text-align: center;
  color: #999;
  margin-top: 50px;
  font-size: 14px;
}
</style>