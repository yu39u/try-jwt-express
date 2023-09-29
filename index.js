var express = require("express")
var app = express()
var jwt = require("jsonwebtoken")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, function () {
	console.log("listening on 3000")
})

app.get('/', function (ree, res) {
	res.json({ status: "ok" })
})

app.get('/login', function (req, res) {
	console.log(req.body)
	const username = req.body.username
	const password = req.body.password

	if (username == "hoge" && password == "pass") {
		const token = jwt.sign({ username: username }, "seckey", { expiresIn: "1h" })
		res.json({ token: token })
	} else {
		res.json({ error: "auth error" })
	}
})

app.get('/protected', verifyToken, function (req, res) {
	res.json("protected contents")
})

function verifyToken(req, res, next) {
	const authHeader = req.headers[["authorization"]]
	if (authHeader !== undefined) {
		if (authHeader.split(" ")[0] === "Bearer") {
			const token = jwt.verify(authHeader.split(" ")[1], "seckey")
			if (token.username === "hoge" && Date.now() < token.exp * 1000) {
				next()
			} else {
				res.json({ error: "auth error" })
			}

		} else {
			res.json({ error: "auth method error" })
		}
	} else {
		res.json({ error: "header error" })
	}
}