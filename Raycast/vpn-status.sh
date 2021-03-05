#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title VPN Status
# @raycast.mode inline
# @raycast.refreshTime 1m

# Optional parameters:
# @raycast.icon 📡

# @Documentation:
# @raycast.packageName Dashboard
# @raycast.description Stop VPN connection.
# @raycast.author Alexandru Turcanu
# @raycast.authorURL https://github.com/Pondorasti

VPN="VPN Romania"

status=$(scutil --nc status "$VPN" | sed -n 1p)

echo "$status"
