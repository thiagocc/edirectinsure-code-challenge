const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    if (process.env.ENVIRONMENT_AUTHORIZATION === 'DEV') {
        req.user = {
            id: '5ec48d9f92a923a1352eee1d',
            session: 'dev',
            isAdmin: false,
        };

        next();
    } else {
        const bearerHeader = req.headers['authorization'];

        if (!bearerHeader)
            return res
                .status(401)
                .send({ success: false, error: 'No token provided.' });

        const bearer = bearerHeader.split('Bearer ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // console.log(err)
                return res.status(500).send({
                    success: false,
                    error: 'Failed to authenticate token.',
                });
            } else {
                const buffUserAgent = Buffer.from(
                    JSON.stringify(req.useragent)
                );
                const useragent = buffUserAgent.toString('base64');

                const buffIPInfo = Buffer.from(JSON.stringify(req.ipInfo));
                const ipinfo = buffIPInfo.toString('base64');

                if (
                    decoded.useragent === useragent &&
                    decoded.ipinfo === ipinfo
                ) {
                    req.user = decoded;
                    next();
                } else {
                    res.status(500).send({
                        success: false,
                        error:
                            'Failed to authenticate token. Useragent and/or IP mismatch.',
                    });
                }
            }
        });
    }
};

exports.verifyJWT = verifyJWT;
