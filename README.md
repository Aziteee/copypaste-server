# COPYPASTE-SERVER

用Express和MongoDB构建的后端

API设计采用了类似GitHub的REST风格

## Scripts

`dev` - 以开发者模式运行(使用ts-node-dev模块)

`build` - 将ts文件编译为js

`start` - 运行编译后的js文件

## API

### 查询语句

**调用方式** : `GET /api/articles/`

**查询参数** :

| 参数      | 类型                                       | 默认值     | 说明     |
| --------- | ------------------------------------------ | ---------- | -------- |
| kw        | string                                     | ""         | 关键词   |
| pp        | number                                     | 10         | 每页数量 |
| pn        | number                                     | 1          | 页码     |
| sort      | [ArticleSortType](src/utils/enums.ts)      | uploadTime | 排序方式 |
| direction | [ArticleSortDirection](src/utils/enums.ts) | 1          | 排序方向 |

**返回示例**  :

```json
HTTP/1.1 200 OK
total: 12701 // 查询到的条目总数

[
  {
    "id": "6392e67437d802392860b8af",
    "text": "一群沙皮整天玩烂梗很自豪是吧，整天复制粘贴压缩毛巾原神什么压缩毛巾元神喷雾...",
    "likes": 0,
    "uploader": "admin",
    "uploadTime": "2022/12/09"
  },
  {
    "id": "6392e67437d802392860b8b3",
    "text": "很久以前，有次我电脑坏了，因为我是电脑太老...",
    "likes": 0,
    "uploader": "admin",
    "uploadTime": "2022/12/09"
  },
  ...
]
```

### 获取某条语句

**调用方式** : `GET /api/articles/:id`

**返回示例** :

```
{
  "id": "6396be993e3496e5f8add648",
  "text": "好活！复制粘贴是现代超意识流的杰作，黑色的文字象征稳重和神秘，充分体现了复制粘贴者的个人性格魅力，代表复制粘贴者的高雅与刚正...",
  "likes": 1,
  "uploader": "admin",
  "uploadTime": "2022/12/12"
}
```

### 上传语句

**调用方式** : `POST /api/articles/`

**请求体参数** :

| 参数     | 类型   | 说明   |
| -------- | ------ | ------ |
| text     | string | 文本   |
| uploader | string | 上传者 |

### 查询点赞状态

**调用方式** : `GET /api/articles/:id/liked`

**响应状态码 **:

| 状态码 | 说明         |
| ------ | ------------ |
| 204    | No Content   |
| 304    | Not modified |
| 404    | Not found    |

### 点赞

**调用方式** : `PUT /api/articles/:id/liked`

**响应状态码 **:

| 状态码 | 说明         |
| ------ | ------------ |
| 204    | No Content   |
| 304    | Not modified |
| 404    | Not found    |

### 取消点赞

**调用方式** : `DELETE /api/articles/:id/liked`

**响应状态码 **:

| 状态码 | 说明         |
| ------ | ------------ |
| 204    | No Content   |
| 304    | Not modified |
| 404    | Not found    |
