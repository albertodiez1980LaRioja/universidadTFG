const { BaseController } = require("../base/base-controller");

class PlaceController extends BaseController {
    constructor(service, options = {}) {
        super(service, options);
        this.service = service;
        this.options = options;
    }
}

exports.PlaceController = (service) => new PlaceController(service);