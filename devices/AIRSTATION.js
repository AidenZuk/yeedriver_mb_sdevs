/**
 * Created by zhuqizhong on 17-5-15.
 */

const ModbusBase = require('./MBBase');
const async = require('async-q');
const _ = require('lodash');
/***
 * 数据打开
 */
class AirStation extends ModbusBase {
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
        this.mbClient.setID(this.devId);
        return this.CreateWQReader(mapItem,function(reg,results){

            switch (reg) {
                case 1:  //电量
                    return this.mbClient.readInputRegisters(0, 1).then(function(newData){
                        results.push( (((newData.data[1]<<16)+newData.data[0])/100.0).toFixed(4));
                    });
                    break;
                    break;
                case 2:  //电压
                    return this.mbClient.readInputRegisters(1, 1).then(function(newData){
                        results.push( {
                            A:(newData[0]/100).toFixed(2),
                            B:(newData[1]/100).toFixed(2),
                            C:(newData[2]/100).toFixed(2),
                        });
                    });
                    break;
                case 3: //电流

                    return this.mbClient.readInputRegisters(2, 1).then(function(newData){
                        results.push( {
                            A:(newData[0]/100).toFixed(2),
                            B:(newData[1]/100).toFixed(2),
                            C:(newData[2]/100).toFixed(2),
                        });
                    });
                    break;
                case 4: //功率

                    return this.mbClient.readInputRegisters(59, 4).then(function(newData){
                        results.push( {
                            A:(newData[0]/100).toFixed(2),
                            B:(newData[1]/100).toFixed(2),
                            C:(newData[2]/100).toFixed(2),
                            T:(newData[3]/100).toFixed(2),
                        });
                    });

                    break;
                case 5://功率因素

                    return this.mbClient.readInputRegisters(71, 4).then(function(newData){
                        results.push( {
                            A:(newData[0]/10000).toFixed(4),
                            B:(newData[1]/10000).toFixed(4),
                            C:(newData[2]/10000).toFixed(4),
                            T:(newData[3]/10000).toFixed(4),
                        });
                    });

                    break;
                default:
                    results.push(undefined);
                    break;
            }
        });
    };
}
module.exports = AirStation;