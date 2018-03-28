(function () {
    var express = require('express');
    var app = express();
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(express.static('static'));

    const fs = require('fs');
    const path = 'data.json';
    const years = [];
    const yr = {};
    const ctr = {};
    const countryArray = [];

    function retrieveCountry(data) {
        var c = data.split('/');
        var arr = c[c.length - 2].split(' ');
        arr.forEach(function (country) {
            var c = country.trim();
            if (ctr.hasOwnProperty(c)) {
                ctr[c]++;
            } else {
                ctr[c] = 1;
            }
        });
    }

    function retrieveYear(data) {
        var c = data.split('/');
        // console.log('data \n', c);
        var part = c[c.length - 3];
        // console.log(part + '****' + part.length);
        var year = part.slice(-5);
        // 多次上映的一部电影特殊处理
        if (year.indexOf('国') != -1) {
            year = '1961';
        }
        year = Number(year);
        years.push(year);
        // console.log('year: ', year);
    }

    function processData(data) {
        data.forEach(function (item) {
            // console.log('details\n', item.details);
            var info = item.details;
            retrieveYear(info);
            retrieveCountry(info);
        });
        // console.log(ctr);
    }

    function byProperty(propertyName) {
        return function (obj1, obj2) {
            var a, b;
            if (obj1 && obj2 && typeof obj1 === "object" && typeof obj2 === "object") {
                a = obj1[propertyName];
                b = obj2[propertyName];
                if (a === b) {
                    return 0;
                }
                if (typeof a === typeof b) {
                    return a > b ? -1 : 1;
                }
                return typeof a > typeof b ? -1 : 1;
            } else {
                throw {
                    name: "Error",
                    message: "Expected an object when sorting by  " + propertyName
                };
            }
        };
    };

    function formatData(ctr, years) {
        for (key in ctr) {
            var o = {};
            o.country = key;
            o.times = ctr[key];
            countryArray.push(o);
        }
        countryArray.sort(byProperty('times'));
        // console.log('country array\n', countryArray);

        // console.log(Math.min(...years)); // 1931 - 2017
        years.sort();
        // console.log('years: \n', years);

        years.forEach(function (year) {
            var pre = Math.floor(year / 10);
            var sy = pre + '0';
            var ey = pre + '9';
            var range = `${sy}-${ey}`;
            if (yr.hasOwnProperty(range)) {
                yr[range]++;
            } else {
                yr[range] = 1;
            }
        });
        // console.log(yr);
    }



    fs.readFile(path, 'utf8', function (err, data) {
        if (err != null) {
            console.log('error');
        } else {
            data = JSON.parse(data);
            // console.log('data type', Array.isArray(data));
            processData(data);
            formatData(ctr, years);
            // console.log('country array\n', countryArray);
            // console.log(yr);
        }
    });

    app.get('/', function(request, response) {
        var path = 'index.html';
        var options = {
            encoding: 'utf-8'
        };
        fs.readFile(path, options, function(err, data) {
            response.send(data);
        })
    });

    app.get('/get', function(request, response) {
        response.send([countryArray, yr]);
    });

    var server = app.listen(8082, function () {
        var host = server.address().address;
        var port = server.address().port;
    
        console.log(`应用实例访问的地址为 http://${host}:${port}`);
    });
})();

/* (function() {
    const arr = [];
    let i = 0;
    while(i++ < 4) {
        arr.push(i);
        console.log('arr in process: ', arr);
    }
    console.log('final arr: ', arr);
    
})(); */