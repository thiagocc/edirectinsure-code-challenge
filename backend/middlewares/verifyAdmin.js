const verifyAdmin = (req, res, next) => {
    if (process.env.ENVIRONMENT_AUTHORIZATION === 'DEV') {
        next();
        return;
    }

    if (req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({
            message:
                'This user does not have permission to access this content. Only administrators have permissions.',
        });
    }
};

exports.verifyAdmin = verifyAdmin;
