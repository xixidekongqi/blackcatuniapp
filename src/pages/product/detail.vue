<template>
  <view class="detail-container">
    <!-- 骨架屏或加载中 -->
    <view v-if="loading" class="loading-tip">正在加载商品...</view>

    <view v-else-if="product">
      <!-- 1. 顶部多图轮播 (uni-app 使用 swiper) -->
      <swiper
        class="image-swiper"
        indicator-dots="true"
        autoplay="false"
        circular="true"
        indicator-active-color="#2563eb"
      >
        <swiper-item v-for="(img, index) in imageList" :key="index">
          <!-- 使用 uni.previewImage 实现点击放大预览 -->
          <image
            class="swiper-image"
            :src="formatImageUrl(img)"
            mode="aspectFill"
            @click="previewImage(index)"
          ></image>
        </swiper-item>
      </swiper>

      <!-- 2. 价格与标题区 -->
      <view class="info-header">
        <view class="price-row">
          <text class="price-symbol">¥</text>
          <text class="price-number">{{ product.price }}</text>
        </view>
        <text class="title">{{ product.title }}</text>

        <view class="meta-row">
          <text class="category-tag">{{ product.categoryName }}</text>
          <text class="brand-tag" v-if="product.brandName">{{ product.brandName }}</text>
        </view>
      </view>

      <!-- 3. 商品描述区 -->
      <view class="desc-section">
        <view class="section-title">商品详情</view>
        <text class="desc-text">{{ product.description || '暂无详细描述' }}</text>
      </view>

      <!-- 底部安全区 -->
      <view class="bottom-safe-area"></view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const product = ref(null)
const imageList = ref([])
const loading = ref(true)

// 格式化图片URL
const formatImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/600x600?text=No+Image'
  return url
}

// 点击预览大图
const previewImage = (index) => {
  const urls = imageList.value.map(img => formatImageUrl(img))
  uni.previewImage({
    current: index,
    urls: urls
  })
}

// 页面加载时触发
onLoad((options) => {
  // 直接从缓存里读取刚才列表页存过来的商品对象
  const tempProduct = uni.getStorageSync('currentProduct')

  if (tempProduct && tempProduct.id == options.id) {
    product.value = tempProduct

    // 处理图片列表
    if (tempProduct.images && tempProduct.images.length > 0) {
      imageList.value = tempProduct.images
    } else if (tempProduct.coverImage) {
      imageList.value = [tempProduct.coverImage]
    } else {
      imageList.value = ['https://via.placeholder.com/600x600?text=No+Image']
    }
  } else {
    // 如果缓存没有（比如刷新页面），给个提示
    uni.showToast({ title: '数据已过期，请重新进入', icon: 'none' })
  }

  loading.value = false
})
</script>

<style>
.detail-container {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.loading-tip {
  text-align: center;
  padding: 50px;
  color: #999;
}

/* 轮播图 */
.image-swiper {
  width: 100%;
  height: 375px; /* 1:1 比例 */
  background-color: #fff;
}
.swiper-image {
  width: 100%;
  height: 100%;
}

/* 价格与标题区 */
.info-header {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
}
.price-row {
  color: #e4393c;
  margin-bottom: 8px;
}
.price-symbol {
  font-size: 16px;
  font-weight: bold;
}
.price-number {
  font-size: 26px;
  font-weight: bold;
}
.title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12px;
  display: block;
}

.meta-row {
  display: flex;
  gap: 10px;
}
.category-tag, .brand-tag {
  font-size: 12px;
  color: #2563eb;
  background-color: #eff6ff;
  padding: 4px 10px;
  border-radius: 4px;
}
.brand-tag {
  color: #8b5cf6;
  background-color: #f5f3ff;
}

/* 描述区 */
.desc-section {
  background-color: #fff;
  padding: 15px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  border-left: 4px solid #2563eb;
  padding-left: 8px;
}
.desc-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.bottom-safe-area {
  height: 30px;
}
</style>