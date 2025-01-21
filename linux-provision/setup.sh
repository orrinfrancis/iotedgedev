#!/bin/sh

# Turns on auto login for the LXC so that you dont have to remember the password

# GETTY_OVERRIDE="/etc/systemd/system/container-getty@1.service.d/override.conf"
# mkdir -p $(dirname $GETTY_OVERRIDE)
# cat <<EOF >$GETTY_OVERRIDE
#   [Service]
#   ExecStart=
#   ExecStart=-/sbin/agetty --autologin root --noclear --keep-baud tty%I 115200,38400,9600 \$TERM
# EOF
# systemctl daemon-reload
# systemctl restart $(basename $(dirname $GETTY_OVERRIDE) | sed 's/\.d//')

read -p "Enter device connection string: " DEVICE_CONNECTION_STRING

# Install necessary packages
apt-get update && \
    apt-get install curl -y && \
    apt-get install sudo -y

# Adds the package repository into sources 
curl https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb > ./packages-microsoft-prod.deb
sudo apt install ./packages-microsoft-prod.deb
apt-get update && \
    # Install moby-engine to be able to run containers
    apt-get install moby-engine -y && \
    # Install the IOT Edge runtime
    apt-get install aziot-edge -y

# Provision the IOT Edge device
sudo iotedge config mp --connection-string "$DEVICE_CONNECTION_STRING"
sudo iotedge config apply

# Check that the device has been provisioned successfully
sudo iotedge system status
sudo iotedge check

echo "\nIOT Edge device should be configured successfully, please check the above status commands!\n"

# To check the logs of a specific module, use
# iotedge logs minewModule -f
