module.exports = app => {
    const controller = require('../controllers/world_clock')();

    app.route('/date/now')
        .get(controller.currentDateTime);
}
