# Twinstudio 手机版 + 桌面版深度合并最终施工计划

> 本文档以以下两个完整项目为来源：
>
> - 桌面端：`/Users/zilanwang/twinstudio branding_desktop/`
> - 手机端：`/Users/zilanwang/twinstudio branding_mobile/`
>
> 合并目标不是简单地按设备跳转两个网站，而是形成同一个正式项目：共用路由、内容数据和构建流程，桌面与手机保留各自的布局和动效。

## 0. 三项不可改变的合并原则

### 0.1 正式版停止使用 Base64 巨型单文件

当前桌面端通过 `build.py` 将图片转成 Base64 并生成约 9.7 MB 的单个 HTML。深度合并后，不再把桌面和手机的全部素材内嵌进 HTML。

正式版本必须部署为普通文件结构：

```text
index.html
css/
js/
data/
assets/
fonts/
```

HTML、CSS、JavaScript、字体和图片分别加载，使浏览器能够缓存资源，并只加载当前页面实际需要的内容。

旧 `build.py` 和生成的 `desktop.html` 仅保留为桌面原版对照及回退版本，不作为深度合并后的正式构建方式。不得直接修改编译产物 `desktop.html`。

### 0.2 Story 必须改成独立语义区块

桌面端现有 `story_hero.jpg`、`story_mid.jpg` 等整张拼接图只能作为视觉排版参考，不得继续承担整页文字、照片和内容结构。

合并后的 Story 以手机端独立内容结构为基础，至少拆分为：

- 标题与品牌装饰；
- Slogan；
- 第一段品牌故事文字；
- 第二段品牌故事文字；
- Made to Share；
- Inspired by Life；
- Thoughtful by Design；
- Instagram 图片区；
- Footer。

桌面和手机共用同一份 Story 内容和语义 DOM，只使用不同 CSS 排版与不同动效。未来修改文案或照片时，不得要求重新导出一张完整页面大图。

### 0.3 Collection 与 Detail 的产品必须数据化

桌面端现有 `coll_rowA.jpg`、`coll_rowB.jpg`、`coll_rowC.jpg` 和 `detail_grid.jpg` 仅作为桌面视觉参考，不再作为正式产品内容。

每件产品必须拥有独立图片和独立数据记录，例如：

```js
{
  id: "home-01",
  category: "home",
  name: "Product name",
  tagline: "Product description",
  image: "/assets/products/home/home-01.png",
  url: ""
}
```

桌面和手机共用同一份产品数据与商品卡片 DOM：

- 手机通过 Mobile CSS 排列；
- 桌面通过 Desktop CSS 排列；
- 产品名称、图片、分类、顺序和链接只维护一次；
- 不得通过裁切旧拼接图伪装成数据化产品列表。

艺术字标题、品牌字标、手绘装饰和纯图案跑马灯可以继续使用图片或 SVG，但产品图片、产品文字、按钮和链接必须是独立元素。

## 1. 当前项目结构

### 1.1 桌面端

桌面端是一个单页网站：

- 首页滚动掉落剧场；
- Philosophy；
- Milo/BoBo 角色区；
- Lookbook；
- Collection；
- Collection Detail；
- Story；
- 菜单与 Footer；
- 使用 `location.hash` 和覆盖层切换内页。

权威源码是：

```text
template.html
assets/
build.py
```

`index.html`/`desktop.html` 是生成产物，不应手工修改。

### 1.2 手机端

手机端是原生 HTML/CSS/JS 单页应用，当前包含：

- Collection；
- Collection Detail；
- Story；
- 菜单与 Footer；
- `products-data.js` 商品数据；
- 以 `.view.active` 切换页面。

当前手机端尚未接入完整 Home、Philosophy 和 Lookbook View。相关素材即使存在，也不能视为页面已经完成。

## 2. 最终目录结构

在新的正式项目目录中施工，不直接覆盖两个原始目录。

```text
twinstudio/
├── index.html
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── desktop.css
│   ├── mobile.css
│   └── motion.css
├── js/
│   ├── app.js
│   ├── router.js
│   ├── home-desktop.js
│   ├── home-mobile.js
│   ├── collection.js
│   ├── detail.js
│   ├── story.js
│   ├── menu.js
│   └── marquee.js
├── data/
│   └── products-data.js
├── assets/
│   ├── shared/
│   ├── desktop/
│   ├── mobile/
│   ├── products/
│   ├── story/
│   └── lookbook/
├── fonts/
│   ├── PizzaismyFAVORITE.ttf
│   └── FuturaExtraBlackCondensed.otf
├── legacy/
│   ├── desktop-reference.html
│   └── build.py
└── README.md
```

`legacy/` 只用于视觉对照和紧急回退，不参与正式页面运行。

## 3. 页面与路由约定

