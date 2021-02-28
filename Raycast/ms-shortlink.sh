#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title MS
# @raycast.mode silent

# Optional parameters:
# @raycast.icon images/makeschool-logo.png
# @raycast.argument1 { "type": "text", "placeholder": "bew1.3" }

# @Documentation:
# @raycast.packageName Make School
# @raycast.description A simple script to open short links (make.sc) from Make School.
# @raycast.author Alexandru Turcanu
# @raycast.authorURL https://github.com/Pondorasti

open "https://make.sc/$1"
