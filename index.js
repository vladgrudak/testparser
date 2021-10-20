const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const parse = async () => {
    const getHTML = async (url) => {
        const { data } = await axios.get(url)
        return cheerio.load(data)
    }

    const $ = await getHTML('https://www.wildberries.ru/catalog/elektronika/umnyy-dom?sort=popular&page=1')
    // $('.product-card').each((i, el) => {
    //     const brand = $(el).find('.brand-name').text();
    //     console.log(brand)
    // })


    let getPageNumber = () => {
        const pageNumberStr = $('.goods-count').find(':last-child').html();
        let pageNumberArr = pageNumberStr.toString().split(" ");
        return parseInt(pageNumberArr[0].replace('&nbsp;', '')/100)
    }

    for (let i = 1; i <= getPageNumber(); i++) {
        const $ = await getHTML (
            `https://www.wildberries.ru/catalog/elektronika/umnyy-dom?sort=popular&page=${i}`
        )
        $('.product-card').each((k, element) => {
            const brandName = $(element).find('.brand-name').text();
            const productName = $(element).find('.goods-name').text();
            const currentPrice = String($(element).find('.price-commission__current-price').html());
            const clearCurrentPrice = currentPrice.replaceAll('&nbsp;', '');
            const sale = $(element).find('.product-card__sale').text();
            const saleChanged = parseInt(sale) * (-1);
            const link = 'https://wildberries.ru'+$(element).find('.product-card__main').attr('href');
            //console.log(brandName, productName, link, currentPrice)
            //console.log(clearCurrentPrice, sale, saleChanged);
            //fs.appendFileSync('./wbData.txt', `${brandName}${productName}, Цена: ${clearCurrentPrice}, Скидка: ${sale} ${link}\n`)

            if (saleChanged >= 80) {
                fs.appendFileSync('./wbMaxSale.txt',`${brandName}${productName}, Цена: ${clearCurrentPrice}, Скидка: ${sale} ${link}\n`)
            }

        })


    }


}


// .product-card - div со всем содержанием элемента
// .product-card__main - div с ссылкой
// .product-card__sale - div с размером скидки
// .price-commission__current-price - цена со скидкой
// .price-commission__old-price - цена без скидки
// .price-commission__price-free-commission - цена при оплате МИР, СБП
// .product-card__brand-name.brand-name - Имя бренда
// .product-card__brand-name.goods-name - Имя товара
parse();