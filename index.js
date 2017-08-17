/**
 * Created by zhuqizhong on 17-8-16.
 */
const ModbusBase = require('yeedriver-modbustcpconv');
const MBase = ModbusBase.ModbusBase;
/**
 * Created by zhuqizhong on 16-12-2.
 */


const ModbusRTU = require("qz-modbus-serial");
const util = require('util');

const _ = require('lodash');
const vm = require('vm');
const MAX_WRITE_CNT = 50;
function Modbus(maxSegLength, minGapLength) {
    ModbusBase.call(this, maxSegLength, minGapLength);

}
util.inherits(Modbus, ModbusBase);

Modbus.prototype.initDriver = function (options) {
    ModbusBase.prototype.initDriver(options);

    _.each(options.sids, function (type, devId) {
        let classType = require("./mb_devices/" + type);
        if (this.devices[devId] && _.isFunction(this.devices[devId].release)) {
            this.devices[devId].release();
        }
        this.devices[devId] = new classType(devId, this.mbClient);
    }.bind(this));
    if (options.readConfig) {
        try {
            let script = new vm.Script(" definition = " + options.readConfig);
            let newObj = {};
            script.runInNewContext(newObj);
            this.SetAutoReadConfig(newObj.definition);
        } catch (e) {
            console.error('error in read config:', e.message || e);
        }
    }


};

module.exports = Modbus;

