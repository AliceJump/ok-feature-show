# VSCode Python Coco Feature Preview 插件

## 功能简介

面向 Python 项目的 VSCode 插件。

为：

- `find_one`
- `find_feature`
- 以及其封装函数

提供：

- Feature 自动补全
- Enum 自动补全
- 自动导包
- Coco 图片预览
- Hover 语义增强

---

# 工作流程

## 1. 读取配置

插件启动时：

读取：

```txt
configs/template_tab.json
```

配置格式：

```json
{
    "generate_label_enum": true,
    "label_enum_relative_path": "src/data/FeatureList",
    "next_image_index": 22
}
```

---

# 2. 判断是否启用 Enum

## 当：

```json
"generate_label_enum": true
```

时：

解析：

```txt
label_enum_relative_path
```

对应的 Python Enum 文件。

---

# 3. 读取 Coco 数据

读取：

```txt
assets/coco_annotations.json
```

建立：

```txt
feature_name
    ↓
annotation
    ↓
image
    ↓
bbox preview
```

索引。

---

# 功能模式

---

# 模式 1：Enum 模式

当存在：

```txt
configs/template_tab.json
```

且：

```json
generate_label_enum = true
```

时：

使用 Enum 补全。

---

## 示例

用户输入：

```python
find_one(feature_name=
```

自动提示：

```txt
FeatureList
```

---

## 输入：

```python
FeatureList.
```

自动提示：

```txt
dog_icon
message_icon
```

---

## 右侧 Preview

显示：

- bbox 裁剪图
- image path
- bbox 信息
- annotation 信息

---

## 自动导包

自动插入：

```python
from src.data.FeatureList import FeatureList
```

---

# 模式 2：普通字符串模式

当不存在：

```txt
configs/template_tab.json
```

时：

直接读取：

```txt
assets/coco_annotations.json
```

提供字符串补全。

---

## 示例

```python
find_one(feature_name="
```

自动提示：

```txt
dog_icon
message_icon
```

---

## Hover Preview

鼠标悬停：

```python
"dog_icon"
```

显示：

- bbox preview
- image path
- annotation 信息

---

# 支持的函数

默认支持：

- `find_one`
- `find_feature`

以及：

- 对这两个函数的封装函数。

---

# 支持的参数

插件识别：

```python
feature_name=
```

```python
feature=
```

以及：

```python
feature=[...]
```

中的列表元素。

---

# 支持示例

---

## 字符串模式

```python
find_one(feature_name="dog_icon")
```

---

## Enum 模式

```python
find_one(feature_name=FeatureList.dog_icon)
```

---

## List 模式

```python
find_feature(
    feature=[
        FeatureList.dog_icon,
        FeatureList.message_icon
    ]
)
```

---

# 技术方案

基于：

- CompletionItemProvider
- HoverProvider
- Markdown Preview
- Sharp 图片裁剪

实现。

---

# Preview 方案

使用：

```txt
bbox 裁剪图
```

而不是原图。

---

# 图片生成

从：

```txt
assets/images/
```

读取原图。

根据：

```txt
annotations[].bbox
```

动态裁剪 Preview。

---

# Workspace 扫描

自动读取：

```txt
configs/template_tab.json
```

以及：

```txt
assets/coco_annotations.json
```

无需手动配置。

---

# 推荐项目结构

```txt
workspace/
├── assets/
│   ├── coco_annotations.json
│   └── images/
├── configs/
│   └── template_tab.json
├── src/
│   └── data/
│       └── FeatureList.py
```

---

# 插件核心能力

## Completion

提供：

- Enum 补全
- Feature 补全
- List 内补全

---

## Documentation Preview

补全右侧显示：

- 图片 preview
- bbox
- annotation

---

## Hover

鼠标悬停显示：

- 图片 preview
- Coco 信息

---

## Auto Import

自动插入：

```python
from xxx import FeatureList
```

---

# 不需要的技术

当前阶段：

- 不需要 LSP
- 不需要 AST
- 不需要 tree-sitter

使用：

- 正则
- 上下文分析

即可完成。