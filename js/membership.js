const mainContainer = document.getElementById('mainContainer'); // 【const】是常數宣告，用來把網頁標籤（HTML 節點）抓取到變數中固定下來
const authBlock = document.getElementById('authBlock');
const memberBlock = document.getElementById('memberBlock');

const viewLogin = document.getElementById('viewLogin');
const viewRegister = document.getElementById('viewRegister');
const viewProfile = document.getElementById('viewProfile');

const subViewInfo = document.getElementById('subViewInfo');
const subViewOrders = document.getElementById('subViewOrders');
const subViewReviews = document.getElementById('subViewReviews');

// 記錄當前瀏覽器視窗內的登入狀態，預設為未登入
let userIsLoggedIn = false; // 【let】是變數宣告，建立一個後續可以隨時修改內容的變數；【false】是布林值，代表邏輯上的「假/否」

// 登入與註冊的頁籤切換按鈕
const btnTabLogin = document.getElementById('btnTabLogin');
const btnTabRegister = document.getElementById('btnTabRegister');


// 切換至登入表單畫面
function showLoginTab() { 
    btnTabLogin.className = 'tab-button active-tab';
    btnTabRegister.className = 'tab-button';
    viewLogin.style.display = 'block'; // 代顯示在畫面上
    viewRegister.style.display = 'none'; // 完全隱藏
    viewProfile.style.display = 'none';
}

// 登入頁籤點擊事件
// 用來偵測網頁元件有沒有發生特定行為（如點擊 click）
btnTabLogin.addEventListener('click', showLoginTab); 

// 註冊頁籤點擊事件（切換至註冊第一步）
btnTabRegister.addEventListener('click', function() { 
    btnTabRegister.className = 'tab-button active-tab';
    btnTabLogin.className = 'tab-button';
    viewLogin.style.display = 'none';
    viewRegister.style.display = 'block';
    viewProfile.style.display = 'none';
});

// 註冊第一步點擊「下一步」，切換至填寫個人資料基本欄位
document.getElementById('btnNextStep').addEventListener('click', function() {
    viewRegister.style.display = 'none';
    viewProfile.style.display = 'block';
});

// 會員中心內部的小選單分頁控制（個人資料、消費紀錄、評論記錄）
const menuInfo = document.getElementById('menuInfo');
const menuOrders = document.getElementById('menuOrders');
const menuReviews = document.getElementById('menuReviews');

// target是函式的「參數」，用來接收外部呼叫時傳進來的特定文字
function changeSubView(target) { 
    // 隱藏所有分頁內容並還原選單樣式
    subViewInfo.style.display = 'none';
    subViewOrders.style.display = 'none';
    subViewReviews.style.display = 'none';
    menuInfo.className = '';
    menuOrders.className = '';
    menuReviews.className = '';

    // 依據傳入的目標參數決定顯示哪一個區塊
     // ===是嚴格相等比較，用來檢查兩邊內容與型態是否完全相同
    if (target === 'info') {
        subViewInfo.style.display = 'block';      
        menuInfo.className = 'active-menu';       
    } else if (target === 'orders') {
        subViewOrders.style.display = 'block';    
        menuOrders.className = 'active-menu';     
    } else if (target === 'reviews') {
        subViewReviews.style.display = 'block';   
        menuReviews.className = 'active-menu';    
    }
}

// 監聽會員中心各子分頁按鈕的點擊事件
menuInfo.addEventListener('click', function() { changeSubView('info'); });

// 【修改這一段】讓它在切換分頁的同時，也去讀取 LocalStorage 的訂單
menuOrders.addEventListener('click', function() { 
    changeSubView('orders'); 
    loadOrdersFromStorage(); // <--- 補上這行！
});

menuReviews.addEventListener('click', function() { 
    changeSubView('reviews'); 
    loadReviewsFromStorage(); // <--- 【補上這行】點擊時才會去撈資料庫！
});

// 會員登入、註冊與登出邏輯

// 輔助函式：將使用者資料渲染至 HTML 對應的文字欄位中
function renderUserProfile(userData) {
    // innerText用來修改 HTML 標籤內包裹的純文字；【||】代表「或」，如果左邊沒資料就採用右邊的文字
    document.getElementById('showName').innerText = userData.name || "測試會員"; 
    document.getElementById('showPhone').innerText = userData.phone || "未填寫";
    document.getElementById('showDob').innerText = userData.dob || "未填寫";
    document.getElementById('showPassword').innerText = userData.password || "******";
}

