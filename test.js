const DPromise = require('./index');
new DPromise((resolve, reject) => {
    resolve(1);
}).then((ret) => {
    console.log('ret',ret);
    // throw new Error('testError')
    return DPromise.resolve(2);
}).then((ret) => {
    console.log('ret',ret);
}).catch((err) => {
    console.log('err',err);
});

new Promise((resolve, reject) => {
    resolve(1);
}).then((ret) => {
    console.log('ret',ret);
    // throw new Error('testError')
    return Promise.resolve(2);
}).then((ret) => {
    console.log('ret',ret);
}).catch((err) => {
    console.log('err',err);
});


