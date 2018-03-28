/* 
<div class="item">
    <div class="pic">
        <em class="">1</em>
        <a href="https://movie.douban.com/subject/1292052/">
            <img width="100" alt="肖申克的救赎" src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp" class="">
        </a>
    </div>

    <div class="info">
        <div class="hd">
            <a href="https://movie.douban.com/subject/1292052/" class="">
                <span class="title">肖申克的救赎</span>
                <span class="title">&nbsp;/&nbsp;The Shawshank Redemption</span>
                <span class="other">&nbsp;/&nbsp;月黑高飞(港) / 刺激1995(台)</span>
            </a>
            <span class="playable">[可播放]</span>
        </div>

        <div class="bd">
            <p class="">
                导演: 弗兰克·德拉邦特 Frank Darabont&nbsp;&nbsp;&nbsp;主演: 蒂姆·罗宾斯 Tim Robbins /...
                <br> 1994&nbsp;/&nbsp;美国&nbsp;/&nbsp;犯罪 剧情
            </p>

            <div class="star">
                <span class="rating5-t"></span>
                <span class="rating_num" property="v:average">9.6</span>
                <span property="v:best" content="10.0"></span>
                <span>964842人评价</span>
            </div>

            <p class="quote">
                <span class="inq">希望让人自由。</span>
            </p>
        </div>
    </div>
</div>
 */

"use strict"
// npm install request cheerio
const request = require('request');
const cheerio = require('cheerio');

const imageDir = './cover-images/';

function Movie() {
    this.name = '';
    this.score = 0;
    this.quote = '';
    this.ranking = 0;
    this.coverUrl = '';
    this.details = '';
};

const log = function () {
    console.log.apply(console, arguments);
};

const movieFromItsDiv = function (div) {
    const movie = new Movie();
    const qs = cheerio.load(div);

    movie.name = qs('.title').text();
    movie.score = qs('.rating_num').text();
    movie.quote = qs('.inq').text();

    const picDiv = qs('.pic');
    movie.ranking = picDiv.find('em').text();
    movie.coverUrl = picDiv.find('img').attr('src');
    
    const detailDiv = qs('.bd');
    movie.details = detailDiv.children('p').first().text();
    return movie;
};

const saveMovieDataFile = function (movieArray) {
    const fs = require('fs');
    const path = 'data.json';
    const jsonData = JSON.stringify(movieArray, null, 2);
    fs.appendFile(path, jsonData, function (error) {
        if (error !== null) {
            log('an error occured', error);
        } else {
            log('保存成功');
        }
    });
};

const downloadCovers = function (movies) {
    const fs = require('fs');
    movies.forEach(function (movie) {
        const path = imageDir + movie.ranking + '-' + movie.name.replace(/[\/:]/g, ' ') + '.jpg';
        log('cover download: ', path);
        request(movie.coverUrl).pipe(fs.createWriteStream(path));
    });
};

const getMoviesFromUrl = function () {
    let number = 0;
    let url = `https://movie.douban.com/top250?start=${number * 25}&filter=`;
    // 用 const 会 JSON 解析错误 ],[    !!!
    var movieArray = [];

    // 调用 request 从指定 url 下载数据并执行回调函数
    // 回调函数参数：错误信息，响应，相应数据

    const callback = function (error, response, body) {
        // body 即 url 指向的 html
        if (error === null && response.statusCode === 200) {
            // 类似于querySelectorAll
            const qs = cheerio.load(body);
            // movieDivs 是对象，属性有数字 index, length
            const movieDivs = qs('.item');
            // const moviesFromCurrentPage = [];
            for (let i = 0; i < movieDivs.length; i++) {
                var element = movieDivs[i];
                // 获得每个电影的 div 容器的 html
                var div = qs(element).html();
                // 返回一个 movie 实例
                const movieItem = movieFromItsDiv(div);
                movieArray.push(movieItem);

            }
            // log('number of movies of current page:', moviesFromCurrentPage.length);
            // saveMovieDataFile(moviesFromCurrentPage);
            // downloadCovers(moviesFromCurrentPage);
            // log(url, movieArray);
            number += 1;
            if (number < 10) {
                url = `https://movie.douban.com/top250?start=${number * 25}&filter=`;
                log('current url: ', url);
                request(url, callback);
            } else if (number === 10) {
                saveMovieDataFile(movieArray);
                downloadCovers(movieArray);
            }
        } else {
            log('请求失败', error);
        }
    }

    request(url, callback);
};

const __main = function () {
    getMoviesFromUrl();
};

__main();

// node crawlDbTop250Movie.js