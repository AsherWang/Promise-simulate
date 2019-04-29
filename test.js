const DPromise = require('./index');

new DPromise((resolve) => {
  resolve(1);
})
  .then((ret) => {
    console.log('DPromise', ret);
    return DPromise.resolve(2);
  })
  .then((ret) => {
    console.log('DPromise', ret);
  })
  .then(() => {
    throw new Error('testError');
  })
  .catch((err) => {
    console.log('DPromise', err.message);
    return 3;
  })
  .then((ret) => {
    console.log('DPromise', ret);
  });

// new Promise((resolve, reject) => {
//     resolve(1);
// })
// .then((ret) => {
//     console.log('Promise', ret);
//     return Promise.resolve(2);
// })
// .then((ret) => {
//     console.log('Promise', ret);
// })
// .then(() => {
//     throw new Error('testError')
// })
// .catch((err) => {
//     console.log('Promise',err.message);
//     return 3;
// }).then((ret) => {
//     console.log('Promise', ret);
// });
