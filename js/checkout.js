function carClick(){
    let name = document.querySelector("#name").value;
    let address = document.querySelector("#address").value;
    let phone = document.querySelector("#phone").value;
    let payment = document.querySelector("#payment").value;

    if(name == "" || address == "" || phone == "" || payment == "請選擇" || payment == ""){
        alert("請填寫完整資料");
        return; 
    }
    
    //整合修改(以下皆為新增)
    let newOrder = {
        orderId: 'LN' + Math.floor(Math.random() * 100000), 
        date: new Date().toLocaleDateString(),             
        receiver: name,                                    
        payment: payment,                                  
        total: "1,190"                                     
    };

    // 先去檢查現在是哪一個會員正在登入結帳
    let loggedInUser = localStorage.getItem('loggedInUser');
    let userPhone = "guest"; // 如果真的沒登入，預設丟到 guest 箱子

    if (loggedInUser) {
        let userData = JSON.parse(loggedInUser);
        userPhone = userData.phone; // 抓出這名會員的手機號碼 (例如: 0912345678)
    }

    // 把箱子名稱變成專屬的（例如：my_orders_0912345678）
    let orderKey = 'my_orders_' + userPhone;

    // 把 'my_orders' 改成變數 orderKey
    let savedOrders = localStorage.getItem(orderKey);
    let ordersArray = savedOrders ? JSON.parse(savedOrders) : [];

    ordersArray.push(newOrder);
    localStorage.setItem(orderKey, JSON.stringify(ordersArray)); // 鎖進個人專屬箱子

    //  跳出成功訊息並跳轉網頁
    alert("已完成結帳！系統已幫您記錄至會員中心。");
    window.location.href = "membership.html";
}