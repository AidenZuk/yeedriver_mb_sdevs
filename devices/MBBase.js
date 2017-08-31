/**
 * Created by zhuqizhong on 17-8-31.
 */
const async = require('async-q');
const Q = require('q');
const _ = require('lodash');
class MBBase {
    constructor(devId,mbClient){
        this.devId = devId;
        this.mbClient = mbClient;
    }
    /**
     * 针对每一个mapItem的项，调用一次regReader，具有一个参数( reg)，代表所要读取的寄存器， 返回读取的值即可
     * @param mapItem  数据项
     * @param regReader ( reg)
     * @returns {Promise.<TResult>}
     * @constructor
     */
    CreateWQReader(mapItem, regReader) {


        let regs = [];
        for (let i = mapItem.start; i <= mapItem.end; i++) {
            regs.push(i);
        }

        return async.eachSeries(regs, function (reg) {
            return regReader.call(this, reg);
        }.bind(this)).then(function (results) {
            return results;
        })
    }

    /**
     * 这是一个辅助函数
     * 针对每一个mapItem的项，调用一次regReader，具有两个参数( reg,regValue)， reg是要写入的寄存器号，regValue是要写入的值
     * @param mapItem  数据项
     * @param regReader ( reg,results)
     * @returns {Promise.<TResult>}
     * @constructor
     */
    CreateWQWriter(mapItem, values, regWriter) {

        let regs = [];
        for (let i = mapItem.start; i <= mapItem.end; i++) {
            regs.push(i);
        }
        return async.eachSeries(regs, function (reg) {
            return regWriter.call(this, reg, values[reg]);
        }.bind(this)).then(function (results) {
            return results;
        })
    };
}

module.exports = MBBase;