const jsonData = {
    "賽事名稱": "岡山馬拉松",
    "每人最低價": 8150
};

fetch('https://api.schedule.asiayo.com/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'channel': 'CP',
        'user': 'OOO'
    },
    body: JSON.stringify(jsonData)
})
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data);
        if (data.body) {
            const responseBody = JSON.parse(data.body);
            // B. 請提供 JavaScript 程式碼 顯示【errors】的內容。
            // status code 不是 200 的話便印出錯誤
            if (responseBody.status.code !== 200) {
                console.log('Errors:', responseBody.data.errors);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

// C. 請提供 導致 B 回應錯誤的 JSON 資料。
// 因為有些活動並沒有附上最低價格，會導致價格欄位是空字串的狀況
// 而 API Server 有對欄位做 Validation
// 所以也許會需要將空字串改為 0 去當作沒有金額內容的狀況