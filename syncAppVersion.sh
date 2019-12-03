#!/bin/bash

if [ "$1" == "" ]; then
  echo Usage: $0 version
  echo i.e.: 20180806.1.1
  exit 0
fi

sed -i bak -E 's/[0-9]{8}\.[0-9]+\.[0-9]+/'"$1"'/' ./H5/src/component/images/version.json
