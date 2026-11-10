<template>
  <div class="learning-platform">
    <!-- Header 导航栏 -->
    <header class="platform-header">
      <div class="header-inner page-container">
        <!-- 左侧 Logo + 搜索 -->
        <div class="header-left">
          <div class="logo">
            <el-icon class="logo-icon"><Reading /></el-icon>
            <span class="logo-text">智学云课堂</span>
          </div>
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索课程、讲师、分类..."
              class="search-input"
              :prefix-icon="Search"
            />
            <el-button type="primary" class="search-btn">搜索</el-button>
          </div>
        </div>
        <!-- 右侧 通知 + 用户头像 -->
        <div class="header-right">
          <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification-badge">
            <el-icon class="header-icon"><Bell /></el-icon>
          </el-badge>
          <el-dropdown trigger="click">
            <div class="user-avatar">
              <el-avatar :size="36" src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=panda" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon><Setting /></el-icon>
                  账号设置
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon><Medal /></el-icon>
                  我的证书
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 主体白色容器 -->
    <main class="main-wrap page-container">
      <!-- Banner 轮播区域 -->
      <section class="banner-section">
        <el-carousel height="300px" indicator-position="outside" arrow="hover" class="banner-carousel">
          <el-carousel-item v-for="(banner, index) in banners" :key="index">
            <div class="banner-slide" :style="{ background: banner.bg }">
              <div class="banner-content">
                <h2 class="banner-title">{{ banner.title }}</h2>
                <p class="banner-subtitle">{{ banner.subtitle }}</p>
                <el-button class="banner-btn">立即查看</el-button>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>

      <!-- 精选课程 -->
      <section class="courses-section section-block">
        <div class="section-header">
          <h3 class="section-title">精选课程</h3>
          <p class="section-subtitle">跟随行业一线工程师学习</p>
        </div>
        <el-tabs v-model="activeCategory" class="category-tabs">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="前端" name="frontend"></el-tab-pane>
          <el-tab-pane label="AI Coding" name="ai"></el-tab-pane>
        </el-tabs>
        <div class="courses-grid">
          <div
            v-for="course in filteredCourses"
            :key="course.id"
            class="course-card"
          >
            <div class="course-cover" :style="{ background: course.coverBg }">
              <span class="course-category">{{ course.category }}</span>
            </div>
            <div class="course-info">
              <h4 class="course-title">{{ course.title }}</h4>
              <p class="course-meta">讲师：{{ course.teacher }} · {{ course.hours }}课时</p>
              <div class="course-footer">
                <span class="course-price">¥ {{ course.price }}</span>
                <el-button type="primary" size="small">立即学习</el-button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 我的学习记录 -->
      <section class="records-section section-block">
        <div class="section-header">
          <h3 class="section-title">我的学习记录</h3>
          <p class="section-subtitle">坚持学习，持续进步</p>
        </div>
        <el-table :data="learningRecords" stripe style="width: 100%" class="records-table">
          <el-table-column prop="id" label="序号" width="70" align="center"></el-table-column>
          <el-table-column prop="courseName" label="课程名称" min-width="200"></el-table-column>
          <el-table-column prop="currentChapter" label="当前章节" min-width="200"></el-table-column>
          <el-table-column label="学习进度" width="180">
            <template #default="{ row }">
              <el-progress :percentage="row.progress" :color="progressColor(row.progress)" />
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === '已完成' ? 'success' : 'primary'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #default>
              <el-button type="primary" link>继续学习</el-button>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <!-- 帮助中心 -->
      <section class="help-section section-block">
        <div class="section-header">
          <h3 class="section-title">帮助中心</h3>
          <p class="section-subtitle">常见问题解答</p>
        </div>
        <el-collapse v-model="activeFaq" class="faq-collapse">
          <el-collapse-item
            v-for="(faq, index) in faqList"
            :key="index"
            :title="faq.question"
            :name="index"
          >
            <div class="faq-answer">{{ faq.answer }}</div>
          </el-collapse-item>
        </el-collapse>
      </section>
    </main>

    <!-- Footer 页脚 -->
    <footer class="platform-footer">
      <div class="footer-inner page-container">
        <span class="copyright">© 2026 智学云课堂 All Rights Reserved.</span>
        <el-button type="primary" link class="feedback-btn">
          <el-icon><ChatDotRound /></el-icon>
          意见反馈
        </el-button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Reading, Search, ChatDotRound, Bell, User, Setting, Medal, SwitchButton } from '@element-plus/icons-vue'

