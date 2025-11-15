import fs from 'fs';

import { client_request, hooks } from '../globals.js';
import { send_all } from '../main.js';

const data_file_path = './data/users.json';

const users = get_file_data();
const active_users = [];

client_request.on('users', send_users)
client_request.on('login', login)
client_request.on('logout', logout)

hooks.on('project/get_data', add_pages_user_data)
hooks.set('user/data', get_user_data)

function login({ data }){

    if( !data?.user?.email ) return;

    const user = data.user;

    add_user(user)

    if( active_users.find(i=>i.email===user.email) ) return;

    active_users.push(user)

    send_all('login', { user })
}

function logout({ data }){

    if( !data?.user?.email ) return;

    const user = data.user;

    const index_to_remove = active_users.findIndex(i=>i.email===user.email)

    if( index_to_remove === -1 ) return;

    active_users.splice(index_to_remove, 1);

    send_all('logout', { user })
}

function send_users({ ws }){
    ws.send_client('users', {
        users: active_users
    })
}

function add_user(user){

    if( users.find(i=>i.email==user.email) ) return;

    users.push(user)

    save()
}

export function get_user_data(user_email){
    return users.find(i=>i.email==user_email);
}

function get_file_data(){
    const file_data = fs.readFileSync(data_file_path, 'utf8');
    return file_data ? JSON.parse(file_data) : [];
}

function save(){
    fs.writeFile(data_file_path, JSON.stringify(users), ()=>{});
}

function add_pages_user_data({ data, project }){

    if( !data?.pages?.length ) return;

    data.pages.forEach(page=>{

        if( !page?.assigned?.length ) return;

        const users_data = [];

        page.assigned.forEach(user=>{
            users_data.push(get_user_data(user));
        })

        page.assigned = users_data;
    })
}