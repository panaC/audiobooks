
# authentication demo test server

URL : https://europe-west1-audiobooks-a6348.cloudfunctions.net/login


----

```
curl -d "access_token=qwertyuioplkjhgfdsazxcvb" -H  "Content-Type: application/x-www-form-urlencoded" -X POST http://localhost:8080/login
{"message":"token valid"}
```

```


curl -d "code=42" -H  "Content-Type: application/x-www-form-urlencoded" -X POST http://localhost:8080/login
{"access_token":"qwertyuioplkjhgfdsazxcvb","token_type":"bearer"}% 

```