统一使用 Hash 路由，使同一个链接在桌面和手机上进入对应页面：

```text
无 Hash                     Home
#philosophy                 Philosophy
#lookbook                   Lookbook
#collection                 Collection
#detail/art                 Art Detail
#detail/home                Home Detail
#detail/accessory           Accessory Detail
#detail/handcraft           Handcraft Detail
#detail/apparel             Apparel Detail
#detail/doggoods            Dog Goods Detail
#story                      Story
```

手机端不再只调用 `showView()` 切页；所有菜单、Explore、分类标签和返回操作均读写 Hash。

路由是唯一页面状态来源：

```js
const [page = "home", category = ""] =
  location.hash.replace(/^#/, "").split("/");
```

必须支持：

- 直接打开某个 Hash；
- 浏览器前进/返回；
- 刷新后保持当前页面；
- 桌面和手机共享链接；
- 无效分类回退到 Collection，而不是空白页。

## 4. 响应式与初始化策略

第一阶段暂定断点：

```text
<1024px     手机/平板布局
>=1024px    桌面布局
```

该断点必须通过 768、1024、1180 和 1280 宽度实际检查；如果 1024 桌面布局拥挤，可调整为 1100px 左右。断点由布局是否成立决定，不以设备名称决定。

### 4.1 首页

首页允许两套 DOM：

```text
#home-desktop
#home-mobile
```

- 桌面首页滚动剧场原样迁移；
- 桌面 `ELEMENTS`、`RIDERS`、`CHARS`、`LB_CELLS` 保持独立配置；
- 手机首页在设计完成后接入；
- 未完成前不得把 Collection 冒充为正式手机首页；
- 首页只初始化当前断点对应的脚本。

### 4.2 内页

Collection、Detail、Story 使用统一内容 DOM：

```text
同一 DOM
├── mobile.css
└── desktop.css
```

不得为 Collection、Detail 和 Story 同时保留两套完整且重复的内容 DOM。

### 4.3 跨断点

第一阶段允许只在真正跨越断点时刷新页面，但必须保留 Hash：

```js
const query = matchMedia("(min-width: 1024px)");
let wasDesktop = query.matches;

query.addEventListener("change", event => {
  if (event.matches !== wasDesktop) {
    wasDesktop = event.matches;
    location.reload();
  }
});
```

第二阶段应提供模块生命周期：

```js
initDesktop();
destroyDesktop();
initMobile();
destroyMobile();
```

加入 Rive 前必须完成对应实例的 `cleanup()` 方案。

## 5. 各页面施工要求

### 5.1 Home

- 迁移桌面滚动剧场，不改变视觉和时间线；
- 将内联代码拆到 `home-desktop.js` 与 Desktop CSS；
- 保留 `prefers-reduced-motion` 静态状态；
- 手机首页等待正式设计，不在本次合并中凭空设计；
- 首页素材允许桌面和手机分别使用。

### 5.2 Philosophy

- 桌面版本保留现有设计；
- 确认手机设计后决定是共用内容还是独立表现；
- 标题可以继续使用轮廓化 SVG；
- 如果正文未来需要编辑，正文不得烧入整张图片。

### 5.3 Lookbook

- 桌面保留现有 `LB_CELLS` 网格和渐入效果；
- 手机版尚未实现时保留明确占位，不制作假页面；
- 图片文件保持独立；
- 手机触摸设备不依赖 hover 才能看到关键信息。

### 5.4 Collection

统一使用手机端分类和数据结构：

- 每个分类卡片是独立 HTML；
- 分类图片独立加载；
- 标题、说明、Explore 按钮是独立元素；
- 桌面端通过 Grid/Flex 重现旧设计的双列节奏；
- 旧 `coll_rowA/B/C.jpg` 只作为视觉参考；
- 所有 Explore 按钮写入 `#detail/<category>`；
- 分类排序由统一配置管理。

桌面素材可用于标题或装饰，但不能把产品、文字和按钮重新烘焙成一张图。

### 5.5 Collection Detail

统一使用手机端数据驱动模式：

- 分类标签由配置生成；
- Hero 图片按分类切换；
- Slogan 和分类名称按数据切换；
- 产品卡片由 `products-data.js` 生成；
- 手机保持当前产品网格；
- 桌面默认四列，并根据实际宽度调整；
- 每件商品拥有独立图片、名称、描述和链接；
- Load More 必须操作真实商品数组；
- 旧 `detail_grid.jpg` 只作为视觉参考；
- 返回键回到 `#collection`；
- 切换分类时同步 Hash。

### 5.6 Story

统一以手机端的独立内容区块为基础：

