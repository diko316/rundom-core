#!/bin/sh

ROOT=$(dirname $(dirname $(readlink -f $0)))
CURRENT_DIR=$(pwd)
TARGET=${ROOT}/dist
TARGET_GID=$(stat -c '%g' ${TARGET})
TARGET_UID=$(stat -c '%u' ${TARGET})

cd "${ROOT}"

if chown $(stat -c '%u:%g' ${ROOT}/dist) -R ${ROOT}/dist/*; then
    echo "Built all sources to output directory."
    
else
    echo "No builds as for now."
    
fi

exit 0


