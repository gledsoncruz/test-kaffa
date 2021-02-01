
const moment = require('moment');
module.exports = () => {
    // const customerWalletsDB = require('../data/customer-wallets.json');
    const currentDateTime = moment().format();
    const controller = {};

    controller.currentDateTime = (req, res) => res.status(200).json({ currentDateTime });

    return controller;
}