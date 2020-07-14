- 硬體 - 用戶註冊 => POST /api/v2/users

- 硬體 - 身分檢查 => GET /api/v2/users/:uid/auth

---

- 前台 - 取得所有用戶 => GET /api/v2/users

- 前台 - 取得指定用戶 => GET /api/v2/users/:uid

- 前台 - 刪除指定用戶 => DELETE /api/v2/users/:uid

- 前台 - 核准指定用戶 => PATCH /api/v2/users/:uid

- 前台 - 修改訪問權限 => PATCH /api/v2/users/:uid/:auth

  - 圖片上傳

---

- 前台 - 管理員登入 => POST /api/v2/admin/login

- 前台 - 檢查管理員是否仍持續登入 => GET /api/v2/admin/check

- 前台 - 管理員登出 => POST /api/v2/admin/logout
