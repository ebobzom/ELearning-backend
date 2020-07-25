const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        status: 'success',
        data: 'logged out successfully'
    });

    return;
};

module.exports = logout;