class BLEFrame {
    // Manual constructor
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }

    static processFrameVersion(frameVersion, packet) {
        function zeroPad(num, places) {
            return String(num).padStart(places, '0')
        }
        if (frameVersion === 0x03) {
            function convertFixedPoint(value) {
                let signed = (value & 0x8000) > 0 ? -1 : 1;
                return signed * value / Math.pow(2, 8);
            }
            var dataOffset = 0;
            var accX = convertFixedPoint(packet[dataOffset++] + packet[dataOffset++]);
            var accY = convertFixedPoint(packet[dataOffset++] + packet[dataOffset++]);
            var accZ = convertFixedPoint(packet[dataOffset++] + packet[dataOffset++]);
            var mac = packet.slice(dataOffset).reverse().map(x => zeroPad(x.toString(16), 2)).join("")
            return [mac, new BLEFrame("ACC", { "x": accX, "y": accY, "z": accZ })]
        }
        throw new Error("Unrecognized frame type");
    }
}

module.exports = BLEFrame;
