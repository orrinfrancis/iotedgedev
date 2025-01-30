
read -p "Enter IOT hub connection string: " IOT_HUB_CONNECTION_STRING
read -p "Enter event hub consumer group: " EVENT_HUB_GROUP

export IotHubConnectionString=$IOT_HUB_CONNECTION_STRING
export EventHubConsumerGroup=$EVENT_HUB_GROUP
# Install necessary packages
apt-get update && \
    apt-get install git -y && \
    apt-get install nodejs npm -y

git clone https://github.com/Azure-Samples/web-apps-node-iot-hub-data-visualization.git && \
    cd web-apps-node-iot-hub-data-visualization/

npm install
npm start
