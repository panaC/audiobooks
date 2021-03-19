# audiobooks

**listen an audiobook on a smart speaker**

## purpose of the project

you have an opds feed with audiobook

you have a google home nest speaker (or your phone)

**SO** You can enjoy to read an audiobook on the google home

## This project is a work in progress

The deadline for first stage of the project (cf technical specification) is for the first july of this year.

### actual state

**not working at all**

## some technical challenges

- It need to have a powerful opds feed with some audiobooks, the search feature, and so one 
- Creation of a convesational flows (you speak to a machine, so, need to be carefully crafted)
- The player/streaming machine and the connection to the google home player (some limitation like media-status has been solved recently)
- The deployment of the project

## webhooks

see the webhooks readme

[![webhooks CI](https://github.com/panaC/audiobooks/actions/workflows/node.js.yml/badge.svg)](https://github.com/panaC/audiobooks/actions/workflows/node.js.yml)

webhooks url : https://webhooks-4ovpraf5sq-ew.a.run.app/

## demo opds-feed

URL: https://storage.googleapis.com/audiobook_edrlab/feed.json

#### update

`gsutil cp -R publication-database gs://audiobook_edrlab`

`gsutil iam ch allUsers:objectViewer gs://audiobook_edrlab`
