#!/bin/bash

git pull origin master
git add .
git commit -m "$1"
git push heroku master
git push origin master