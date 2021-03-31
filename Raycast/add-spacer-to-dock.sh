#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
<<<<<<< Updated upstream
# @raycast.title Add spacer to Dock
# @raycast.mode silent
=======
# @raycast.title Add Spacer to Dock
# @raycast.mode compact
>>>>>>> Stashed changes

# Optional parameters:
# @raycast.icon 💻

# @Documentation:
# @raycast.packageName Developer Utilities
# @raycast.description Adds an invisible icon to the Dock as a separator.
# @raycast.author Alexandru Turcanu
# @raycast.authorURL https://github.com/Pondorasti

defaults write com.apple.dock persistent-apps -array-add '{"tile-type"="spacer-tile";}'
killall Dock
<<<<<<< Updated upstream
=======
echo "Added spacer to dock"
>>>>>>> Stashed changes
