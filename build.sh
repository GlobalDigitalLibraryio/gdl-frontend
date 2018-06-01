#!/bin/bash

set -e

VERSION="$1"
MODULE="$2"
PROJECT="gdl/$MODULE"

docker build -t $PROJECT:$VERSION --build-arg MODULE=$MODULE .
echo "BUILT $PROJECT:$VERSION"
