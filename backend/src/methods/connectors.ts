import express from 'express';
import {authMiddleware} from './auth';
import db from '../db';
import {FindOptionsWhere} from 'typeorm';
import {Connector} from '../entity/Connector';
import {Platforms} from '../types/common';

const connectorsRouter = express.Router({mergeParams: true});
connectorsRouter.use(authMiddleware);

connectorsRouter.get('/', getConnectors);
connectorsRouter.post('/', createConnector);
connectorsRouter.delete('/:id(\\d+)', deleteConnector);

async function getConnectors (req: express.Request<{scenario_id?: number}>, res: express.Response){
    let filter: FindOptionsWhere<Connector>;
    if (req.params.scenario_id){
        const scenario = await db.Scenarios.findScenario({
            user: req.user!,
            id: req.params.scenario_id
        });
        if (scenario) filter = { scenario };
        else return res.status(404).json({ok: false, error: 'Scenario not found'});
    } else {
        filter = {
            scenario: {
                user: req.user!,
            }
        };
    }
    const found_connectors = await db.Connectors.findConnectors(filter);
    return res.json({ok: true, data: found_connectors});
}

async function createConnector (
    req: express.Request<{scenario_id?: number, platform?: Platforms, token?: string}>,
    res: express.Response
) {
    if (!(
        (req.params.scenario_id || req.body.scenario_id)
        && Object.values(Platforms).includes(req.body.platform)
        && req.body.token
    )) {
        console.error(req);
        return res.sendStatus(400);
    }
    const scenario = await db.Scenarios.findScenario({
        user: req.user!,
        id: req.params.scenario_id ?? req.body.scenario_id
    });
    if (!scenario) return res.status(404).json({ok: false, error: 'Scenario not found'});

    const connector = await db.Connectors.createConnector({
        scenario,
        platform: req.body.platform,
        token: req.body.token
    });
    // TODO: add webhook bounding
    return res.json({ok: true, data: connector});
}

async function deleteConnector (
    req: express.Request<{scenario_id?: number, id?: number}>,
    res: express.Response
){
    let filter: FindOptionsWhere<Connector>;
    if (req.params.scenario_id){
        const scenario = await db.Scenarios.findScenario({
            user: req.user!,
            id: req.params.scenario_id
        });
        if (scenario) filter = { scenario };
        else return res.status(404).json({ok: false, error: 'Scenario not found'});
    } else {
        filter = {
            scenario: {
                user: req.user!,
            }
        };
    }
    const deleted = await db.Connectors.deleteConnector(filter);
    return res.json({ok: true, data: deleted});
}

export default connectorsRouter;