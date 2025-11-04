import { WebSocketServer } from 'ws';
import { hooks, client_request } from './globals.js';

import './users/init.js';
import './projects/init.js';
import './pages/init.js';
import './components/init.js';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws)=>{

    ws.on('error', console.error);

    ws.on('message', (payload)=>{

        payload = JSON.parse(payload.toString('utf8'));

        console.log('request', { payload })

        if( payload.key ) {
            client_request.do(payload.key, { ws, data: payload.data })
        }
    });

    ws.on('close', ()=>{
        hooks.do('disconnect', { ws })
    })
    
    ws.send_client = (key, data)=>{
        ws.send(JSON.stringify({
            key, 
            data,
        }))
    }

    hooks.do('connect', { ws })
});

export function send_all(key, data = {}){
    
    const payload = JSON.stringify({
        key, 
        data,
    })

    wss.clients.forEach((client)=>{
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}