/**
 * This is a microbit-based theme expansion board.
 */
const OBLOQ_MQTT_EASY_IOT_SERVER_CHINA = "iot.dfrobot.com.cn"
const OBLOQ_MQTT_EASY_IOT_SERVER_GLOBAL = "mqtt.beebotte.com"
const OBLOQ_MQTT_EASY_IOT_SERVER_EN = "iot.dfrobot.com"
const microIoT_WEBHOOKS_URL = "maker.ifttt.com"
const OBLOQ_MQTT_EASY_IOT_SERVER_TK = "api.thingspeak.com"
const microIoT_Weather_URL = "api.dfrobot.top"

//% color="#AA278D" height=100 icon="\uf185" block="NaturalScience"
namespace NaturalScience {
    /**
    * TCS34725: Color recognition sensor related register variable definition
    */
    let TCS34725_ADDRESS = 0x29;
    let REG_TCS34725_ID = 0x12;
    let REG_TCS34725_COMMAND_BIT = 0x80;
    let REG_TCS34725_ENABLE = 0X00;
    let REG_TCS34725_ATIME = 0X01
    let REG_TCS34725_GAIN = 0x0F
    let REG_CLEAR_CHANNEL_L = 0X14;
    let REG_RED_CHANNEL_L = 0X16;
    let REG_GREEN_CHANNEL_L = 0X18;
    let REG_BLUE_CHANNEL_L = 0X1A;

    let TCS34275_POWER_ON = 0X01
    let TCS34725_ENABLE_AEN = 0X02
    let TCS34725_RGBC_C = 0;
    let TCS34725_RGBC_R = 0;
    let TCS34725_RGBC_G = 0;
    let TCS34725_RGBC_B = 0;
    let TCS34725_BEGIN = 0;
    let TCS34725_ENABLE_AIEN = 0X10;


