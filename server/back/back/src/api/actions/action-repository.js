//const { Sequelize } = require("sequelize");
import { sequelize } from "../../database/database";
const { QueryTypes } = require('sequelize');
const { BaseRepository } = require("../base/base-repository");

class ActionRepository extends BaseRepository {

    setSended = async function (returned) {
        for (let i = 0; i < returned.length; i++) {
            await this.model.update({ sended: true },
                {
                    where: {
                        date: returned[i].date, placeId: returned[i].placeId,
                        personId: returned[i].personId, outputId: returned[i].outputId
                    }
                });
        }
    }

    getLastActionByPlace = async function (idPlace) {
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