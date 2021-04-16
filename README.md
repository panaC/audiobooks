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

- we must have a powerful opds feed with many audiobooks, search feature, groups, and so one 
- Creation of a convesational flows (you speak to a machine, so, needs to be carefully crafted)
- The player/streaming machine and the connection to the google home player (some limitation like media-status has been solved recently)
- The deployment of the project


## architecture

``` 
 |=================|         |==================|           |=================            ==================|
 |                 |         |                  |           |                |            |                 |
 | google home     |  voice  |  google actions  | http json |  webhooks      |   opds2    |  opds2 feed     |
 |  smart speaker  |<------->|    platforms     |<--------->|    (node js)   |<---------->|    wepbub       |
 |                 |         |   (NLU -> API)   |           |                |            | mp3 http served |
 |=================|         |==================|           |================|            |=================|
                                     |
                                     |
                             |==================|
                             |                  |
                             |   opds2 oauth    |
                             |      implicit.   |
                             |==================|                                     
```

## authentication 

https://developers.google.com/assistant/identity/oauth2?oauth=implicit

- oauth2 implicit flow

#### opds oauth2 test server

https://github.com/panaC/opds2-auth-test-server

url : https://opds-auth-test-server-aplqpqv3wa-ey.a.run.app/implicit/login/google

## flowchart

link : https://drive.google.com/file/d/1zEJQ8oDXU0E5h31OtbDz2COLnirJ8WTn/view?usp=sharing

## webhooks

see the webhooks readme

[![webhooks CI](https://github.com/panaC/audiobooks/actions/workflows/node.js.yml/badge.svg)](https://github.com/panaC/audiobooks/actions/workflows/node.js.yml)

webhooks url : https://webhooks-4ovpraf5sq-ew.a.run.app/

## demo opds-feed

URL: https://storage.googleapis.com/audiobook_edrlab/feed.json

TODO: switch to https://raw.githack.com/

#### update

`gsutil cp -R publication-database gs://audiobook_edrlab`

`gsutil iam ch allUsers:objectViewer gs://audiobook_edrlab`
