//const { Sequelize } = require("sequelize");
import { sequelize } from "../../database/database";
const { QueryTypes } = require('sequelize');
const { BaseRepository } = require("../base/base-repository");

class ActionRepository extends BaseRepository {
    getLastActionByPlace = async function (idPlace, idOutput) {
        /*
            select * from PUBLIC.actions where (date,"outputId") in (
            SELECT max("date"), "outputId"
            FROM public.actions where "placeId"=1 
            group by "outputId")
        */
        let ret = await sequelize.query(' select * from PUBLIC.actions where (date,"outputId") in ( ' +
            'SELECT max("date"), "outputId"' +
            'FROM public.actions where "placeId"= ' + idPlace.toString() +
            'group by "outputId") order by "outputId"', { type: QueryTypes.SELECT });
        //console.log(ret);
        return ret;
        /*return this.model.findAll({
            where: { placeId: idPlace, outputId: idOutput },
            order: [['placeId', 'DESC']],
            limit: 1
        });*/
    }
}

exports.ActionRepository = (model) => new ActionRepository(model); 