// 搜索关键词
const searchKeyword = ref('')

// 通知数量
const notificationCount = ref(6)

// Banner 轮播数据
const banners = ref([
  {
    title: '前端进阶训练营 2026',
    subtitle: '从工程化到性能优化，全面实战',
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: 'AI Coding 实战季',
    subtitle: '掌握 LLM 辅助开发，提升 10 倍效率',
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
  },
  {
    title: '全栈进阶计划',
    subtitle: '前端 + Node + 云原生，一站式成长',
    bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  }
])

// 课程分类
const activeCategory = ref('all')

// 课程数据
const courses = ref([
  {
    id: 1,
    title: 'Vue3 组件库设计与实现',
    category: '前端',
    categoryKey: 'frontend',
    teacher: '李伟',
    hours: 24,
    price: 299,
    coverBg: 'linear-gradient(135deg, #42b883 0%, #35495e 100%)'
  },
  {
    id: 2,
    title: 'React 18 并发渲染原理',
    category: '前端',
    categoryKey: 'frontend',
    teacher: '王芳',
    hours: 18,
    price: 199,
    coverBg: 'linear-gradient(135deg, #61dafb 0%, #20232a 100%)'
  },
  {
    id: 3,
    title: 'AI 辅助编程实战营',
    category: 'AI Coding',
    categoryKey: 'ai',
    teacher: '张磊',
    hours: 16,
    price: 399,
    coverBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 4,
    title: 'TypeScript 类型体操进阶',
    category: '前端',
    categoryKey: 'frontend',
    teacher: '陈静',
    hours: 20,
    price: 249,
    coverBg: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)'
  },
  {
    id: 5,
    title: 'Prompt 工程与 LLM 应用开发',
    category: 'AI Coding',
    categoryKey: 'ai',
    teacher: '赵强',
    hours: 14,
    price: 349,
    coverBg: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
  },
  {
    id: 6,
    title: 'Vite 构建工具深度剖析',
    category: '前端',
    categoryKey: 'frontend',
    teacher: '刘洋',
    hours: 12,
    price: 159,
    coverBg: 'linear-gradient(135deg, #646cff 0%, #a855f7 100%)'
  }
])

// 筛选课程
const filteredCourses = computed(() => {
  if (activeCategory.value === 'all') {
    return courses.value
  }
  return courses.value.filter(c => c.categoryKey === activeCategory.value)
})

// 学习进度颜色
const progressColor = (progress) => {
  if (progress === 100) return '#67c23a'
  if (progress >= 50) return '#409eff'
  return '#e6a23c'
}

// 学习记录数据
const learningRecords = ref([
  {
    id: 1,
    courseName: 'Vue3 组件库设计与实现',
    currentChapter: '第 8 章：表单组件封装',
    progress: 65,
    status: '学习中'
  },
  {
    id: 2,
    courseName: 'React 18 并发渲染原理',
    currentChapter: '第 5 章：Suspense 与并发模式',
    progress: 42,
    status: '学习中'
  },
  {
    id: 3,
    courseName: 'AI 辅助编程实战营',
    currentChapter: '第 11 章：AI 代码评审',
    progress: 100,
    status: '已完成'
  },
  {
    id: 4,
    courseName: 'TypeScript 类型体操进阶',
    currentChapter: '第 2 章：条件类型',
    progress: 18,
    status: '学习中'
  }
])

// FAQ 数据
const activeFaq = ref([0])
const faqList = ref([
  {
    question: '如何申请课程退款？',
    answer: '购买课程 7 天内且学习进度不超过 30%，可在「我的订单」页面申请全额退款，款项将在 3 个工作日内原路退回。'
  },
  {
    question: '课程证书如何获取？',
    answer: '完成课程全部章节学习并通过期末测验（≥60 分），系统将自动生成电子证书，可在「个人中心-我的证书」下载。'
  },
  {
    question: '课程有效期是多久？',
    answer: '购买后永久有效，可随时回看复习。配套的直播答疑服务自购买之日起 12 个月内有效。'
  }
])
</script>

