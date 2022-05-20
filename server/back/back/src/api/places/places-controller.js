import { PlaceService } from './places-service';
import { PlaceRepository } from './places-repository';
import Place from './places-model';

const { BaseController } = require("../base/base-controller");

class PlaceController extends BaseController {

}

export default new PlaceController(PlaceService(PlaceRepository(Place)));