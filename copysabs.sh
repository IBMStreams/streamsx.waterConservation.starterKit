#!/bin/bash
#set -x # echo on

TGTPATH='./nodejs/streamsapp'

function copyFile {
  SRC="$1"
  TGT="$2"
  echo "Copying ${SRC} --> ${TGT}"
  cp ${SRC} ${TGT}
}

echo "Copying the built sab files to ${TGTPATH}, so the Node app can deploy them"
find ./com.ibm.streamsx.* -name '*.sab' | while read file;
do
  copyFile ${file} ${TGTPATH};
done
chmod 644 ${TGTPATH}/*

echo "Reminder that you may also need to update the IOT toolkit!"
echo "Download from: http://github.com/IBMStreams/streamsx.iot/releases"
