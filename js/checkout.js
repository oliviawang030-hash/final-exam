function carClick(){
    let name = document.querySelector("#name").value;
    let address = document.querySelector("#address").value;
    let phone = document.querySelector("#phone").value;
    let payment = document.querySelector("#payment").value;

    if(name == "" || address == "" || phone == "" || payment == "請選擇" || payment == ""){
        alert("請填寫完整資料");
        return; 
    }
    
    // 從 LocalStorage 取得剛剛存入的 checkoutItems
    let checkoutItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];
    
    // 計算總金額 (累加所有商品的 單價 * 數量)
    let totalAmount = checkoutItems.reduce((sum, item) => sum + (item.price * item.num), 0);

    let newOrder = {
        orderId: 'LN' + Math.floor(Math.random() * 100000), 
        date: new Date().toLocaleDateString(),             
        receiver: name,                                    
        payment: payment,                                  
        total: totalAmount.toLocaleString() // 使用計算出來的總額，並轉為千分位格式
    };

    let loggedInUser = localStorage.getItem('loggedInUser');
    let userPhone = loggedInUser ? JSON.parse(loggedInUser).phone : "guest";
    let orderKey = 'my_orders_' + userPhone;

    let savedOrders = localStorage.getItem(orderKey);
    let ordersArray = savedOrders ? JSON.parse(savedOrders) : [];

    ordersArray.push(newOrder);
    localStorage.setItem(orderKey, JSON.stringify(ordersArray));

    alert("已完成結帳！系統已幫您記錄至會員中心。");
    window.location.href = "membership.html";
}