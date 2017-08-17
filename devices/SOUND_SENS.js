/**
 * Created by zhuqizhong on 17-5-15.
 */

const ModbusBase = require('yeedriver-modbustcpconv').ModbusBase;
const async = require('async-q');
const _ = require('lodash');
class SoundSens extends ModbusBase {
    constructor(devId,mbClient) {
        super(devId,mbClient);
    }

    WriteWQ(mapItem, value) {
        this.mbClient.setID(this.devId);
        var reg_quantity = (mapItem.end - mapItem.start + 1);
        var buf = new Array(reg_quantity);
        for (var i = 0; i < reg_quantity; i++) {
            buf[i] = value[mapItem.start + i];
        }

        return this.mbClient.writeRegisters(mapItem.start, buf);
    };
    ReadWQ (mapItem){

        return this.CreateWQReader(mapItem,function(reg,results){
            switch(reg){
                case 1:
                    return this.mbClient.readInputRegisters(0, 1).then(function(newData){
                        results.push( newData.data[0]/10);
                    });
                    break;

                default:
                    results.push ( undefined );
                    break;
            }
        });

};
}
module.exports = SoundSens;