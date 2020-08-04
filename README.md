# J-MAKER 實驗室門禁控制系統 API

## 更新日誌

- 2020/08/04：修復 Chrome 80+ 針對跨域 Cookie 的規則調整 (SameSite 必須從 Lax 改為 None 同時加上 Secure 屬性)

## 設計說明

解決硬體端傳統與資料庫整合上的困難，硬體端使用的 ESP32、ESP8266、Raspberry Pi 都只需要透過基本的 HTTP Request 即可完成與資料庫的溝通。

- 第一道進出入自動門 ✔
- 專題討論空間自動門 ✔
- CNC 器具間權限控管
- 3D 列印器材間權限控管

## 系統架構

1. 前端：[移至專案](https://github.com/awdr74100/jmaker-ac)
2. 後端：Node.js + Express.js
3. 資料庫：MongoDB + Mongoose (ODM)
4. 圖片儲存：Imgur API
5. 資料加密：Argon2
6. 驗證機制：JWT + Cookie
7. 部署：Vercel、MongoDB Atlas

## API：

1. 硬體端 (免驗證)

- `POST` [用戶加入](#用戶加入)
- `GET` [權限檢查](#權限檢查)

2. 控制台 (需驗證)

- `GET` [取得所有用戶](#取得所有用戶)
- `GET` [取得指定用戶](#取得指定用戶)
- `DELETE` [刪除指定用戶](#刪除指定用戶)
- `PATCH` [實體用戶註冊](#實體用戶註冊)
- `PATCH` [調整訪問權限](#調整訪問權限)
- `POST` [圖片上傳](#圖片上傳)
- `POST` [發送郵件](#發送郵件)

3. 登入及驗證

- `POST` [管理員註冊](#管理員註冊)
- `POST` [管理員登入](#管理員登入)
- `POST` [檢查是否持續登入](#檢查是否持續登入)
- `POST` [管理員登出](#管理員登出)

### 用戶加入

```plain
[PATH]: /users
[方法]: POST
[參數]:
  {
    "id": "RFID"
  }
[成功回應]:
  {
    "success": true,
    "message": "加入成功"
  }
[失敗回應]:
  {
    "success": false,
    "message": "重複加入"
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 權限檢查

```plain
[PATH]: /users/:id/auth
[方法]: GET
[說明]: @id = RFID
[成功回應]:
  {
    "success": true,
    "user": {
      "username": "<username>",
      "userid": "<userid>"
    }
  }
[失敗回應]:
  {
    "success": false,
    "message": "用戶尚未加入"
  }
[失敗回應]:
  {
    "success": false,
    "message": "用戶尚未完成實體註冊"
  }
[失敗回應]:
  {
    "success": false,
    "message": "用戶權限遭移除"
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 取得所有用戶

```plain
[PATH]: /users
[方法]: GET
[成功回應]:
  {
    "success": true,
    "users": [
      {
        "_id": "<id>",
        "username": "<username>",
        "userid": "<userid>",
        "auth": <boolean>,
        "register_at": <timestamp>,
        "created_at": <timestamp>
      }
    ]
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 取得指定用戶

```plain
[PATH]: /users/:userid
[方法]: GET
[說明]: @userid = Student ID
[成功回應]:
  {
    "success": true,
    "user": {
      "_id": "<id>",
      "username": "<username>",
      "userid": "<userid>",
      "auth": <boolean>,
      "register_at": <timestamp>,
      "created_at": <timestamp>
    }
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 刪除指定用戶

```plain
[PATH]: /users/:id
[方法]: DELETE
[說明]: @id = RFID
[成功回應]:
  {
    "success": true,
    "message": "刪除成功"
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 實體用戶註冊

```plain
[PATH]: /users/:id
[方法]: PATCH
[說明]: @id = RFID
[參數]:
  {
    "username": "<username>",
    "userid": "<userid>"
  }
[成功回應]:
  {
    "success": true,
    "message": "註冊成功"
  }
[失敗回應]:
  {
    "success": false,
    "message": "重複註冊"
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 調整訪問權限

```plain
[PATH]: /users/:id/auth
[方法]: PATCH
[說明]: @id = RFID
[參數]:
  {
    "auth": <boolean>
  }
[成功回應]:
  {
    "success": true,
    "message": "調整成功"
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 圖片上傳

傳統表單方式：

```html
<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="image" />
  <input type="submit" value="Upload" />
</form>
```

採 FormData 方式：

> 不須指定 Content-Type 為 multipart/form-data

```js
const file = e.target.files[0];
const formData = new FormData();
formData.append('image', file);
axios.post('/upload', formdata);
```

不建議直接使用 URL 預覽圖片，前端可採 FileRender 方式：

```js
const render = new FileReader();
return new Promise((resolve) => {
  render.addEventListener('load', (e) => {
    const base64 = e.target.result;
    resolve();
  });
  render.readAsDataURL(file);
});
```

```plain
[PATH]: /upload
[方法]: POST
[成功回應]:
  {
    "success": true,
    "message": "<imgUrl>"
  }
[失敗回應]:
  {
    "success": false,
    "message": "不支援的檔案格式"
  }
[失敗回應]:
  {
    "success": false,
    "message": "超過圖片限制大小"
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 發送郵件

```plain
[PATH]: /admin/signup
[方法]: POST
[參數]:
  {
    "nickname": "<nickname>",
    "email": "<email>",
    "subject": "<subject>",
    "imgUrl": "<imgUrl>",
    "content": "<content>"
  }
[成功回應]:
  {
    "success": true,
    "message": "註冊成功"
  }
[失敗回應]:
  {
    "success": false,
    "message": "重複註冊"
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 管理員註冊

> 目前暫不開放，只允許系統管理員操作

```plain
[PATH]: /admin/signup
[方法]: POST
[參數]:
  {
    "email": "<email>",
    "password": "<password>",
    "nickname": "<nickname>"
  }
[成功回應]:
  {
    "success": true,
    "message": "註冊成功"
  }
[失敗回應]:
  {
    "success": false,
    "message": "重複註冊"
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 管理員登入

記得將 credentials 跟著 request 一起送出，以下兩種方式：

```js
// Fetch
fetch('https://example.com', {
  credentials: 'include',
});

// Axios
axios.defaults.withCredentials = true;
```

```plain
[PATH]: /admin/login
[方法]: POST
[參數]:
  {
    "email": "<email>",
    "password": "<password>"
  }
[成功回應]:
  {
    "success": true,
    "admin": {
      "email": "<email>",
      "nickname": "<nickname>"
    }
  }
[失敗回應]:
  {
    "success": false,
    "message": "帳號或密碼錯誤"
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 檢查是否持續登入

```plain
[PATH]: /admin/check
[方法]: POST
[成功回應]:
  {
    "success": true,
  }
[失敗回應]:
  {
    "success": false,
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```

### 管理員登出

```plain
[PATH]: /admin/logout
[方法]: POST
[成功回應]:
  {
    "success": true,
    "message": "已登出"
  }
[發生異常]:
  {
    "success": false,
    "message": error.message
  }
```
