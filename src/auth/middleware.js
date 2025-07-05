const { verifyToken } = require("./jwt");

const authenticate = (req, res, next) => {
  const bypassQueries = [
    "previousSignUpData",
    "signIn",
    "getCode",
    "getCodeRecoverAccount",
    "nicknameSuggestions",
    "releaseAccount"
  ];

  const shouldBypass = bypassQueries.some((q) => req.body.query.includes(q));
  if (shouldBypass) return next();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      errors: [
        {
          message: "No autorizado. Token faltante.",
          extensions: {
            code: "UNAUTHENTICATED"
          }
        }
      ]
    });
  }

  try {
    const decoded = verifyToken(token);
    req.informationToken = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      errors: [
        {
          message: "El token ha expirado.",
          extensions: {
            code: "TOKEN_EXPIRED"
          }
        }
      ]
    });
  }
};

module.exports = {
  authenticate
};
