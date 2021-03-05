#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title VPN Disconnect
# @raycast.mode compact

# Optional parameters:
# @raycast.icon 📡

# @Documentation:
# @raycast.packageName System
# @raycast.description Stop VPN connection.
# @raycast.author Alexandru Turcanu
# @raycast.authorURL https://github.com/Pondorasti

VPN="VPN Romania"

networksetup -disconnectpppoeservice "$VPN"

echo "Disconnected from $VPN!"
