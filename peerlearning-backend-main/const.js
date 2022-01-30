module.exports.backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(201, 203, 207, 0.2)'
];
module.exports.borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgb(201, 203, 207)'
];

// module.exports = backgroundColor;
// module.exports = borderColor;


const { MongoClient } = require('mongodb');
const url = "mongodb+srv://admin:eNNsgz1lK2bVMQUf@cluster0.xu7bg.mongodb.net/peerlearning?retryWrites=true&w=majority";
const ops = { useUnifiedTopology: true, useNewUrlParser: true };


var client;

module.exports.connect = function() {

    client = MongoClient.connect(url, ops);
    return client;
}

module.exports.hostname = '127.0.0.1';
module.exports.port = 8000;

module.exports.sum = function(arr) {
    let result = 0;
    for (let i = 0; i < arr.length; i++) {
        result += arr[i];
    }

    return result;
}

module.exports.average = function(arr) {
    let result = 0;

    for (let i = 0; i < arr.length; i++) {
        result += arr[i];
    }

    return result / arr.length;
}