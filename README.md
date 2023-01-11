# pomodoro-todo
A simple to-do list, including Pomodoro feature

![截圖 2023-01-11 上午9 13 29](https://user-images.githubusercontent.com/41847720/211695204-d2b726cb-40bd-427d-8efe-a789ad9e1789.png)
![截圖 2023-01-11 上午9 13 55](https://user-images.githubusercontent.com/41847720/211695227-aa4ea0aa-dfab-4d63-91a4-3fea732ff459.png)
![截圖 2023-01-11 上午9 13 42](https://user-images.githubusercontent.com/41847720/211695239-823a4745-0638-44e8-8077-4cd0410b00ac.png)

## 使用技術
- Vue(Vue3)
- Pinia
- Vue Router
- Vite
- dayjs
- Vue-chart(chartjs)
- floating-ui
- Firebase 後端採用 Firebase 建立
- ESLint、Prettier、lint-staged、husky

## Quick Start

```
npm i
npm run dev
```

## 目標

### 主要目標

-   [x] 用戶登入登出註冊
-   [x] 用戶讀取、新增、刪除、修改 Task 項目
-   [x] 番茄鐘功能
    -   [x] 番茄鐘能夠依照用戶設置設置自動接續倒數
    -   [x] 番茄鐘可以在倒數時縮小，用戶可以繼續其他操作行為
    -   [x] 若是正在執行番茄計時的任務遭到刪除，番茄鐘會立刻中止
-   [x] 用戶可以修改用戶番茄鐘設置，包含：番茄工作時長、休息時長、長休息時長、長休息間隔

### 次要目標

-   [x] 番茄鐘使用習慣圖表
    -   [ ] 用戶可以影印番茄鐘圖表
-   [ ] 用戶可以設置番茄鐘倒數警示聲
-   [ ] 用戶可以設置頭像
-   [ ] E2E 測試
-   [ ] Unit test

更多細節，見 Side Project 實作紀錄 >>> [用 Vue + Firebase 打造 Pomodoro | RU Tseng](https://yun-ru-tseng.github.io/posts/make-a-pomodoro/)