// 處理會員登入按鈕點擊
document.getElementById('btnLoginSubmit').addEventListener('click', function() {
    userIsLoggedIn = true; 
    
    // 封裝輸入的手機號碼及預設資料
    let loginUserData = { 
        name: "測試會員",
        phone: document.getElementById('inputLogPhone').value || "0912345678", 
        dob: "1998 / 05 / 20",
        password: "******"
    };
    
    // 將會員物件轉換為 JSON 字串存入瀏覽器資料庫，供重新整理時讀取
    //localStorage是瀏覽器本機儲存空間；JSON.stringify用來將物件轉成純文字字串以利儲存
    localStorage.setItem('loggedInUser', JSON.stringify(loginUserData)); 

    // 渲染資料並切換顯示畫面
    renderUserProfile(loginUserData);
    authBlock.style.display = 'none';
    memberBlock.style.display = 'block';
    changeSubView('info');
    
    // 自本機載入該會員的歷史評論資料
    loadReviewsFromStorage();
});

// 處理完成註冊並送出按鈕點擊
document.getElementById('btnRegisterSubmit').addEventListener('click', function() {
    userIsLoggedIn = true; 

    // 封裝註冊表單輸入的會員完整資料
    let regUserData = {
        phone: document.getElementById('inputRegPhone').value || "未填寫",
        password: document.getElementById('inputRegPassword').value || "未設定",
        name: document.getElementById('inputRegName').value || "未填寫",
        dob: document.getElementById('inputRegDob').value || "未填寫"
    };
    
    // 將新註冊的會員資料鎖入瀏覽器暫存
    localStorage.setItem('loggedInUser', JSON.stringify(regUserData));

    // 渲染新資料並進入會員專區
    renderUserProfile(regUserData);
    authBlock.style.display = 'none';
    memberBlock.style.display = 'block';
    changeSubView('info');
    
    loadReviewsFromStorage();
});

// 處理登出帳號按鈕點擊
document.getElementById('btnLogout').addEventListener('click', function() {
    forceLogoutReset();
});

// 執行強制登出，並完整清空狀態與輸入欄位
function forceLogoutReset() {
    // 移除瀏覽器暫存的會員登入紀錄，防止下次自動登入
    // removeItem用來把本機儲存空間中的特定歷史資料完全刪除抹除
    localStorage.removeItem('loggedInUser'); 
    userIsLoggedIn = false;                  
    
    // 還原介面文字為預設狀態
    document.getElementById('showName').innerText = "未填寫";
    document.getElementById('showPhone').innerText = "未填寫";
    document.getElementById('showDob').innerText = "未填寫";
    document.getElementById('showPassword').innerText = "未填寫";
    
    // 清空登入表單中的輸入欄位內容
    document.getElementById('inputLogPhone').value = ""; 
    document.getElementById('inputLogPassword').value = "";
    
    // 徹底清空評論顯示盒內的舊 HTML 結構，防止多帳號切換時重疊
    // innerHTML代表該標籤內部的網頁結構，設為空字串可徹底清除裡面的動態元件
    subViewReviews.innerHTML = ""; 

    // 還原為最原始的未登入表單介面
    authBlock.style.display = 'block';
    memberBlock.style.display = 'none';
    showLoginTab(); 
}


// 網頁載入初始化（防止重新整理自動登出）

// 檢查瀏覽器 LocalStorage 狀態，決定網頁載入時要顯示的介面
function checkLoginStateOnLoad() {
     // 【.getItem】用來向本機儲存空間讀取/撈取先前存下來的資料
    const savedUser = localStorage.getItem('loggedInUser');
    
    if (savedUser) {
        // 若偵測到登入紀錄，則在重整後將登入狀態還原為 true
        userIsLoggedIn = true;
        
        // JSON.parse能把純文字還原回原本的 JavaScript 物件
        let userData = JSON.parse(savedUser); 
        
        // 自動回填數據並直接開啟會員中心畫面
        renderUserProfile(userData);
        authBlock.style.display = 'none';
        memberBlock.style.display = 'block';
        
        // 預設切換至個人資料小分頁，並同步加載評論
        changeSubView('info');
        loadReviewsFromStorage();
    } else {
        // 若無任何登入紀錄，則執行常規重製，保持在登入註冊表單
        forceLogoutReset();
    }
}

