/**
 * Created by zhuqizhong on 17-5-15.
 */

const ModbusBase = require('yeedriver-modbustcpconv');
const async = require('async-q');
const _ = require('lodash');
class LkIllum extends ModbusBase {
    constructor(devId,mbClient) {
        super(devId,mbClient);
    }

    WriteWQ(mapItem, value) {
        this.mbClient.setID(this.devId);
        let reg_quantity = (mapItem.end - mapItem.start + 1);
        let buf = new Array(reg_quantity);
        for (let i = 0; i < reg_quantity; i++) {
            buf[i] = value[mapItem.start + i];
        }

        return this.mbClient.writeRegisters(mapItem.start, buf);
    };
    ReadWQ (mapItem){

        return this.CreateWQReader(mapItem,function(reg,results){
            switch(reg){
                case 1:
                    return this.mbClient.readInputRegisters(3, 1).then(function(newData){
                        results.push ( newData.data[0]);
                    });
                    break;

                default:
                    results.push (undefined);
                    break;
            }
        });

    };
}
module.exports = LkIllum;