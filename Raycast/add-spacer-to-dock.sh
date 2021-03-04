#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Add spacer to Dock
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 💻

# @Documentation:
# @raycast.packageName Developer Utilities
# @raycast.description Adds an invisible icon to the Dock as a separator.
# @raycast.author Alexandru Turcanu
# @raycast.authorURL https://github.com/Pondorasti

defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="spacer-tile";}'
killall Dock
