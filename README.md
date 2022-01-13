# audiobooks

OFFICIAL REPOSITORY : https://github.com/edrlab/lis-mon-livre

**listen an audiobook on a GOOGLE smart speaker**

connect an OPDS Feed with some audiobook Readium Web Publication Manifest to the Google Assistant

Actually implemented to the name "Parler avec valentin audio" in french

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

`gsutil cp -R publication-database/* gs://audiobook_edrlab`

`gsutil iam ch allUsers:objectViewer gs://audiobook_edrlab`

## key value database for the store persistence

Cloud functions URL :

- https://us-central1-audiobooks-a6348.cloudfunctions.net/get
- https://us-central1-audiobooks-a6348.cloudfunctions.net/set

https://console.cloud.google.com/datastore/stats?project=audiobooks-a6348

## specification document (private)
https://docs.google.com/document/d/1Gz0lipop1liGCl2wID0sbYJRegvYIA428TXLIV284eI/edit?usp=sharing

### API
https://docs.google.com/document/d/1O5A5ofPDBSkvj3xyxNRIgSdmaf3cDwntkwX08_wsODw/edit#heading=h.ny5upyx6dx7

### test specification

https://docs.google.com/document/d/190HxAP1DIHZNUSSXYE7OeAtPvPTPSfx22ra1dkF5-5U/edit?usp=sharing

----
