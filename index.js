class DPromise {
    constructor(cb) {
        this.taskQueue = [];
        const resolve = (ret) => this.execute(ret);
        const reject = (err) => this.handleErr(err);
        // 这里需要在本promise的链式调用完成之后才执行
        // 即then,catch的回调注册完毕之后
        setTimeout(()=>{
            try {
                cb(resolve, reject);
            } catch (err) {
                reject(err);
            }
        },0);
    }

    then(cb, errCb) {
        this.taskQueue.push({
            type: 'then',
            fn: cb
        });
        if (errCb) {
            this.taskQueue.push({
                type: 'catch',
                fn: errCb
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
        let dataRet = data;
        let task = this.getNextTask('then');
        if (!task) {
            if (!this.hasTask) {
                // warning
                console.log('promise has no then callback to invoke');
            }
            return;
        }
        try {
            this.handleTask(data, task, (d) => this.execute(d))
        } catch (err) {
            this.handleErr(err);
        }
    }

    handleTask(data, task, cb) {
        if (data instanceof DPromise) {
            data.then((data) => cb(task.fn(data)));
        } else {
            cb(task.fn(data))
        }
    }

    handleErr(err) {
        const task = this.getNextTask('catch');
        if (task) {
            task.fn(err)
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
    const rets = new Array(dps.length);
    return new DPromise((resolve) => {
        dps.forEach((dp, index) => {
            dp.then((data) => {
                count++;
                rets[index] = data;
                if (count === dps.length) {
                    resolve(rets);
                }
            });
        });
    });
}

DPromise.resolve = (data) => new DPromise((resolve) => resolve(data));

DPromise.reject = (err) => new DPromise((resolve, reject) => reject(err));

module.exports = DPromise;
// export default DPromise;