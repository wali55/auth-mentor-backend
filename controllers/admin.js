const adminDashboard = (req, res) => {
    return res.status(200).json({message: "Accessed admin dashboard"})
}

module.exports = {adminDashboard}