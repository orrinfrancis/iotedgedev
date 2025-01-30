const bleData = require('./BLEData.js')

class MinewTransmitter {
    static handleTransmission(transmission) {
        // Expect a list of results
        if (!Array.isArray(transmission)) {
            console.log("Transmission not in expected format, ignoring");
            return;
        }
        // Expected that transmitter would be first
        const transmitterPacket = transmission.shift();
        const type = transmitterPacket.type;
        const mac = transmitterPacket.mac;
        const numPackets = transmitterPacket.nums;
        console.log(`Transmission from ${type} ${mac} with ${numPackets} packets`);
        if (transmission.length > 0) {
            return transmission.map((packet) =>
                bleData.fromJsonRaw(mac, packet)
            );
        }
    }
}

module.exports = MinewTransmitter;
