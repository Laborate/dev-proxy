#!/bin/bash

cd ~/dev-proxy;

#Node Modules
npm install

#Start Server
forever start start.js

#Install Complete
echo -e "\033[32mInstall Complete\033[m"