// 當網頁 DOM 結構載入完畢，立刻啟動登入狀態校驗
window.addEventListener('DOMContentLoaded', function() { 
    checkLoginStateOnLoad();
});

// 點擊網頁頂部導覽列頭像時，顯示或隱藏會員功能總容器
// e包含了與這次點擊行為相關的所有詳細資訊（如點到了誰）
document.addEventListener('click', function(e) { 
    const avatarBtn = e.target.closest('#navAvatar'); 
    if (avatarBtn) {
        // 阻止 HTML 的 <a> 標籤觸發預設的跳轉重新整理行為
        e.preventDefault(); 
        // 依據當前狀態切換主容器的開啟與關閉
        if (mainContainer.style.display === 'none') {
            mainContainer.style.display = 'block';
        } else {
            mainContainer.style.display = 'none';
        }
    }
});



function loadReviewsFromStorage() {
    // 渲染前清空節點內容
    subViewReviews.innerHTML = "";

    // 1. 先檢查現在是哪一位會員登入
    let savedUser = localStorage.getItem('loggedInUser');
    if (!savedUser) {
        subViewReviews.innerHTML = '<div class="info-item">請先登入帳號</div>';
        return;
    }
    let userObj = JSON.parse(savedUser);
    
    // 使用與寫入時一樣的鑰匙結構 (userReviews_ + 手機號碼)
    let reviewKey = 'userReviews_' + userObj.phone;
    let savedReviews = localStorage.getItem(reviewKey);

    if (savedReviews) {
        let reviewsArray = JSON.parse(savedReviews);
        // 遍歷評論陣列並轉為實體 DOM
        reviewsArray.forEach(function(item) { 
            addReviewData(item.productName, item.rating, item.comment);
        });
    } else {
        subViewReviews.innerHTML = '<div class="info-item">暫無評論紀錄</div>'; 
    }
}

function addReviewData(productName, rating, comment) {
    let reviewItem = document.createElement("div"); 
    reviewItem.className = "info-item";
    reviewItem.style.borderBottom = "1px solid #A9B4C2";
    reviewItem.style.paddingBottom = "10px";
    reviewItem.style.marginTop = "10px";
   
    // 強制將 rating 轉換為正確的顯示邏輯 (6 - rating)
let correctedRating = 6 - Number(rating);
let starString = "★".repeat(correctedRating) + "☆".repeat(5 - correctedRating);
   
    reviewItem.innerHTML = `
        <div><strong>商品名稱：</strong> ${productName}</div>
        <div><strong>評價星等：</strong> <span style="color: #7D98A1;">${starString}</span></div>
        <div><strong>評論內容：</strong> ${comment}</div>
    `;
    
    // 要有這一行，評論才會出現在頁面上
    subViewReviews.appendChild(reviewItem);
}

function loadOrdersFromStorage() {
    subViewOrders.innerHTML = ""; 

    let savedUser = localStorage.getItem('loggedInUser');
    if (!savedUser) {
        subViewOrders.innerHTML = '<div class="info-item">請先登入帳號</div>';
        return;
    }

    let userObj = JSON.parse(savedUser);
    // 這個 key 必須與你「結帳時」寫入 localStorage 的 key 完全一致
    let orderKey = 'my_orders_' + userObj.phone; 
    let savedOrders = localStorage.getItem(orderKey);

    if (savedOrders) {
        let ordersArray = JSON.parse(savedOrders);
        ordersArray.forEach(function(order) {
            let orderBlock = document.createElement("div");
            orderBlock.className = "info-item"; 
            
            // 【新增修改】：讓消費紀錄與評論紀錄一樣，有底線、內距與間距
            orderBlock.style.borderBottom = "1px solid #A9B4C2";
            orderBlock.style.paddingBottom = "10px";
            orderBlock.style.marginTop = "10px";
            
            // 填入訂單資料
            orderBlock.innerHTML = `
                <p><b>訂單單號：</b> ${order.orderId || "無單號"}</p>
                <p><b>交易時間：</b> ${order.date || "無日期"}</p>
                <p><b>收件人：</b> ${order.receiver || "未填寫"}</p>
                <p style="color: #D96B6B;"><b>實付總額：</b> NT$ ${order.total || 0}</p>
            `;
            subViewOrders.appendChild(orderBlock);
        });
    } else {
        // 如果這裡出現「暫無消費紀錄」，代表該手機號碼的箱子目前是空的
        subViewOrders.innerHTML = '<div class="info-item">暫無消費紀錄</div>';
    }
}