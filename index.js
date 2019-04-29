(function () { // eslint-disable-line
  // eslint-disable-next-line
  const root = typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this || {};

  class DPromise {
    constructor(cb) {
      this.taskQueue = [];
      const reject = err => this.handleErr(err, this.doResolve);
      // 这里需要在本promise的链式调用完成之后才执行
      // 即then,catch的回调注册完毕之后
      setTimeout(() => {
        try {
          cb(this.doResolve, reject);
        } catch (err) {
          reject(err);
        }
      }, 0);
    }

    doResolve(data) {
      return this.execute(data);
    }

    then(cb, errCb) {
      this.taskQueue.push({
        type: 'then',
        fn: cb,
      });
      if (errCb) {
        this.taskQueue.push({
          type: 'catch',
          fn: errCb,
        });
      }
      this.hasTask = true; // 曾经有过task
      return this;
    }

    catch(cb) {
      this.taskQueue.push({ type: 'catch', fn: cb });
      this.hasTask = true; // 曾经有过task
      return this;
    }

    execute(data) {
      const task = this.getNextTask('then');
      if (!task) {
        if (!this.hasTask) {
          // warning
          console.log('promise has no then callback to invoke');
        }
        return;
      }
      try {
        this.handleTask(data, task, this.doResolve);
      } catch (err) {
        this.handleErr(err, this.doResolve);
      }
    }

    handleTask(data, task, cb) {
      if (data instanceof DPromise) {
        data.then(ret => cb(task.fn(ret)));
      } else {
        cb(task.fn(data));
      }
    }

    handleErr(err, cb) {
      const task = this.getNextTask('catch');
      if (task) {
        if (cb) {
          cb(task.fn(err));
        } else {
          task.fn(err);
        }
      } else {
        throw err;
      }
    }

    getNextTask(type) {
      let task = this.taskQueue.shift();
      while (task && task.type !== type) {
        task = this.taskQueue.shift();
      }
      return task;
    }
  }

  DPromise.all = (dps) => {
    let count = 0;
    let noErr = true;
    const rets = new Array(dps.length);
    return new DPromise((resolve, reject) => {
      dps.forEach((dp, index) => {
        dp.then((data) => {
          count += 1;
          rets[index] = data;
          if (noErr && count === dps.length) {
            resolve(rets);
          }
        }).catch((err) => {
          noErr = false;
          reject(err);
        });
      });
    });
  };

  DPromise.resolve = data => new DPromise(resolve => resolve(data));

  DPromise.reject = err => new DPromise((resolve, reject) => reject(err));

  if (typeof exports !== 'undefined' && !exports.nodeType) {
    if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
      module.exports = DPromise;
      exports = DPromise;
    }
    exports.DPromise = DPromise;
  } else {
    root.DPromise = DPromise;
  }
}());