- 标题、文案、插图和照片分别存在；
- 桌面 CSS 重现旧桌面大图的排版；
- 手机 CSS 保留当前 402px 设计比例；
- `story_hero.jpg`、`story_mid.jpg` 只用于视觉对照；
- 任何可编辑正文不得烧入图片；
- Instagram 图片使用独立文件；
- 手机保留手动横滑与 scroll snap；
- 桌面可使用自动无缝滚动；
- 两端共用相同图片列表。

## 6. 共享组件

以下组件在内容上共用，在布局上响应式变化：

- Header；
- Logo；
- Burger/Close/Back；
- 菜单链接；
- Footer；
- 分类名称；
- 商品数据；
- 社交与商店链接；
- 色彩、字体、间距和动效变量。

建议在 `tokens.css` 中统一：

```css
:root {
  --brown: #4c2b08;
  --cream: #f7ecd8;
  --content-max: 1440px;
  --ease-brand: cubic-bezier(.22, .72, .2, 1);
}
```

共享不意味着强迫两端使用相同尺寸或相同动效。Header、菜单和 Footer 可以共用语义结构，并在 Desktop/Mobile CSS 中分别布局。

## 7. 跑马灯和滚动交互

不强制所有跑马灯使用同一种实现：

- 纯装饰图案条带可继续使用 CSS `background-position`；
- 需要独立卡片、链接或无缝重复的区域使用 DOM 轨道；
- 手机 Story Instagram 保留手动横滑；
- 桌面 Story Instagram 可保留自动滚动；
- 所有自动动画在 `prefers-reduced-motion` 下停止或显示静态状态；
- 页面隐藏或切换后暂停不必要的动画。

## 8. 素材与字体规范

### 8.1 素材

- 桌面和手机原素材先分别保留，避免误覆盖；
- 确认内容完全相同后才移动到 `assets/shared/`；
- 产品图片统一放入 `assets/products/<category>/`；
- 文件名使用稳定的英文小写与连字符；
- 商品数据引用绝对站内路径，例如 `/assets/products/home/home-01.png`；
- `.DS_Store`、预览截图和临时导出文件不进入正式构建。

### 8.2 字体

手机端实际字体目录名与 CSS 引用必须统一。正式目录固定为：

```text
fonts/PizzaismyFAVORITE.ttf
fonts/FuturaExtraBlackCondensed.otf
```

通过 `@font-face` 使用 `/fonts/...` 绝对路径。发布前必须检查 Network 面板无字体 404，并为所有字体提供回退字体。

## 9. Git 与分工

建议分支：

```text
main
├── integration/base
├── integration/router
├── desktop/home-polish
├── mobile/home
├── feature/collection
├── feature/detail
└── feature/story
```

推荐责任划分：

- 一人负责 Router、构建和公共组件；
- 桌面负责人修改 `desktop.css`、`home-desktop.js`；
- 手机负责人修改 `mobile.css`、`home-mobile.js`；
- Collection、Detail、Story 按页面分支施工；
- 不允许两人同时大范围修改入口 HTML；
- 不允许直接修改生成产物。

每个页面独立提交和验收，不一次性提交全部重构。

## 10. 正式施工顺序

### 阶段 A：建立安全基线

1. 保留当前桌面与手机原目录不变；
2. 保存当前线上分流版本；
3. 在新合并项目建立 Git 基线提交；
4. 记录桌面和手机关键页面截图；
5. 确认所有原始素材可读取。

### 阶段 B：建立新工程骨架

6. 创建最终目录结构；
7. 拆出 CSS、JS、数据和字体；
8. 停止 Base64 正式构建；
9. 将旧桌面构建脚本移入 `legacy/`；
10. 建立 `tokens.css` 与基础样式；
11. 验证普通静态资源路径可在本地和部署环境使用。

### 阶段 C：统一路由和框架

12. 建立 Hash Router；
13. 接入浏览器返回、前进和直达；
14. 建立 Header、菜单、Footer；
15. 接入断点判断；
16. 保证只初始化当前设备对应的首页脚本；
17. 为无效 Hash 和分类建立回退。

### 阶段 D：迁移桌面核心

18. 迁移桌面 Home 滚动动画；
19. 迁移 Philosophy；
20. 迁移 Milo/BoBo 角色区；
21. 迁移 Lookbook；
22. 对照原桌面版本验证滚动时间线和视觉。

### 阶段 E：重建共享内页

23. 以手机 DOM 重建统一 Collection；
24. 使用独立分类图片和真实 HTML 按钮；
25. 使用统一商品数据重建 Detail；
26. 用独立产品图片生成桌面和手机产品网格；
27. 删除正式页面对 `coll_rowA/B/C.jpg` 和 `detail_grid.jpg` 的依赖；
28. 以手机独立内容结构重建 Story；
29. 用 Desktop CSS 重现旧 Story 排版；
30. 删除正式页面对 `story_hero.jpg`、`story_mid.jpg` 内容拼图的依赖；
31. 分别实现手机和桌面 Instagram 交互。

