import express from 'express';
import {authMiddleware} from './auth';
import db from '../db';


const scenariosRouter = express.Router();
scenariosRouter.use(authMiddleware);
scenariosRouter.get('/:id(^\\d+$)', getScenario);
scenariosRouter.get('/all', getScenarios);

/**
 *  @openapi
 *   /scenario/all:
 *     get:
 *       summary: Retrieve all scenarios
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
 *       summary: Retrieve a specific scenario
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
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Scenario'
 *
 */
async function getScenarios (req: express.Request, res: express.Response){
    const scenarios = await db.Scenarios.findScenarios({ user: req.user!});
    res.json({ok: true, data: scenarios});
}

export default scenariosRouter;