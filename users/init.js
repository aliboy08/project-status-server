import Users from './users.js';
import { client_request } from '../globals.js';
import { send_all } from '../main.js';

export const users = new Users();

client_request.add('login', ({ data })=>{

    const user = data.user;

    if ( !users.login(user) ) return;

    send_all('login', { user })
})

client_request.add('logout', ({ data })=>{

    const user = data.user;

    if ( !users.logout(user) ) return;

    send_all('logout', { user })
})

client_request.add('users', ({ ws })=>{
    ws.send_client('users', { users: users.active_users })
})