### 阶段 F：移动端补齐

32. 接入正式 Mobile Home 设计；
33. 接入 Mobile Philosophy；
34. 接入 Mobile Lookbook；
35. 处理触摸、横屏、Safe Area 和动态视口高度。

如果这三个页面尚无设计，阶段 F 可延后，但正式上线前必须明确哪些页面会显示，以及缺失路由如何处理。

### 阶段 G：性能、无障碍和部署验收

36. 图片按需要转换为 WebP/AVIF，并保留合理 fallback；
37. 首屏以外图片启用懒加载；
38. 检查字体加载和回退；
39. 增加 `prefers-reduced-motion`；
40. 检查键盘焦点、菜单焦点和触摸目标；
41. 检查图片 alt、标题层级和页面语义；
42. 验证页面切换后无重复事件监听；
43. 验证隐藏页面不继续运行重动画；
44. 记录正式构建体积；
45. 部署 Preview；
46. 真机验收后再替换正式入口。

### 阶段 H：Rive

47. 先选择一个独立角色做 Rive 技术验证；
48. `.riv` 文件作为独立静态资源加载；
49. 明确 State Machine 输入；
50. 处理 resize、设备像素比和触摸；
51. 页面切换和跨断点时调用 `cleanup()`；
52. 为 Rive 加载失败和减少动态效果提供静态 fallback；
53. 技术验证通过后再逐步替换其他动效。

## 11. 验收清单

### 11.1 路由

- [ ] 无 Hash 正常进入 Home；
- [ ] `#collection` 可直达；
- [ ] 每个 `#detail/<category>` 可直达；
- [ ] `#story` 可直达；
- [ ] `#lookbook` 可直达或明确降级；
- [ ] 浏览器返回和前进正确；
- [ ] 刷新不会丢失当前页面；
- [ ] 无效 Hash 不会产生空白页。

### 11.2 Collection 与 Detail

- [ ] 正式页面不加载 `coll_rowA/B/C.jpg`；
- [ ] 正式页面不加载 `detail_grid.jpg`；
- [ ] 每件商品有独立图片；
- [ ] 商品卡片由统一数据生成；
- [ ] 桌面和手机商品内容一致；
- [ ] 分类切换同步 URL；
- [ ] 商品链接可单独配置；
- [ ] Load More 不依赖写死 DOM。

### 11.3 Story

- [ ] 正文是可选择的 HTML 文本；
- [ ] 照片和插图是独立资源；
- [ ] 修改文案不需要重新导出整张大图；
- [ ] 桌面排版符合原视觉；
- [ ] 手机排版符合 402px 设计；
- [ ] 手机 INS 可以手动横滑；
- [ ] 桌面 INS 自动滚动可暂停；
- [ ] 正式内容不依赖 `story_mid.jpg` 拼图。

### 11.4 首页与动效

- [ ] 桌面首页掉落时间线一致；
- [ ] RIDERS 落地姿态正确；
- [ ] Milo/BoBo 入场正确；
- [ ] Lookbook 渐入和 hover 正确；
- [ ] 手机触摸不依赖 hover；
- [ ] 减少动态效果时有可用静态状态；
- [ ] 页面隐藏后重动画暂停。

### 11.5 尺寸

- [ ] 375px；
- [ ] 390px；
- [ ] 402px；
- [ ] 430px；
- [ ] 768px；
- [ ] 1024px；
- [ ] 1180px；
- [ ] 1280px；
- [ ] 1440px；
- [ ] 1920px；
- [ ] 手机横屏；
- [ ] iPhone Safari；
- [ ] Android Chrome。

### 11.6 构建与性能

- [ ] 正式版不是 Base64 巨型单 HTML；
- [ ] CSS、JS、字体和图片可分别缓存；
- [ ] 无字体或图片 404；
- [ ] 首屏外图片懒加载；
- [ ] 手机不会下载不需要的桌面重型素材；
- [ ] 桌面不会初始化手机专属动画；
- [ ] Preview 与正式路径行为一致。

## 12. 完成定义

满足以下条件才算完成深度合并：

1. 同一个正式入口和同一套 Hash 路由服务桌面与手机；
2. 桌面首页核心动画与原版本一致；
3. Collection 与 Detail 完全由独立图片和统一产品数据生成；
4. Story 由独立 HTML 文本、图片和区块组成；
5. 正式版本不再是巨型 Base64 单文件；
6. 桌面和手机不会同时初始化重型动画；
7. 浏览器返回、刷新和直达链接正确；
8. 关键尺寸与真机测试通过；
9. 旧桌面拼接图和旧构建方式只存在于 `legacy/` 作为参考；
10. 项目结构足以在 Cursor 中继续独立修改内容、布局和 Rive 动效。
