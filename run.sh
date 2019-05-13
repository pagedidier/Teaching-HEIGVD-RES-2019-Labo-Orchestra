#!/usr/bin/env bash

cd ./docker/image-auditor
docker build . -t res/auditor

cd ../../image-validation
docker build . -t res/musican
