#!/usr/bin/env bash
# On macOS, node-gyp often can't find C++ standard headers (e.g. climits).
# This script sets CPLUS_INCLUDE_PATH from the active SDK and runs npm install.
set -e
SDK_PATH=$(xcrun --show-sdk-path 2>/dev/null || true)
if [ -z "$SDK_PATH" ]; then
  echo "Could not get SDK path. Install Xcode Command Line Tools: xcode-select --install"
  exit 1
fi
export CPLUS_INCLUDE_PATH="$SDK_PATH/usr/include/c++/v1:$SDK_PATH/usr/include"
echo "Using C++ includes from: $SDK_PATH"
npm install "$@"
