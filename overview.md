1. 用戶加入 => POST /api/admin/users

- (200):true - 加入成功
- (200):false - 重複加入
- (500):false - error.message

2. 權限檢查 => GET /api/admin/users/:id/auth

- (200):true - { 用戶資料 }
- (200):false - 用戶尚未加入
- (200):false - 用戶尚未完成實體註冊
- (200):false - 用戶權限遭移除
- (500):false - error.message

3. 取得所有用戶 => GET /api/admin/users

- (200):true - { 全部用戶 }
- (500):false - error.message

4. 取得指定用戶 => GET /api/admin/users/:userid

- (200):true - { 指定用戶 }
- (500):false - error.message

5. 刪除指定用戶 => DELETE /api/admin/users/:id

- (200):true - 刪除成功
- (500):false - error.message

6. 實體用戶註冊 => PATCH /api/admin/users/:id

- (200):true - 註冊成功
- (200):false - 重複註冊
- (500):false - error.message

7. 調整訪問權限 => PATCH /api/admin/users/:id/auth

- (200):true - 調整成功
- (500):false - error.message

---

8. 發送郵件 => POST /api/admin/mail

- (200):true - 發送成功
- (500):false - error.message

---

9. 圖片上傳 => POST /api/admin/upload

- (200):true - { 圖片連結 }
- (200):false - 不支援的檔案格式
- (200):false - 超過圖片限制大小
- (500):false - error.message

---

10. 管理員註冊 => POST /api/admin/signup

- (200):true - 註冊成功
- (200):false - 重複註冊
- (500):false - error.message

11. 管理員登入 => POST /api/admin/login

- (200):true - { 管理員資料 }
- (200):false - 帳號或密碼錯誤
- (500):false - error.message

12. 檢查是否持續登入 => POST /api/admin/check

- (200):true - interval > 5 ? 刷新 : 不刷新
- (200):false - 未帶有訪問令牌
- (200):false - 無效的訪問令牌

13. 管理員登出 => POST /api/admin/logout

- (200):true - 已登出
