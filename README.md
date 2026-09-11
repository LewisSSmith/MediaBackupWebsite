# Media Backup Website

## Overview

A website client for communicating with [Media Backup Backend](https://github.com/LewisSSmith/MediaBackupServer)

## Docker Setup (Recommended)

1. Ensure you've setup [Media Backup Backend](https://github.com/LewisSSmith/MediaBackupServer)
2. Ensure docker is installed
3. Clone repository to directory of your choice
4. Copy .env.example and rename to .env
5. Set port and API URL in newly created .env
6. Run `docker compose up` in a terminal in your project directory
7. Verify it works by navigating to view.html in a browser (it should redirect to login.html)
8. Ensure you have created an account first at register.html before logging in

## Manual Setup

1. Ensure you've setup [Media Backup Backend](https://github.com/LewisSSmith/MediaBackupServer)
2. Clone repository to directory of your choice
3. Copy js/config.template.js and rename to config.js
4. Set API URL in newly created config.js
5. Serve the files using a local web server of you choice. E.g. running `python3 -m http.server 8080`
5. Verify it works by navigating to view.html in a browser (it should redirect to login.html)
7. Ensure you have created an account first at register.html before logging in

## Functionality

- Creating and logging into accounts
- Gallery view and map view
- Uploading single or multiple files

## TODOs

- Add delete button
- Add configurable backend URL in settings page
- Limit number of thumbnails loaded in gallery view