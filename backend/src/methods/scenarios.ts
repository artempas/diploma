import express from 'express';
import {authMiddleware} from './auth';
import db from '../db';
import connectorsRouter from './connectors';


const scenariosRouter = express.Router();
scenariosRouter.use(authMiddleware);
scenariosRouter.get('/:scenario_id(\\d+)', getScenario);
scenariosRouter.delete('/:scenario_id(\\d+)', deleteScenario);
scenariosRouter.patch('/:scenario_id(\\d+)/setVisual', setVisual);
scenariosRouter.get('/all', getScenarios);
scenariosRouter.post('', createScenario);
scenariosRouter.use('/:scenario_id(\\d+)/connector', connectorsRouter);

/**
 *  @openapi
 *   /scenario/all:
 *     get:
 *       security:
 *           - cookieAuth: []
 *       summary: Retrieve all scenarios
 *       tags:
 *         - scenarios
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Scenario'
 *
 */
async function getScenario (req: express.Request<{ scenario_id: string }>, res: express.Response) {
    const scenario = await db.Scenarios.findScenario({id: Number(req.params.scenario_id), user: req.user!});
    if (scenario) res.json({ok: true, data: scenario});
    else res.status(404).json({ok: false, error: 'Not found'});
}

/**
 * @openapi
 *   /scenario/{id}:
 *     get:
 *       security:
 *          - cookieAuth: []
 *       summary: Retrieve a specific scenario
 *       tags:
 *         - scenarios
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the scenario to retrieve
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             appliercation/json:
 *               schema:
 *                 $ref: '#/components/schemas/Scenario'
 *
 */
async function getScenarios (req: express.Request, res: express.Response){
    const scenarios = await db.Scenarios.findScenarios({ user: {id: req.user!.id}});
    res.json({ok: true, data: scenarios});
}

/**
 * @openapi
 *   /scenario:
 *     post:
 *       tags:
 *         - scenarios
 *       security:
 *         - cookieAuth: []
 *       summary: Create scenario
 *       parameters:
 *         required: false
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *       responses:
 *         '201':
 *           description: Scenario created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Scenario'
 */
async function createScenario (req: express.Request<{name?: string}>, res: express.Response){
    const scenario_name = req.body.name ?? 'Scenario';
    const scenario = await db.Scenarios.createScenario(scenario_name, req.user!);
    res.status(201).json({ok: true, data: scenario});
}

/**
 * @openapi
 *   /scenario/{id}:
 *     delete:
 *       tags:
 *         - scenarios
 *       security:
 *         - cookieAuth: []
 *       summary: Create scenario
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the scenario to retrieve
 *       responses:
 *         '200':
 *           description: Scenario created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Scenario'
 */
async function deleteScenario (req: express.Request<{ scenario_id: number }>, res: express.Response){
    const deleted = await db.Scenarios.deleteScenario(req.params.scenario_id, req.user!) === 1;
    res.status(deleted ? 200 : 404).json({ok: deleted});
}

async function setVisual (req: express.Request<{scenario_id: number, visual_data: any}>, res: express.Response){
    const updated = await db.Scenarios.updateScenario(req.params.scenario_id, req.user!, req.body.visual_data) === 1;
    res.status(updated ? 200 : 404).json({ok: updated});
}


export default scenariosRouter;