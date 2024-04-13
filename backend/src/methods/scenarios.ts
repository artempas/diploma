import express from 'express';
import {authMiddleware} from './auth';
import db from '../db';


const scenariosRouter = express.Router();
scenariosRouter.use(authMiddleware);
scenariosRouter.get('/:id(\\d+)', getScenario);
scenariosRouter.get('/all', getScenarios);
scenariosRouter.post('', createScenario);

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
async function getScenario (req: express.Request<{ id: string }>, res: express.Response) {
    const scenario = await db.Scenarios.findScenario({id: Number(req.params.id), user: req.user!});
    if (scenario) res.json({ok: true, data: scenario});
    else res.sendStatus(404).json({ok: false, error: 'Not found'});
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
 *       requestBody:
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

export default scenariosRouter;