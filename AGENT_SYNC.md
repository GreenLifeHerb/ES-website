# AI 协作交接文件

本文件用于 Codex、Antigravity 或其他协作者继续维护 Essence Source USA 官网。请保持 UTF-8 编码。

## 当前状态摘要

- 网站仓库：`https://github.com/GreenLifeHerb/ES-website`
- 线上域名：`https://essencesourceusa.com`
- Cloud Run 服务：`essencesource-website`
- 当前线上最新 commit：`4cb683e`
- 当前线上 revision：`essencesource-website-00048-nvs`
- 默认公司邮箱：`info@essencesourceusa.com`
- LinkedIn 公司主页已建立：`https://www.linkedin.com/company/essence-source-ingredients/`
- SMTP 表单邮件链路用户反馈已完成，当前不作为阻塞项。

## 最近完成的核心工作

### 1. 收录策略从“70 多页全推”改为“25 个优先页先收录”

原因：新站权重低，Google 已发现大量页面但不愿意快速抓取和收录。继续把 70 多个页面全部放进 XML sitemap 价值不高，反而可能让 Google 判断页面过多、相似、抓取优先级低。

已完成：

- XML sitemap 从 68 页压缩为 25 个优先 URL。
- HTML sitemap 继续保留完整页面目录，方便用户和爬虫发现全站内容。
- 当前 XML sitemap 只推首页、产品总页、4 个集合页、信任支撑页、5 个 SEO 落地页、6 个重点产品页。

### 2. 创建 5 个 SEO 搜索意图落地页

新增页面：

- `botanical-extract-supplier-usa.html`
- `botanical-ingredient-supplier.html`
- `nutraceutical-ingredient-supplier.html`
- `bulk-botanical-extracts.html`
- `custom-botanical-extract-manufacturing.html`

每个页面都包含：

- title / description / canonical
- Open Graph 信息
- FAQPage JSON-LD
- 站内重点链接
- RFQ / 样品 / 文档请求入口

### 3. 强化集合页收录价值

已强化页面：

- `brand-ingredients.html`
- `specialty-ingredients.html`
- `specification-extracts.html`
- `natural-mushrooms.html`

完成内容：

- FAQPage JSON-LD
- 可见 FAQ 或采购说明
- 静态优先产品链接，减少对 JS 渲染依赖
- `Natural Mushrooms` 修复 banner 图片 HTML 嵌套错误

### 4. 强化信任支撑页

已强化页面：

- `about.html`
- `contact.html`
- `quality.html`
- `warehouse.html`
- `partner.html`

完成内容：

- About / Contact 加入 LinkedIn `sameAs` 结构化信号
- Contact 增加公司验证模块
- Quality 增加文档验证流程
- Warehouse 降低过度承诺，改成可确认的仓储路径
- Partner 降低夸张营销话术，改成制造支持和文档协调说明
- 多处加入 LinkedIn 外部公司资料入口

### 5. 页脚信任徽章降风险

原页脚使用了容易被理解为全站认证承诺的词，如 USDA Organic、Kosher、Halal、cGMP。已改为更稳妥的 B2B 支持信号：

- COA Available
- COA / TDS on Request
- B2B RFQ Support
- U.S. Warehouse Path

## 当前验证结果

最近已通过：

- `npm.cmd run seo:validate` -> `structured-data-ok`
- `node infra/scripts/generate-sitemap.js --check` -> `sitemap-ok`
- 新增页面和信任页面内部链接检查无死链
- Cloud Run 已部署到最新 commit `4cb683e`
- 线上已抽查新内容生效

## 当前最重要的待办

### 必须在 GSC 手动执行

1. 重新提交 sitemap：

`https://essencesourceusa.com/sitemap.xml`

2. 使用 URL Inspection 对 `GSC_INDEXING_PRIORITY_URLS.md` 中的 Tier 1 和 Tier 2 页面逐个点击：

`Request indexing / 请求编入索引`

说明：此前 API 提交 sitemap 遇到本机 gcloud SSL / scope 问题，网页手动提交是当前最稳妥方式。

### 7-14 天后观察

重点看：

- “Discovered - currently not indexed” 是否下降
- sitemap 报告里 `lastDownloaded` 是否更新
- 25 个优先 URL 是否开始变成 indexed
- 展示次数是否从几十增长到 200-500+
- 是否有长尾词进入前 20-30

### 暂停事项

- 暂停继续大规模新增普通产品页。
- 暂停把 70 多个页面全部放回 XML sitemap。
- 未经真实证明，不要加入虚构评分、价格、库存、认证或保证性承诺。

## 外部信任信号待办

用户已完成 LinkedIn 公司主页。后续可继续做：

- Google Business Profile 或公开公司资料页
- 行业目录 / 供应商目录提交
- 合作伙伴或新闻稿外链
- 统一 NAP 信息：公司名、官网、邮箱、地址、LinkedIn

## 最近 commit

- `4cb683e fix(seo): soften footer trust badges`
- `37e862e fix(seo): strengthen trust support pages`
- `cea28df feat(seo): add supplier intent landing pages`
- `38bb551 fix(seo): strengthen collection crawl paths`
- `d982cfb fix(seo): strengthen brand ingredients index page`
