#!/bin/bash

./compile.sh
./save.sh

# push to gh-pages branch
git subtree push --prefix www origin gh-pages