<style scoped>
/* 页面整体 */
.learning-platform {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}

/* 主体白色容器 - 包裹所有区块 */
.main-wrap {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 28px 32px 32px;
  margin-top: 20px;
  margin-bottom: 20px;
  flex: 1;
}

/* 区块之间的分隔线 */
.section-block {
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #ebeef5;
}

/* Banner 区域 (第一个区块，不需要上边距和分隔线) */
.banner-section {
  width: 100%;
}

/* Header */
.platform-header {
  background: #ffffff;
  border-bottom: 1px solid #ebeef5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  gap: 24px;
}

/* 左侧 Logo + 搜索 */
.header-left {
  display: flex;
  align-items: center;
  gap: 28px;
  flex: 1;
  min-width: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 24px;
  color: #409eff;
}

.logo-text {
  font-size: 17px;
  font-weight: 700;
  color: #303133;
  white-space: nowrap;
}

.search-box {
  display: flex;
  align-items: stretch;
  gap: 0;
  max-width: 480px;
  flex: 1;
}

.search-box :deep(.el-input) {
  flex: 1;
}

.search-box :deep(.el-input__wrapper) {
  border-radius: 6px 0 0 6px !important;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  height: 32px;
}

.search-box :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

.search-input :deep(.el-input__inner) {
  height: 30px;
  line-height: 30px;
}

.search-btn {
  border-radius: 0 6px 6px 0 !important;
  height: auto;
  min-height: 32px;
  padding: 0 20px;
  flex-shrink: 0;
  margin-left: -1px;
}

/* 右侧 通知 + 头像 */
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.notification-badge {
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
}

.header-icon {
  font-size: 20px;
  color: #606266;
}

.header-icon:hover {
  color: #409eff;
}

.user-avatar {
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 50%;
  transition: box-shadow 0.2s;
}

.user-avatar:hover {
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}

/* Banner 轮播 */
.banner-carousel {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.banner-carousel :deep(.el-carousel__item) {
  width: 100% !important;
}

.banner-slide {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 32px 48px;
  color: #ffffff;
  box-sizing: border-box;
}

.banner-content {
  max-width: 560px;
}

.banner-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #ffffff;
  line-height: 1.3;
}

.banner-subtitle {
  font-size: 16px;
  margin-bottom: 22px;
  opacity: 0.95;
  color: #ffffff;
}

.banner-btn {
  background: #ffffff;
  color: #409eff;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  padding: 10px 28px;
}

.banner-btn:hover {
  background: #ecf5ff;
}

/* 区块标题 */
.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 13px;
  color: #909399;
}

/* 精选课程 */
.category-tabs {
  margin-bottom: 20px;
}

.category-tabs :deep(.el-tabs__item) {
  font-size: 14px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.course-card {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  transition: box-shadow 0.25s ease;
}

.course-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.course-cover {
  height: 120px;
  display: flex;
  align-items: flex-start;
  padding: 12px;
}

.course-category {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
}

.course-info {
  padding: 14px 16px 16px;
}

.course-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.course-meta {
  font-size: 12px;
  color: #909399;
  margin-bottom: 12px;
}

.course-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.course-price {
  font-size: 18px;
  font-weight: 700;
  color: #f56c6c;
}

/* 学习记录表格 */
.records-table :deep(.el-table) {
  border: 1px solid #ebeef5;
  border-radius: 6px;
}

/* 帮助中心 */
.faq-collapse :deep(.el-collapse-item__header) {
  font-weight: 500;
  font-size: 14px;
  height: 50px;
}

.faq-answer {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

/* Footer */
.platform-footer {
  background: #2c3e50;
  color: #ffffff;
  padding: 18px 0;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.copyright {
  font-size: 13px;
  color: #b0b8c1;
}

.feedback-btn {
  color: #409eff;
  font-size: 13px;
}
</style>
