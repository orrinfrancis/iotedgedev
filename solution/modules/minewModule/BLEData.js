const bleFrame = require("./BLEFrame.js")

class BLEData {
    // Manual constructor
    constructor(id, transmitterId, battery, frameTime, frame) {
        this.id = id;
        this.transmitterId = transmitterId;
        this.battery = battery;
        this.frameTime = frameTime;
        this.frame = frame;
    }

    static fromJsonRaw(transmitterId, rawJson) {
        const timestamp = rawJson.timestamp;
        const rawPacket = rawJson.rawData;
        const packet = rawPacket.match(/.{1,2}/g).map(x => parseInt(x, 16));
        // Process BLE header, expecting 02 01 06
        var headerOffset = 0;
        const headerLength = packet[headerOffset];
        // ...
        // Process UUID 16, expecting 03 03 E1 FF
        var uuidOffset = headerOffset + headerLength + 1;
        const uuidLength = packet[uuidOffset];
        // ...
        // Process Data
        var dataOffset = uuidOffset + uuidLength + 1;
        const dataLength = packet[dataOffset++]
        const dataType = packet[dataOffset++]
        const dataUUID = packet[dataOffset++] + packet[dataOffset++];
        const frameType = packet[dataOffset++];
        const frameVersion = packet[dataOffset++];
        const battery = packet[dataOffset++];
        // Processing for specific frame version
        try {
            const [mac, frame] = bleFrame.processFrameVersion(frameVersion, packet.slice(dataOffset))
            console.log(`${timestamp} ${mac} = ${frame.type} (${frame.data.x} ${frame.data.y} ${frame.data.z})`)
            return new BLEData(mac, transmitterId, battery, timestamp, frame)
        } catch (e) { return null }
    }
}

module.exports = BLEData;
