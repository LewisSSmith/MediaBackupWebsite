# Media Backup Website

## Overview

A website client for communicating with [Media Backup Backend](https://github.com/LewisSSmith/MediaBackupServer)

## Setup

1. Ensure you've setup [Media Backup Backend](https://github.com/LewisSSmith/MediaBackupServer)
2. Clone repository to directory of your choice
3. Change URL in js/config.js to point to backend API - note: this is what other devices will use to connect to the server, so don't set to localhost unless you only want the website to work on the machine running the backend
4. Serve the files using a local web server of you choice. E.g. running `python3 -m http.server 8080`
5. Verify it works by navigating to view.html (it should redirect to login.html)
6. Ensure you have created an account first at register.html before logging in

## Functionality

- Creating and logging into accounts
- Gallery view and map view
- Uploading single or multiple files

## TODOs

- Add delete button
- Add configurable backend URL in settings page
- Limit number of thumbnails loaded in gallery view