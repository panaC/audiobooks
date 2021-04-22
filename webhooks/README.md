




# webhooks

the webhooks server is a conversationnal bridge beetween google actions api (user voice) and the opds publication feed (api)

it receive voice request from google actions api and send back the conversational answer to google action.

the webhooks is one-way communication of type [request-resonse](https://en.wikipedia.org/wiki/Request%E2%80%93response). It's not possible to send information to the google actions api without a request from it 

## quickstart

`npm run proxy &`
`npm run start:dev`

### local test suite

`npm run test`

### eslint

`npm run fix`


### CI/CD

there are an automatic build webhooks to construct the container in GCP container build and deploy on google cloud run

The build start at every push in main branch

cf URL : https://webhooks-4ovpraf5sq-ew.a.run.app/


## micro-service architecture


``` 
 |=================|         |==================|           |=================
 |                 |         |                  |           |                |
 | google actions  |  http   |   webhooks       | http json |  opds2 feed    |
 |     API         |<------->| server (node js) |<--------->|                |
 |                 |         |                  |           |                |
 |=================|         |==================|           |================|
                                      
```

## opds feed API interface

[opds 2.0 spec](https://github.com/opds-community/drafts/blob/master/opds-2.0.md)

the API should be an opds2 feed that supply readium webpub publication unpacked audiobook

Warning: the project doesn't include an odps feed discovery. Each resources and collections should be mapped in a constant declaration before the production deployment.

### global search

[opds 2.0 search spec](https://github.com/opds-community/drafts/blob/master/opds-2.0.md#2-search)

the search works with a global query param to both title and author search.

when a user say : "I want to listen Moby Dick of Herman Melville" the query param will be "Moby Dick of Herman Melville"

the query param will be at the end of the sentence said by the user.
ex:
- "I want to listen [query]"
- "read for me [query]"
- "I wish to listen [query]"
- "read [query]"
- ...

**more the search engine is powerful more the user could be access to the desired audiobook.**

#### how does it work in webhooks ?

the search url is declared in the codebase and not discovered from the opds feed.

the search url should returns an opds feed with an array of opdsPublications. the first n publication will be suggested to the user.
__the number of publications per page should be greater than the n publications suggested to user__

### collections

a collections is an opds2 feed with any dedicated content whishes by the opds feed owner.

each audiobooks collections (more popular, fiction, romance, last added, your collection, ...) URL should be declared in the codebase.

there are no discoveries available at this time. Each collections is added in the conversational flowchar and linked to a collections URL.

these collections should return an opds feed with an array of publications. like the search engine : n publication will be suggested to the user

summary :

- a collection has a static link (with potentially query param).
- the collection has an array of opdsPublications paged or not.
- the array of opdsPublication should be accessible in the 'publications' key ([opds2 specificationi](https://github.com/opds-community/drafts/blob/master/opds-2.0.md#12-publications))
- if the collection is paged : the N publications suggested to the user should be greater than the n publications supplied per page.
- that's all

### opds publication

each opds publication should have a self link.

this self link URL is keep in memory to access it in the future.

the opds publication should contain a webpub acquisition link  :
- rel : `http://opds-spec.org/acquisition/open-access`
- type: `application/webpub+json`

it may contain a cover image. (cover displayed on screen surface)

ex: 

```json
{
  "metadata": {
    "@type": "http://schema.org/Audiobook",
      "title": "L'assommoir",
      "identifier": "assommoir_emile_zola",
      "author": "Emile Zola",
      "publisher": "archive",
      "language": "fr",
      "description": "L'Assommoir est un roman d'Émile Zola publié en feuilleton dès 1876 dans Le Bien public, puis dans La République des Lettres, avant sa sortie en livre en 1877 chez l'éditeur Georges Charpentier. C'est le septième volume de la série Les Rougon-Macquart.",
      "rights": "",
      "duration": 61664,
      "subject": "roman"
  },
    "links": [
    {
      "type": "application/opds-publication+json",
      "rel": "self",
      "href": "https://storage.googleapis.com/audiobook_edrlab/opdspub/assommoir_emile_zola.json"
    },
    {
      "rel": "http://opds-spec.org/acquisition/open-access",
      "type": "application/webpub+json",
      "href": "https://storage.googleapis.com/audiobook_edrlab/webpub/assommoir_emile_zola.json"
    }
    ],
    "images": [
    {
      "type": "image/jpeg",
      "href": "https://ia600200.us.archive.org/8/items/LAssommoir/__ia_thumb.jpg"
    }
    ]
}

```

### webpub

[readium web publication manifest spec](https://github.com/readium/webpub-manifest)

each RWPM should have a self link.

**each RWPM should have a total duration in the metadata but above all each reading orders links should have a duration in seconds**
this duration allows to spacialize the listener in the audiobook progression .. it's really important

[example](https://storage.googleapis.com/audiobook_edrlab/webpub/assommoir_emile_zola.json)

### authentication

the authentication works with the google sign-in .. simple and quick to setup [google docs](https://developers.google.com/assistant/identity/gsi-concept-guide)

[opds2 authentication specification](https://drafts.opds.io/authentication-for-opds-1.0.html)

#### how does it works ?

the webhooks have access after user permission to a GOOGLE ID TOKEN (JWT) with several information like verified user email.
This authentication with a certified google token may unlock the opdsfeed private resources to recognize user.

to recognize a user it could be the email, the unique google client ID and his first and lastname for example.

if the opds feed providers has already a google sign-in opt-in and the users consumers is loged by this way. It's works !
if the opds feed doesn't have a google sign-in option. Each user could be recognize by his email.

the idea is each webhook request to the odpsfeed (collections, search, webpub) supply in the headers a GOOGLE ID TOKEN in the authorization bearer token.
the opds feed receive in his header this GOOGLE ID TOKEN and return an opdsfeed (http code 200) or an opdsAuthentication (http code 401)
the webhook get back the http data and say it to the user. (sucess or failure)

**opdsAuthentication format ?**  TODO

example GOOGLE ID TOKEN JWT : 
```js

{
  "sub": 1234567890,        // The unique ID of the user's Google Account
    "iss": "https://accounts.google.com",        // The token's issuer
    "aud": "123-abc.apps.googleusercontent.com", // Client ID assigned to your Actions project
    "iat": 233366400,         // Unix timestamp of the token's creation time
    "exp": 233370000,         // Unix timestamp of the token's expiration time
    "name": "Jan Jansen",
    "given_name": "Jan",
    "family_name": "Jansen",
    "email": "jan@gmail.com", // If present, the user's email address
    "locale": "en_US"
}

```


### implicit grant flow

In fact you should not use the google sign-in authentication. No account creation and no need to have a google mail. 
google sign-in is for register the user in the webhook database.

oauth2 implicit grant allows this type of authentication.
authentication by oauth2 server

opds2 auth spec allow to authenticate the user with implicit grant

https://drafts.opds.io/authentication-for-opds-1.0.html#345-implicit-grant

#### opdsAuthentication playground server

https://github.com/panaC/opds2-auth-test-server

#### authentication by a 4 digit short-lived number


the more simple sollution is an authentication on the conversation side.
There are no need to use google oauth method to authenticate the application

in the authentication process ask to user a unique code randomly generate from the web library dashboard

for more convenience this code is a number with 2 or 4 digits (90 to 900 possibilies to find the right one) and a lifespan of some minutes

##### authentication demo server :
```
- GET /login : send the html authentication form
- POST /login : send the access_token (json)
-       (user/pass)
- POST /verify  :  200 : ok
-        (token)  401 : ko
```

## software architecture

lay on the MVC pattern :
- Model : opds api with access by service class
- View : google action API or perhaps in the future to amazon skills
- Controler : Conversationnal flows

with 2 externals services : 
- Depency injections common on each class
- I18n for the translation

#### Memory (database): 

google actions provide 2 tiny json storages : one for the session (delete at the end) and one persistent (user storage)

this 2 kinds of storages is sync by the request-response (webhook is stateless) : the storage capacity should not exceed some kilo-octet.

##### session storage

used by the webhook to synchronize the state between google action logic and webhook logic.

##### user storage

https://developers.google.com/assistant/conversational/storage-user

**does not work**

__caveats__:

```
Expiration of user storage data
For verified users, data stored in user storage expires based on their Web & App Activity settings and can also be cleared by the Action itself. For users who aren't verified, Assistant clears the contents of user storage at the end of the conversation.

Actions on Google sets the user's verification status at the start of each conversation based on a variety of indicators when the conversation starts. As one example, a user logged in to Google Assistant on their mobile device has a verification status of VERIFIED.

The following are possible reasons for a user to have a verification status of GUEST:

The user has personal results turned off.
The user disabled their Web & App Activity. Keep in mind that some users may have this setting disabled at the domain level.
If a device has Voice Match enabled, and the match fails or the user invokes the Assistant without using their voice (such as a long press on a Nest Home device).
The user isn't signed in.
Always check the user's verification status before storing data with user storage to prevent guest users from interacting with a feature that will fail for them.


```

for the key value database : I used google datastore https://cloud.google.com/datastore
a simple NoSql Database made by google 

and coupled with google cloud functions 
https://github.com/panaC/audiobooks/tree/main/datastore

