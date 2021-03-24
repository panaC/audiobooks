const { ok } = require("assert");

// https://github.com/GoogleCloudPlatform/functions-framework-nodejs
const SERVER_URL = "http://localhost:8080"

// static token for the demo
const ACCESS_TOKEN = "qwertyuioplkjhgfdsazxcvb";

const page = (url) => `
<!doctype html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<meta name="description" content="">
<meta name="author" content="">

<title>Sign in</title>

<!-- Bootstrap core CSS -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">

<!-- Custom styles for this template -->
<style>
html,
  body {
height: 100%;
  }

body {
display: -ms-flexbox;
display: -webkit-box;
display: flex;
         -ms-flex-align: center;
         -ms-flex-pack: center;
         -webkit-box-align: center;
         align-items: center;
         -webkit-box-pack: center;
         justify-content: center;
         padding-top: 40px;
         padding-bottom: 40px;
         background-color: #f5f5f5;
}

.form-signin {
width: 100%;
       max-width: 330px;
padding: 15px;
margin: 0 auto;
}

.form-signin .checkbox {
  font-weight: 400;
}

.form-signin .form-control {
position: relative;
          box-sizing: border-box;
height: auto;
padding: 10px;
         font-size: 16px;
}

.form-signin .form-control:focus {
  z-index: 2;
}

.form-signin input[type="username"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
</head>

<body class="text-center">
<form class="form-signin" action="${url}" method="post">
<!--<img class="mb-4" src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg" alt="" width="72"
height="72">!-->
<h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
<label for="inputEmail" class="sr-only">Email address</label>
<input name="username" id="inputUsername" class="form-control" placeholder="username" required autofocus>
<!-- <input type="email" name="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus> -->
<label for="inputPassword" class="sr-only">Password</label>
<input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required>
<!--<div class="checkbox mb-3">
<label>
<input type="checkbox" value="remember-me"> Remember me
</label>!-->
</div>
<button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
<!--<p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>!-->
</form>
</body>

</html>

`

const login = async (req, res) => {

  switch (req.method) {

    case 'GET':
      res.status(200).send(page(SERVER_URL + "/login"));

      break;

    case 'POST':

      const { access_token, code, username, password } = req.body;

      // TODO : Check from authentication service if the token is valid
      if (access_token === ACCESS_TOKEN) {

        res.status(200).json({ message: "token valid" });
        return;
      } else if (access_token && typeof access_token === "string") {

        res.status(401).json({ message: "token invalid" });
        return;
      }

      // TODO : Check from database if the code is valid
      if (code === "42") {
        
        res.status(200).json({ access_token: ACCESS_TOKEN, token_type: "bearer" });
        return ;
      } else if (code && typeof code === "string") {

        res.status(401).json({ message: "code invalid" });
        return ;
      }

      // generate the connection code

      try {
        console.log(username, password);

        // TODO : Check in the database the user/pass

        ok(username === "admin", "bad username");
        ok(password === "admin", "bad password");
      } catch (e) {

        res.status(200).send(e.toString());
        return ;
      }

      // TODO : Generate a real random 2/4 digits code
      res.status(200).send("your code is <pre>42</pre>");

      break;

    case 'OPTIONS':
      // Send response to OPTIONS requests
      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).json({});
      break;
    default:
      res.status(405).json({ status: "error", message: "undefined method" });
      break;
  }
};

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.login = async (req, res) => {

  res.set('Access-Control-Allow-Origin', '*');

  try {

    return await login(req, res);
  } catch (e) {

    console.log(e);

    res.status(500).json({ status: "error", message: e.toString() });
  }
};
