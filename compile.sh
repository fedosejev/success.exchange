#!/bin/bash

# compile
harp compile

# copy CNAME and .nojekyll
cp ./github_pages/CNAME ./www/
cp ./github_pages/.nojekyll ./www/.nojekyll