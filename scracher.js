const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://asiayo.com/zh-tw/package/sport-activities/', { waitUntil: 'networkidle2' });

    await page.waitForSelector('.sc-bTUVah', { timeout: 10000 });

    const htmlContent = await page.content();
    await browser.close();

    const $ = cheerio.load(htmlContent);
    const events = $('.sc-bTUVah'); // 等待活動區塊讀取完畢
    const results = [];
    events.each((index, element) => {
        let name = $(element).find('.sc-JHWBx').text();
        let price = $(element).find('.sc-bRlCZA').text();

        name = name.replace(/[\d\/].*$/, '').trim(); // 只要XXX馬拉松

        // 有些活動沒有寫出最低價錢
        const priceMatch = price.match(/\d+(,\d+)?/); // 抓價錢，例如 5,300
        price = priceMatch ? priceMatch[0].replace(',', '') : ''; // 移除逗號

        console.log(`${name} => ${price}`); // debug

        results.push({ name, price }); // 把活動名稱、最低金額寫入

    });

    let csvContent = '賽事名稱\t每人最低價\n';
    results.forEach(row => {
        csvContent += `${row.name}\t${row.price}\n`;
    });

    fs.writeFileSync('activity.csv', csvContent);
    console.log('產生 activity.csv 檔案');
})();