    function getInt8LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int8LE);
    }

    function getUInt16LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt16LE);
    }

    function getInt16LE(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int16LE);
    }

    /**
     * TCS34725 Color Sensor Init
     */
    function tcs34725_begin(): boolean {
        TCS34725_BEGIN = 0;
        let id = readReg(TCS34725_ADDRESS, REG_TCS34725_ID | REG_TCS34725_COMMAND_BIT);
        if ((id != 0x44) && (id != 0x10)) return false;
        TCS34725_BEGIN = 1;
        writeReg(TCS34725_ADDRESS, REG_TCS34725_ATIME | REG_TCS34725_COMMAND_BIT, 0xEB);
        writeReg(TCS34725_ADDRESS, REG_TCS34725_GAIN | REG_TCS34725_COMMAND_BIT, 0x01);
        writeReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE | REG_TCS34725_COMMAND_BIT, 0x01);
        basic.pause(3);
        writeReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE | REG_TCS34725_COMMAND_BIT, 0x01 | 0x02);
        return true;
    }

    function getRGBC() {
        if (!TCS34725_BEGIN) tcs34725_begin();

        TCS34725_RGBC_C = getUInt16LE(TCS34725_ADDRESS, REG_CLEAR_CHANNEL_L | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_R = getUInt16LE(TCS34725_ADDRESS, REG_RED_CHANNEL_L | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_G = getUInt16LE(TCS34725_ADDRESS, REG_GREEN_CHANNEL_L | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_B = getUInt16LE(TCS34725_ADDRESS, REG_BLUE_CHANNEL_L | REG_TCS34725_COMMAND_BIT);

        basic.pause(50);
        let ret = readReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE | REG_TCS34725_COMMAND_BIT)
        ret |= TCS34725_ENABLE_AIEN;
        writeReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE | REG_TCS34725_COMMAND_BIT, ret)
    }

    /**
     * Get the red component of the TCS34725 color sensor
     */
    //% block="get red"
    //% weight=60 
    export function getRed(): number {
        getRGBC();
        let red = (Math.round(TCS34725_RGBC_R) / Math.round(TCS34725_RGBC_C)) * 255;
        return Math.round(red);
    }

    /**
     * Get the green component of the TCS34725 color sensor
     */
    //% block="get green"
    //% weight=60 
    export function getGreen(): number {
        getRGBC();
        let green = (Math.round(TCS34725_RGBC_G) / Math.round(TCS34725_RGBC_C)) * 255;
        return Math.round(green);
    }

    /**
     * Get the blue component of the TCS34725 color sensor
     */
    //% block="get blue"
    //% weight=60 
    export function getBlue(): number {
        getRGBC();
        let blue = (Math.round(TCS34725_RGBC_B) / Math.round(TCS34725_RGBC_C)) * 255;
        return Math.round(blue)
    }

    /**
     *  Get the natural light value of the TCS34725 color sensor
     */
    //% block="get light"
    //% weight=60 
    export function getC(): number {
        getRGBC();
        return Math.round(TCS34725_RGBC_C);
    }

    /**
     * STM32  function
     */

    let STM32_ADDRESS = 0X1F;
    let STM32_PID = 0X01;
    let REG_STM32_VID = 0X02;
    let REG_SEM32_LED_CONTROL = 0X03;
    let REG_STM32_K_INTEGER = 0X04;
    let REG_SEM32_K_DECIMAL = 0X05;
    let REG_STM32_TDS_H = 0X06;
    let REG_SEM32_TDS_L = 0X07;
    let REG_SEM32_NOISE_H = 0X08;
    let REG_STM32_NOISE_L = 0X09;
    let REG_STM32_UV_H = 0X0A;
    let REG_SEM32_UV_L = 0X0B;

    export enum STM32_LED_STATUS {
        ON = 0X01,
        OFF = 0X00
    }

    function readReg(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
    }

    function writeReg(addr: number, reg: number, dat: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(addr, buf)
    }
    /**
     * LED switch
     */
    //% block="set Led %parms"
    //% weight=69
    export function setLed(parms: STM32_LED_STATUS) {
        writeReg(STM32_ADDRESS, REG_SEM32_LED_CONTROL, parms)
    }

    /**
     * Obtain the UV intensity of the UV sensor (mW/cm2)
     */
    //% block="get UV"
    //% weight=69
    export function getUV(): string {
        let ret1 = readReg(STM32_ADDRESS, REG_STM32_UV_H);
        let ret2 = readReg(STM32_ADDRESS, REG_SEM32_UV_L);
        let ret3 = ((ret1 << 8) | ret2);
        let ret4 = ret3 / 100
        let ret5 = ret3 % 100;
        let str = ".";
        if (ret5 < 10) {
            str += "0"
        }
        str = parseInt(ret4.toString()) + str + ret5;
        return str;
    }

    /**
     * Get the K value of the TDS sensor
     */
    //% block="get TDS K Value"
    //% weight=70
    export function getK(): string {
        let ret1 = readReg(STM32_ADDRESS, REG_STM32_K_INTEGER);
        let ret2 = readReg(STM32_ADDRESS, REG_SEM32_K_DECIMAL);
        let str = ".";
        if (ret2 < 10) {
            str = str + '0';
        }
        str = ret1 + str + ret2;

        return str;
    }

    /**
     * Set the K value of the TDS sensor
     */
    //% block="set TDS K %value"
    //% weight=70 value.defl=2.68
    export function setK(value: number) {

        let ret1 = parseInt(value.toString());
        writeReg(STM32_ADDRESS, REG_STM32_K_INTEGER, ret1);
        let ret2 = (value * 100 - ret1 * 100);
        writeReg(STM32_ADDRESS, REG_SEM32_K_DECIMAL, ret2);
    }

    /**
     * Get the TDS value of the TDS sensor
     */
    //% block="get TDS"
    //% weight=70
    export function getTDS(): number {
        let ret1 = readReg(STM32_ADDRESS, REG_STM32_TDS_H);
        let ret2 = readReg(STM32_ADDRESS, REG_SEM32_TDS_L);
        let ret3 = (ret1 << 8) | ret2;
        if (ret3 > 2000) {
            ret3 = 0
        }
        return ret3;
    }

    /**
     * Get sound intensity
     */
    //% block="get noise"
    //% weight=70
    export function getNoise(): number {
        let ret1 = readReg(STM32_ADDRESS, REG_SEM32_NOISE_H);
        let ret2 = readReg(STM32_ADDRESS, REG_STM32_NOISE_L);
        let x = Math.round((((ret1 << 8) | ret2) / 4096) * 1024);
        return x;
    }


    /**
     * BME280 Sensor
     */
    let BME280_I2C_ADDR = 0x76;

    let dig_T1 = getUInt16LE(BME280_I2C_ADDR, 0x88)
    let dig_T2 = getInt16LE(BME280_I2C_ADDR, 0x8A)
    let dig_T3 = getInt16LE(BME280_I2C_ADDR, 0x8C)
    let dig_P1 = getUInt16LE(BME280_I2C_ADDR, 0x8E)
    let dig_P2 = getInt16LE(BME280_I2C_ADDR, 0x90)
    let dig_P3 = getInt16LE(BME280_I2C_ADDR, 0x92)
    let dig_P4 = getInt16LE(BME280_I2C_ADDR, 0x94)
    let dig_P5 = getInt16LE(BME280_I2C_ADDR, 0x96)
    let dig_P6 = getInt16LE(BME280_I2C_ADDR, 0x98)
    let dig_P7 = getInt16LE(BME280_I2C_ADDR, 0x9A)
    let dig_P8 = getInt16LE(BME280_I2C_ADDR, 0x9C)
    let dig_P9 = getInt16LE(BME280_I2C_ADDR, 0x9E)
    let dig_H1 = readReg(BME280_I2C_ADDR, 0xA1)
    let dig_H2 = getInt16LE(BME280_I2C_ADDR, 0xE1)
    let dig_H3 = readReg(BME280_I2C_ADDR, 0xE3)
    let a = readReg(BME280_I2C_ADDR, 0xE5)
    let dig_H4 = (readReg(BME280_I2C_ADDR, 0xE4) << 4) + (a % 16)
    let dig_H5 = (readReg(BME280_I2C_ADDR, 0xE6) << 4) + (a >> 4)
    let dig_H6 = getInt8LE(BME280_I2C_ADDR, 0xE7)
    writeReg(BME280_I2C_ADDR, 0xF2, 0x04)
    writeReg(BME280_I2C_ADDR, 0xF4, 0x2F)
    writeReg(BME280_I2C_ADDR, 0xF5, 0x0C)
    let T = 0
    let P = 0
    let H = 0
    let POWER_ON = 0

    function get(): void {
        let adc_T = (readReg(BME280_I2C_ADDR, 0xFA) << 12) + (readReg(BME280_I2C_ADDR, 0xFB) << 4) + (readReg(BME280_I2C_ADDR, 0xFC) >> 4)
        let var1 = (((adc_T >> 3) - (dig_T1 << 1)) * dig_T2) >> 11
        let var2 = (((((adc_T >> 4) - dig_T1) * ((adc_T >> 4) - dig_T1)) >> 12) * dig_T3) >> 14
        let t = var1 + var2
        T = ((t * 5 + 128) >> 8);
        var1 = (t >> 1) - 64000
        var2 = (((var1 >> 2) * (var1 >> 2)) >> 11) * dig_P6
        var2 = var2 + ((var1 * dig_P5) << 1)
        var2 = (var2 >> 2) + (dig_P4 << 16)
        var1 = (((dig_P3 * ((var1 >> 2) * (var1 >> 2)) >> 13) >> 3) + (((dig_P2) * var1) >> 1)) >> 18
        var1 = ((32768 + var1) * dig_P1) >> 15
        if (var1 == 0)
            return; // avoid exception caused by division by zero
        let adc_P = (readReg(BME280_I2C_ADDR, 0xF7) << 12) + (readReg(BME280_I2C_ADDR, 0xF8) << 4) + (readReg(BME280_I2C_ADDR, 0xF9) >> 4)
        let _p = ((1048576 - adc_P) - (var2 >> 12)) * 3125
        _p = (_p / var1) * 2;
        var1 = (dig_P9 * (((_p >> 3) * (_p >> 3)) >> 13)) >> 12
        var2 = (((_p >> 2)) * dig_P8) >> 13
        P = _p + ((var1 + var2 + dig_P7) >> 4)
        let adc_H = (readReg(BME280_I2C_ADDR, 0xFD) << 8) + readReg(BME280_I2C_ADDR, 0xFE)
        var1 = t - 76800
        var2 = (((adc_H << 14) - (dig_H4 << 20) - (dig_H5 * var1)) + 16384) >> 15
        var1 = var2 * (((((((var1 * dig_H6) >> 10) * (((var1 * dig_H3) >> 11) + 32768)) >> 10) + 2097152) * dig_H2 + 8192) >> 14)
        var2 = var1 - (((((var1 >> 15) * (var1 >> 15)) >> 7) * dig_H1) >> 4)
        if (var2 < 0) var2 = 0
        if (var2 > 419430400) var2 = 419430400
        H = (var2 >> 12);
    }

    function powerOn() {
        writeReg(BME280_I2C_ADDR, 0xF4, 0x2F)
        POWER_ON = 1
    }

    export enum BME280Data {
        //% block="Pressure"
        Pressure,
        //% block="Temperature"
        Temperature,
        //% block="Humidity"
        Humidity
    }
    /**
     * Init display
     */
    //% weight=200
    //% block="init display"

    export function initDisplay(): void {
        cmd(0xAE);  // Set display OFF
        cmd(0xD5);  // Set Display Clock Divide Ratio / OSC Frequency 0xD4
        cmd(0x80);  // Display Clock Divide Ratio / OSC Frequency 
        cmd(0xA8);  // Set Multiplex Ratio
        cmd(0x3F);  // Multiplex Ratio for 128x64 (64-1)
        cmd(0xD3);  // Set Display Offset
        cmd(0x00);  // Display Offset
        cmd(0x40);  // Set Display Start Line
        cmd(0x8D);  // Set Charge Pump
        cmd(0x14);  // Charge Pump (0x10 External, 0x14 Internal DC/DC)
        cmd(0xA1);  // Set Segment Re-Map
        cmd(0xC8);  // Set Com Output Scan Direction
        cmd(0xDA);  // Set COM Hardware Configuration
        cmd(0x12);  // COM Hardware Configuration
        cmd(0x81);  // Set Contrast
        cmd(0xCF);  // Contrast
        cmd(0xD9);  // Set Pre-Charge Period
        cmd(0xF1);  // Set Pre-Charge Period (0x22 External, 0xF1 Internal)
        cmd(0xDB);  // Set VCOMH Deselect Level
        cmd(0x40);  // VCOMH Deselect Level
        cmd(0xA4);  // Set all pixels OFF
        cmd(0xA6);  // Set display not inverted
        cmd(0xAF);  // Set display On
        clear();
    }
    /**
     * Clear display
     */
    //% weight=85
    //% blockId=OLED_Clear
    //% block="clear display"
    export function clear() {
        //cmd(DISPLAY_OFF);   //display off
        for (let j = 0; j < 8; j++) {
            setText(j, 0);
            {
                for (let i = 0; i < 16; i++)  //clear all columns
                {
                    putChar(' ');
                }
            }
        }
        //cmd(DISPLAY_ON);    //display on
        setText(0, 0);
    }


    function setText(row: number, column: number) {
        let r = row;
        let c = column;
        if (row < 0) { r = 0 }
        if (column < 0) { c = 0 }
        if (row > 7) { r = 7 }
        if (column > 15) { c = 15 }

        cmd(0xB0 + r);            //set page address
        cmd(0x00 + (8 * c & 0x0F));  //set column lower address
        cmd(0x10 + ((8 * c >> 4) & 0x0F));   //set column higher address
    }


    function putChar(c: string) {
        let c1 = c.charCodeAt(0);
        writeCustomChar(basicFont[c1 - 32]);
    }
    /**
     * OLED 12864 shows the string
     */
    //% weight=90
    //% blockId=OLED_String
    //% text.defl="DFRobot"
    //% line.min=0 line.max=7
    //% block="OLED show line %line|text %text"
    export function showUserText(line: number, text: string) {

        setText(line, 0);
        for (let c of text) {
            putChar(c);
        }

        for (let i = text.length; i < 16; i++) {
            setText(line, i);
            putChar(" ");
        }
    }
	/**
     * OLED 12864 shows the number
     * @param line line num (8 pixels per line), eg: 0
     * @param n value , eg: 2019
     */
    //% weight=90
    //% blockId=OLED_number
    //% line.min=0 line.max=7
    //% block="OLED show line %line|number %n"
    export function showUserNumber(line: number, n: number) {

        NaturalScience.showUserText(line, "" + n)
    }


    function writeCustomChar(c: string) {
        for (let i = 0; i < 8; i++) {
            writeData(c.charCodeAt(i));
        }
    }


    function cmd(c: number) {
        pins.i2cWriteNumber(0x3c, c, NumberFormat.UInt16BE);
    }


    function writeData(n: number) {
        let b = n;
        if (n < 0) { n = 0 }
        if (n > 255) { n = 255 }

        pins.i2cWriteNumber(0x3c, 0x4000 + b, NumberFormat.UInt16BE);
    }
    const DISPLAY_OFF = 0xAE;
    const DISPLAY_ON = 0xAF;
    const basicFont: string[] = [
        "\x00\x00\x00\x00\x00\x00\x00\x00", // " "
        "\x00\x00\x5F\x00\x00\x00\x00\x00", // "!"
        "\x00\x00\x07\x00\x07\x00\x00\x00", // """
        "\x00\x14\x7F\x14\x7F\x14\x00\x00", // "#"
        "\x00\x24\x2A\x7F\x2A\x12\x00\x00", // "$"
        "\x00\x23\x13\x08\x64\x62\x00\x00", // "%"
        "\x00\x36\x49\x55\x22\x50\x00\x00", // "&"
        "\x00\x00\x05\x03\x00\x00\x00\x00", // "'"
        "\x00\x1C\x22\x41\x00\x00\x00\x00", // "("
        "\x00\x41\x22\x1C\x00\x00\x00\x00", // ")"
        "\x00\x08\x2A\x1C\x2A\x08\x00\x00", // "*"
        "\x00\x08\x08\x3E\x08\x08\x00\x00", // "+"
        "\x00\xA0\x60\x00\x00\x00\x00\x00", // ","
        "\x00\x08\x08\x08\x08\x08\x00\x00", // "-"
        "\x00\x60\x60\x00\x00\x00\x00\x00", // "."
        "\x00\x20\x10\x08\x04\x02\x00\x00", // "/"
        "\x00\x3E\x51\x49\x45\x3E\x00\x00", // "0"
        "\x00\x00\x42\x7F\x40\x00\x00\x00", // "1"
        "\x00\x62\x51\x49\x49\x46\x00\x00", // "2"
        "\x00\x22\x41\x49\x49\x36\x00\x00", // "3"
        "\x00\x18\x14\x12\x7F\x10\x00\x00", // "4"
        "\x00\x27\x45\x45\x45\x39\x00\x00", // "5"
        "\x00\x3C\x4A\x49\x49\x30\x00\x00", // "6"
        "\x00\x01\x71\x09\x05\x03\x00\x00", // "7"
        "\x00\x36\x49\x49\x49\x36\x00\x00", // "8"
        "\x00\x06\x49\x49\x29\x1E\x00\x00", // "9"
        "\x00\x00\x36\x36\x00\x00\x00\x00", // ":"
        "\x00\x00\xAC\x6C\x00\x00\x00\x00", // ";"
        "\x00\x08\x14\x22\x41\x00\x00\x00", // "<"
        "\x00\x14\x14\x14\x14\x14\x00\x00", // "="
        "\x00\x41\x22\x14\x08\x00\x00\x00", // ">"
        "\x00\x02\x01\x51\x09\x06\x00\x00", // "?"
        "\x00\x32\x49\x79\x41\x3E\x00\x00", // "@"
        "\x00\x7E\x09\x09\x09\x7E\x00\x00", // "A"
        "\x00\x7F\x49\x49\x49\x36\x00\x00", // "B"
        "\x00\x3E\x41\x41\x41\x22\x00\x00", // "C"
        "\x00\x7F\x41\x41\x22\x1C\x00\x00", // "D"
        "\x00\x7F\x49\x49\x49\x41\x00\x00", // "E"
        "\x00\x7F\x09\x09\x09\x01\x00\x00", // "F"
        "\x00\x3E\x41\x41\x51\x72\x00\x00", // "G"
        "\x00\x7F\x08\x08\x08\x7F\x00\x00", // "H"
        "\x00\x41\x7F\x41\x00\x00\x00\x00", // "I"
        "\x00\x20\x40\x41\x3F\x01\x00\x00", // "J"
        "\x00\x7F\x08\x14\x22\x41\x00\x00", // "K"
        "\x00\x7F\x40\x40\x40\x40\x00\x00", // "L"
        "\x00\x7F\x02\x0C\x02\x7F\x00\x00", // "M"
        "\x00\x7F\x04\x08\x10\x7F\x00\x00", // "N"
        "\x00\x3E\x41\x41\x41\x3E\x00\x00", // "O"
        "\x00\x7F\x09\x09\x09\x06\x00\x00", // "P"
        "\x00\x3E\x41\x51\x21\x5E\x00\x00", // "Q"
        "\x00\x7F\x09\x19\x29\x46\x00\x00", // "R"
        "\x00\x26\x49\x49\x49\x32\x00\x00", // "S"
        "\x00\x01\x01\x7F\x01\x01\x00\x00", // "T"
        "\x00\x3F\x40\x40\x40\x3F\x00\x00", // "U"
        "\x00\x1F\x20\x40\x20\x1F\x00\x00", // "V"
        "\x00\x3F\x40\x38\x40\x3F\x00\x00", // "W"
        "\x00\x63\x14\x08\x14\x63\x00\x00", // "X"
        "\x00\x03\x04\x78\x04\x03\x00\x00", // "Y"
        "\x00\x61\x51\x49\x45\x43\x00\x00", // "Z"
        "\x00\x7F\x41\x41\x00\x00\x00\x00", // """
        "\x00\x02\x04\x08\x10\x20\x00\x00", // "\"
        "\x00\x41\x41\x7F\x00\x00\x00\x00", // """
        "\x00\x04\x02\x01\x02\x04\x00\x00", // "^"
        "\x00\x80\x80\x80\x80\x80\x00\x00", // "_"
        "\x00\x01\x02\x04\x00\x00\x00\x00", // "`"
        "\x00\x20\x54\x54\x54\x78\x00\x00", // "a"
        "\x00\x7F\x48\x44\x44\x38\x00\x00", // "b"
        "\x00\x38\x44\x44\x28\x00\x00\x00", // "c"
        "\x00\x38\x44\x44\x48\x7F\x00\x00", // "d"
        "\x00\x38\x54\x54\x54\x18\x00\x00", // "e"
        "\x00\x08\x7E\x09\x02\x00\x00\x00", // "f"
        "\x00\x18\xA4\xA4\xA4\x7C\x00\x00", // "g"
        "\x00\x7F\x08\x04\x04\x78\x00\x00", // "h"
        "\x00\x00\x7D\x00\x00\x00\x00\x00", // "i"
        "\x00\x80\x84\x7D\x00\x00\x00\x00", // "j"
        "\x00\x7F\x10\x28\x44\x00\x00\x00", // "k"
        "\x00\x41\x7F\x40\x00\x00\x00\x00", // "l"
        "\x00\x7C\x04\x18\x04\x78\x00\x00", // "m"
        "\x00\x7C\x08\x04\x7C\x00\x00\x00", // "n"
        "\x00\x38\x44\x44\x38\x00\x00\x00", // "o"
        "\x00\xFC\x24\x24\x18\x00\x00\x00", // "p"
        "\x00\x18\x24\x24\xFC\x00\x00\x00", // "q"
        "\x00\x00\x7C\x08\x04\x00\x00\x00", // "r"
        "\x00\x48\x54\x54\x24\x00\x00\x00", // "s"
        "\x00\x04\x7F\x44\x00\x00\x00\x00", // "t"
        "\x00\x3C\x40\x40\x7C\x00\x00\x00", // "u"
        "\x00\x1C\x20\x40\x20\x1C\x00\x00", // "v"
        "\x00\x3C\x40\x30\x40\x3C\x00\x00", // "w"
        "\x00\x44\x28\x10\x28\x44\x00\x00", // "x"
        "\x00\x1C\xA0\xA0\x7C\x00\x00\x00", // "y"
        "\x00\x44\x64\x54\x4C\x44\x00\x00", // "z"
        "\x00\x08\x36\x41\x00\x00\x00\x00", // "{"
        "\x00\x00\x7F\x00\x00\x00\x00\x00", // "|"
        "\x00\x41\x36\x08\x00\x00\x00\x00", // "}"
        "\x00\x02\x01\x01\x02\x01\x00\x00"  // "~"
    ];

    /**
     *  Get the pressure, temperature, and humidity of the BME280 sensor
     */
    //% block="get %data"
    //% weight=80
    export function readBME280Data(data: BME280Data): string {
        if (POWER_ON != 1) {
            powerOn()
        }
        get();
        let s = ".";
        let x;
        switch (data) {
            case 0: let ret1 = P / 1000;
                let ret2 = P % 1000;
                s = parseInt(ret1.toString()) + s + parseInt(ret2.toString());
                x = s.slice(0, 5)
                return x;
            case 1: let t1 = (T + 0) / 100 + 0;
                let t2 = (T + 0) % 100;
                s = parseInt(t1.toString()) + s + parseInt(t2.toString());
                x = s.slice(0, 5)
                return x;
            case 2: let h1 = H / 1024;
                let h2 = H % 1024;
                s = parseInt(h1.toString()) + s + parseInt(h2.toString());
                x = s.slice(0, 5)
                return x;
            default: return "0";
        }
    }


    //% shim=DS18B20::Temperature
    export function Temperature(p: number): number {
        // Fake function for simulator
        return 0
    }

    /**
     * Get the temperature of the water
     */
    //% weight=80 blockId="get temp" 
    //% block="get tempN"
    export function TemperatureNumber(): number {
        // Fake function for simulator
        let x;
        let temp = Temperature(13);
        if (temp > 12500) {
            //temp = Temperature(13);
            //basic.pause(1);
            x = 0;
        } else {
            x = Math.round(temp / 100);
        }
        return x;
    }
    let IIC_ADDRESS = 0x16
    let Topic0CallBack: Action = null;
    let Topic1CallBack: Action = null;
    let Topic2CallBack: Action = null;
    let Topic3CallBack: Action = null;
    let Topic4CallBack: Action = null;
    let MicrobitIoT_Mode = 0x00
    let Wifi_Status = 0x00
    let MQTT = 0x00
    let HTTP = 0x01

    let microIoT_WEBHOOKS_KEY = ""
    let microIoT_WEBHOOKS_EVENT = ""

    let READ_STATUS = 0x00
    let SET_PARA = 0x01
    let RUN_COMMAND = 0x02

    /*set para*/
    let SETWIFI_NAME = 0x01
    let SETWIFI_PASSWORLD = 0x02
    let SETMQTT_SERVER = 0x03
    let SETMQTT_PORT = 0x04
    let SETMQTT_ID = 0x05
    let SETMQTT_PASSWORLD = 0x06
    let SETHTTP_IP = 0x07
    let SETHTTP_PORT = 0x08

    /*run command*/
    let SEND_PING = 0x01
    let CONNECT_WIFI = 0x02
    let RECONNECT_WIFI = 0x03
    let DISCONECT_WIFI = 0x04
    let CONNECT_MQTT = 0x05
    let SUB_TOPIC0 = 0x06
    let SUB_TOPIC1 = 0x07
    let SUB_TOPIC2 = 0x08
    let SUB_TOPIC3 = 0x09
    let SUB_TOPIC4 = 0x0A
    let PUB_TOPIC0 = 0x0B
    let PUB_TOPIC1 = 0x0C
    let PUB_TOPIC2 = 0x0D
    let PUB_TOPIC3 = 0x0E
    let PUB_TOPIC4 = 0x0F
    let GET_URL = 0x10
    let POST_URL = 0x11
    let PUT_URL = 0x12
    let GET_VERSION = 0x13


    /*read para value*/
    let READ_PING = 0x01
    let READ_WIFISTATUS = 0x02
    let READ_IP = 0x03
    let READ_MQTTSTATUS = 0x04
    let READ_SUBSTATUS = 0x05
    let READ_TOPICDATA = 0x06
    let HTTP_REQUEST = 0x10
    let READ_VERSION = 0x12

    /*para status */
    let PING_OK = 0x01
    let WIFI_DISCONNECT = 0x00
    let WIFI_CONNECTING = 0x02
    let WIFI_CONNECTED = 0x03
    let MQTT_CONNECTED = 0x01
    let MQTT_CONNECTERR = 0x02
    let SUB_TOPIC_OK = 0x01
    let SUB_TOPIC_Ceiling = 0x02


    let microIoTStatus = ""
    let WIFI_NAME = ""
    let WIFI_PASSWORLD = ""
    let MQTT_SERVER = ""
    let MQTT_PORT = ""
    let MQTT_ID = ""
    let MQTT_PASSWORLD = ""
    let Topic_0 = ""
    let Topic_1 = ""
    let Topic_2 = ""
    let Topic_3 = ""
    let Topic_4 = ""
    let RECDATA = ""
    let HTTP_IP = ""
    let HTTP_PORT = ""
    let microIoT_IP = "0.0.0.0"
    let G_city = 0;


    export enum SERVERS {
        //% blockId=SERVERS_China block="EasyIOT_CN"
        China,
        //% blockId=SERVERS_English block="EasyIOT_EN"
        English,
        //% blockId=SERVERS_Global block="Beebotte"
        Global
    }

    export enum TOPIC {
        topic_0 = 0,
        topic_1 = 1,
        topic_2 = 2,
        topic_3 = 3,
        topic_4 = 4
    }

    export class PacketMqtt {
        public message: string;
    }

    function microIoT_setPara(cmd: number, para: string): void {
        let buf = pins.createBuffer(para.length + 4);
        buf[0] = 0x1E
        buf[1] = SET_PARA
        buf[2] = cmd
        buf[3] = para.length
        for (let i = 0; i < para.length; i++)
            buf[i + 4] = para[i].charCodeAt(0)
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
    }

    function microIoT_runCommand(cmd: number): void {
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E
        buf[1] = RUN_COMMAND
        buf[2] = cmd
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
    }

    function microIoT_readStatus(para: number): number {
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E
        buf[1] = READ_STATUS
        buf[2] = para
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
        let recbuf = pins.createBuffer(2)
        recbuf = pins.i2cReadBuffer(IIC_ADDRESS, 2, false)
        return recbuf[1]
    }

    function microIoT_readValue(para: number): string {
        let buf = pins.createBuffer(3);
        let paraValue = 0x00
        let tempLen = 0x00
        let dataValue = ""
        buf[0] = 0x1E
        buf[1] = READ_STATUS
        buf[2] = para
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
        microIoT_CheckStatus("READ_IP");
        return RECDATA
    }

    function microIoT_ParaRunCommand(cmd: number, data: string): void {
        let buf = pins.createBuffer(data.length + 4)
        buf[0] = 0x1E
        buf[1] = RUN_COMMAND
        buf[2] = cmd
        buf[3] = data.length
        for (let i = 0; i < data.length; i++)
            buf[i + 4] = data[i].charCodeAt(0)
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);

    }
    function microIoT_CheckStatus(cmd: string): void {
        while (true) {
            if (microIoTStatus == cmd) {
                serial.writeString("OKOK\r\n");
                return;
            }
            basic.pause(50);
        }
    }

    /**
    * WiFi configuration
    * @param SSID to SSID ,eg: "yourSSID"
    * @param PASSWORD to PASSWORD ,eg: "yourPASSWORD"
    */

    //% weight=100
    //% blockId=microIoT_wifi block="Micro:IoT setup |Wi-Fi: |name: %SSID| password：%PASSWORD"
    export function microIoT_WIFI(SSID: string, PASSWORD: string): void {
        microIoT_setPara(SETWIFI_NAME, SSID)
        microIoT_setPara(SETWIFI_PASSWORLD, PASSWORD)
        microIoT_runCommand(CONNECT_WIFI)
        microIoT_CheckStatus("WiFiConnected");
        Wifi_Status = WIFI_CONNECTED
    }

    /**
     * MQTT configuration
     * @param SSID to SSID ,eg: "yourSSID"
     * @param PASSWORD to PASSWORD ,eg: "yourPASSWORD"
     * @param IOT_ID to IOT_ID ,eg: "yourIotId"
     * @param IOT_PWD to IOT_PWD ,eg: "yourIotPwd"
     * @param IOT_TOPIC to IOT_TOPIC ,eg: "yourIotTopic"
    */

    //% weight=100
    //% blockExternalInputs=1
    //% blockId=microIoT_MQTT block="Micro:IoT setup mqtt|Wi-Fi: |name: %SSID| password：%PASSWORD|IOT_ID(user): %IOT_ID| IOT_PWD(password) :%IOT_PWD|(default topic_0) Topic: %IOT_TOPIC| server: %SERVERS"
    export function microIoT_MQTT(SSID: string, PASSWORD: string,
        IOT_ID: string, IOT_PWD: string,
        IOT_TOPIC: string, servers: SERVERS):
        void {
        MicrobitIoT_Mode = MQTT
        microIoT_setPara(SETWIFI_NAME, SSID)
        microIoT_setPara(SETWIFI_PASSWORLD, PASSWORD)
        if (servers == SERVERS.China) {
            microIoT_setPara(SETMQTT_SERVER, OBLOQ_MQTT_EASY_IOT_SERVER_CHINA)
        } else if (servers == SERVERS.English) {
            microIoT_setPara(SETMQTT_SERVER, OBLOQ_MQTT_EASY_IOT_SERVER_EN)
        } else { microIoT_setPara(SETMQTT_SERVER, OBLOQ_MQTT_EASY_IOT_SERVER_GLOBAL) }

        microIoT_setPara(SETMQTT_PORT, "1883")
        microIoT_setPara(SETMQTT_ID, IOT_ID)
        microIoT_setPara(SETMQTT_PASSWORLD, IOT_PWD)
        microIoT_runCommand(CONNECT_WIFI)
        microIoT_CheckStatus("WiFiConnected");

        serial.writeString("wifi conneced ok\r\n");
        Wifi_Status = WIFI_CONNECTED
        microIoT_runCommand(CONNECT_MQTT);
        microIoT_CheckStatus("MQTTConnected");
        serial.writeString("mqtt connected\r\n");

        Topic_0 = IOT_TOPIC
        microIoT_ParaRunCommand(SUB_TOPIC0, IOT_TOPIC);
        microIoT_CheckStatus("SubTopicOK");
        serial.writeString("sub topic ok\r\n");

    }

    /**
     * Add an MQTT subscription
     */

    //% weight=200
    //% blockId=microIoT_add_topic
    //% block="subscribe additional %top |: %IOT_TOPIC"
    //% top.fieldEditor="gridpicker" top.fieldOptions.columns=2
    //% advanced=true
    export function microIoT_add_topic(top: TOPIC, IOT_TOPIC: string): void {
        microIoT_ParaRunCommand((top + 0x06), IOT_TOPIC);
        microIoT_CheckStatus("SubTopicOK");

    }

    /**
     * MQTT sends information to the corresponding subscription
     * @param Mess to Mess ,eg: "mess"
     */

    //% weight=99
    //% blockId=microIoT_SendMessage block="MQTT Send Message %string| to |%TOPIC"
    export function microIoT_SendMessage(Mess: string, Topic: TOPIC): void {
        let topic = 0

        switch (Topic) {
            case TOPIC.topic_0:
                topic = PUB_TOPIC0
                break;
            case TOPIC.topic_1:
                topic = PUB_TOPIC1
                break;
            case TOPIC.topic_2:
                topic = PUB_TOPIC2
                break;
            case TOPIC.topic_3:
                topic = PUB_TOPIC3
                break;
            case TOPIC.topic_4:
                topic = PUB_TOPIC4
                break;
            default:
                break;

        }
        microIoT_ParaRunCommand(topic, Mess)

    }

    function microIoT_callback(top: TOPIC, a: Action): void {
        switch (top) {
            case TOPIC.topic_0:
                Topic0CallBack = a;
                break;
            case TOPIC.topic_1:
                Topic1CallBack = a;
                break;
            case TOPIC.topic_2:
                Topic2CallBack = a;
                break;
            case TOPIC.topic_3:
                Topic3CallBack = a;
                break;
            case TOPIC.topic_4:
                Topic4CallBack = a;
                break;
            default:
                break;
        }
    }

    /**
     * MQTT processes the subscription when receiving message
     */
    //% weight=98
    //% blockGap=60
    //% blockId=obloq_mqtt_callback_user_more block="MQTT on %top |received"
    //% top.fieldEditor="gridpicker" top.fieldOptions.columns=2
    export function microIoT_MQTT_Event(top: TOPIC, cb: (message: string) => void) {
        microIoT_callback(top, () => {
            const packet = new PacketMqtt()
            packet.message = RECDATA
            cb(packet.message)
        });
    }


    /**
    * IFTTT configuration
    * @param EVENT to EVENT ,eg: "yourEvent"
    * @param KEY to KEY ,eg: "yourKey"
    */
    //% weight=80
    //% receive.fieldEditor="gridpicker" receive.fieldOptions.columns=3
    //% send.fieldEditor="gridpicker" send.fieldOptions.columns=3
    //% blockId=microIoT_http_IFTTT
    //% block="Webhooks config:|event: %EVENT|key: %KEY|"
    export function microIoT_http_IFTTT(EVENT: string, KEY: string): void {
        microIoT_WEBHOOKS_EVENT = EVENT
        microIoT_WEBHOOKS_KEY = KEY
    }


    function microIoT_http_wait_request(time: number): string {
        if (time < 100) {
            time = 100
        }
        let timwout = time / 100
        let _timeout = 0
        while (true) {
            basic.pause(100)
            if (microIoTStatus == "HTTP_REQUEST") {
                microIoTStatus = "";
                return RECDATA
            } else if (microIoTStatus == "HTTP_REQUESTFailed") {
                microIoTStatus = "";
                return "requestFailed"
            }
            _timeout += 1
            if (_timeout > timwout) {
                return "timeOut"
            }
        }
    }

    /**
    * ThingSpeak configured and sent data
    * @param KEY to KEY ,eg: "your write api key"
    */

    //% weight=99
    //% blockId=IFTTT_MQTT_Weather_ThingSpeak_Get
    //% block="ThingSpeak(Get) | key %KEY|value1 %field1| value2 %field2| value3 %field3|  value4 %field4| value5 %field5| value6 %field6| value7 %field7| timeout(ms) %time"
    export function microIoT_http_TK_GET(KEY: string, field1: string, field2: string, field3: string, field4: string, field5: string, field6: string, field7: string, time: number): void {
        microIoT_setPara(SETHTTP_IP, OBLOQ_MQTT_EASY_IOT_SERVER_TK)
        let tempStr = ""
        tempStr = "update?api_key=" + KEY + "&field1=" + field1 + "&field2=" + field2 + "&field3=" + field3 + "&field4=" + field4 + "&field5=" + field5 + "&field6=" + field6 + "&field7=" + field7 + "\r"
        microIoT_ParaRunCommand(GET_URL, tempStr);
    }

    /**
     * IFTTT send data
     * time(ms): private long maxWait
     * @param time set timeout, eg: 10000
    */

    //% weight=78
    //% blockId=microIoT_http_post
    //% block="IFTTT(post) | value1 %value1| value2 %value2| value3 %value3| timeout(ms) %time"
    export function microIoT_http_post(value1: string, value2: string, value3: string, time: number): void {
        microIoT_setPara(SETHTTP_IP, microIoT_WEBHOOKS_URL)
        let tempStr = ""
        tempStr = "trigger/" + microIoT_WEBHOOKS_EVENT + "/with/key/" + microIoT_WEBHOOKS_KEY + ",{\"value1\":\"" + value1 + "\",\"value2\":\"" + value2 + "\",\"value3\":\"" + value3 + "\" }" + "\r"
        microIoT_ParaRunCommand(POST_URL, tempStr)
    }



    /**
     * Get IP address.
    */

    //% weight=51
    //% blockId=microIoT_wifi_ipconfig
    //% block="ipconfig"
    //% advanced=true
    export function microIoT_wifi_ipconfig(): string {
        return microIoT_IP;
        //microIoT_readValue(READ_IP)
    }


    /**
     * Send the ping.time(ms): private long maxWait
     * @param time to timeout, eg: 10000
    */

    //% weight=49
    //% blockId=Obloq_send_ping
    //% block="sendPing"
    //% advanced=true
    export function microIoT_send_ping(): boolean {
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E;
        buf[1] = RUN_COMMAND;
        buf[2] = SEND_PING;
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
        microIoT_CheckStatus("PingOK");
        return true;
    }


    /**
     * Get the software version.time(ms): private long maxWait
     * @param time to timeout, eg: 10000
    */

    //% weight=50
    //% blockId=microIoT_get_version
    //% block="get version"
    //% advanced=true
    export function microIoT_get_version(): string {
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E;
        buf[1] = RUN_COMMAND;
        buf[2] = GET_VERSION;
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
        microIoT_CheckStatus("READ_VERSION");
        return RECDATA
    }


    /**
     * Heartbeat request.time(ms): private long maxWait
     * @param time to timeout, eg: 10000
    */
    //% weight=48
    //% blockId=microIoT_get_heartbeat
    //% block="get heartbeat"
    //% advanced=true
    export function microIoT_get_heartbeat(): boolean {
        return true
    }

    /**
     * Stop the heartbeat request.
    */
    //% weight=47
    //% blockId=microIoT_stop_heartbeat
    //% block="stop heartbeat"
    //% advanced=true
    export function microIoT_stop_heartbeat(): boolean {
        return true
    }

    function microIoT_GetData(len: number): void {
        RECDATA = ""
        let tempbuf = pins.createBuffer(1)
        tempbuf[0] = 0x22
        pins.i2cWriteBuffer(IIC_ADDRESS, tempbuf);
        let tempRecbuf = pins.createBuffer(len)
        tempRecbuf = pins.i2cReadBuffer(IIC_ADDRESS, len, false)
        for (let i = 0; i < len; i++) {
            RECDATA += String.fromCharCode(tempRecbuf[i])
        }
    }

    function microIoT_InquireStatus(): void {
        let buf = pins.createBuffer(3)
        let tempId = 0
        let tempStatus = 0
        buf[0] = 0x1E
        buf[1] = READ_STATUS
        buf[2] = 0x06
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
        buf = null
        let recbuf = pins.createBuffer(2)
        recbuf = pins.i2cReadBuffer(IIC_ADDRESS, 2, false)
        tempId = recbuf[0]
        tempStatus = recbuf[1]
        switch (tempId) {
            case READ_PING:
                if (tempStatus == PING_OK) {
                    microIoTStatus = "PingOK"
                } else {
                    microIoTStatus = "PingERR"
                }
                break;
            case READ_WIFISTATUS:
                if (tempStatus == WIFI_CONNECTING) {
                    microIoTStatus = "WiFiConnecting"
                } else if (tempStatus == WIFI_CONNECTED) {
                    microIoTStatus = "WiFiConnected"
                } else if (tempStatus == WIFI_DISCONNECT) {
                    microIoTStatus = "WiFiDisconnect"
                } else {
                }
                break;
            case READ_MQTTSTATUS:
                if (tempStatus == MQTT_CONNECTED) {
                    microIoTStatus = "MQTTConnected"
                } else if (tempStatus == MQTT_CONNECTERR) {
                    microIoTStatus = "MQTTConnectERR"
                }
                break;
            case READ_SUBSTATUS:
                if (tempStatus == SUB_TOPIC_OK) {
                    microIoTStatus = "SubTopicOK"
                } else if (tempStatus == SUB_TOPIC_Ceiling) {
                    microIoTStatus = "SubTopicCeiling"
                } else {
                    microIoTStatus = "SubTopicERR"
                }
                break;
            case READ_IP:
                microIoTStatus = "READ_IP"
                microIoT_GetData(tempStatus)
                microIoT_IP = RECDATA
                break;
            case SUB_TOPIC0:
                microIoTStatus = "READ_TOPICDATA"
                microIoT_GetData(tempStatus)
                if (Topic0CallBack != null) {
                    Topic0CallBack();
                }
                break;
            case SUB_TOPIC1:
                microIoTStatus = "READ_TOPICDATA"
                microIoT_GetData(tempStatus)
                if (Topic1CallBack != null) {
                    Topic1CallBack();
                }
                break;
            case SUB_TOPIC2:
                microIoTStatus = "READ_TOPICDATA"
                microIoT_GetData(tempStatus)
                if (Topic2CallBack != null) {
                    Topic2CallBack();
                }
                break;
            case SUB_TOPIC3:
                microIoTStatus = "READ_TOPICDATA"
                microIoT_GetData(tempStatus)
                if (Topic3CallBack != null) {
                    Topic3CallBack();
                }
                break;
            case SUB_TOPIC4:
                microIoTStatus = "READ_TOPICDATA"
                microIoT_GetData(tempStatus)
                if (Topic4CallBack != null) {
                    Topic4CallBack();
                }
                break;
            // case HTTP_REQUEST:
            //     microIoTStatus = "HTTP_REQUEST"
            //     microIoT_GetData(tempStatus)
            //     break;
            // case READ_VERSION:
            //     microIoTStatus = "READ_VERSION"
            //     microIoT_GetData(tempStatus)
            //     break;
            // default:
            //     break;
        }
        basic.pause(200);
    }

    basic.forever(function () {
        microIoT_InquireStatus();
        //basic.pause(1000);
    })
}