import {Router} from 'express';
import db from '../db';
import LimitedAdapter from './limiter';
const adapterRouter = Router();

adapterRouter.post('/:connector_id(\\d+)',
    async (req, res) => {
        const connector = (await db.Connectors.findConnectors({
            id: Number(req.params.connector_id)
        }, {
            scenario: true
        }))[0];
        if (!connector)
            return res.status(404).send('Connector not found');
        try {
            await LimitedAdapter.getInstance().handleWebhook(connector, req.body);
        } catch (e: any){
            if (e.name === 'UnsupportedMessageError'){
                console.info(e);
            } else
                console.error(e);
        }
        res.send('OK');
    });

export default adapterRouter;