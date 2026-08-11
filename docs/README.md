# 项目文档索引

项目文档按职责分类。版本负责记录实现边界，日期只作为版本条目的辅助信息。

## 分类

- [`CHANGELOG.md`](CHANGELOG.md)：版本总索引，按版本号倒序列出状态、日期、摘要与详细记录。
- `changes/<version>.md`：单个版本的实现、关键参数、验证结果和已知限制；文件名必须与 `package.json` 版本一致。
- [`design/INTERACTION_RULES.md`](design/INTERACTION_RULES.md)：长期有效的交互边界、彩蛋触发规则与语言范围。
- [`design/TIME_OF_DAY_THEME.md`](design/TIME_OF_DAY_THEME.md)：昼夜切换时间、场景资产、背景图案、配色和降动效规则。
- [`adr/`](adr/)：架构、发布和版本策略等长期决策。
- [`preferences.md`](preferences.md)：稳定的产品、体验和协作偏好。
- [`feedback.md`](feedback.md)：用户反馈、处理决定与结果。
- [`todo.md`](todo.md)：尚未完成的具体工作，不保存已经完成的版本历史。
- `*.bundle`：仓库恢复快照，只用于本地灾难恢复。
- [`../assets/pixel/ASSET_MANIFEST.md`](../assets/pixel/ASSET_MANIFEST.md)：像素资产清单，与资产目录放在一起。

## 版本记录规则

- `package.json` 是当前版本的唯一来源。每次完成代码、内容、资产、交互或文档修改后，更新 `changes/<version>.md`。
- 新版本首次出现时创建对应文件，并在 `CHANGELOG.md` 顶部登记。版本号、CSS 和 JavaScript 缓存参数保持一致。
- 每个版本条目写明版本状态、日期、影响页面、主要行为、关键参数、验证结果和已知限制。
- Git 已提交或已打标签的版本记录提交号；只存在于工作树的版本明确标注“本地工作树”，不伪装成已发布版本。
- 修改触发范围、点击次数、语言边界、文案顺序或动效原则时，同时更新 `design/` 下的长期规则。
- 只记录已经落盘的结果。实验想法保留在讨论或 `todo.md`，未确认方案不进入长期规则。
