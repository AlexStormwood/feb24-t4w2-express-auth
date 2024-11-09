const jwt = require("jsonwebtoken");

let jwtSecretKey = process.env.JWT_SECRET_KEY;

// async function generateJWT(userDetailsObj)
function generateJWT(userId, username, roles = null){
	return jwt.sign(
		{
			userId: userId,
			username: username,
			roles: roles
		},
		jwtSecretKey,
		{
			expiresIn: "7d"
		}
	);
}

function decodeJWT(tokenToDecode){
	
	return jwt.verify(tokenToDecode, jwtSecretKey);
}

async function validateUserAuth(request, response, next){
	let providedToken = request.headers.jwt;
	console.log(providedToken);

	if (!providedToken){
		return response.status(403).json({
			message:"Sign in to view this content!"
		});
	}

	let decodedData = decodeJWT(providedToken);
	console.log(decodedData);
	if (decodedData.userId){
		request.authUserData = decodedData;
		next();
	} else {
		return response.status(403).json({
			message:"Sign in to view this content!"
		});
	}
}

module.exports = {
	generateJWT,
	decodeJWT,
	validateUserAuth
}