import { hooks, client_request } from '../globals.js';
import { send_all } from '../main.js';
import { generate_id } from '../lib/utils.js';

client_request.on('page/add', page_add)
client_request.on('page/remove', page_remove)
client_request.on('page/assign', page_assign)

function page_add({data}){

    const project = hooks.get('project', data.project_id)
    if( !project ) return;
    
    const page = {
        id: generate_id(data.page_name, project.pages),
        name: data.page_name,
        status: null,
        assigned: [],
        components: [],
    };

    project.pages.push(page)

    hooks.do('project/save', project)

    data.page = page;

    send_all('page/add', data)
}

function page_remove({data}){

    const project = hooks.get('project', data.project_id)
    if( !project ) return;
    
    const index = project.pages.findIndex(i=>i.id===data.page_id)
    if( index === -1 ) return;

    project.pages.splice(index, 1);

    hooks.do('project/save', project)
    
    send_all('page/remove', data)
}

function page_assign({data}){

    const project = hooks.get('project', data.project_id)
    if( !project ) return;

    const page = project.pages.find(i=>i.id===data.page_id)
    if( !page ) return;
    
    const user_email = data.user;
    page.assigned = [user_email];

    hooks.do('project/save', project)

    data.user_data = hooks.get('user/data', user_email);
    
    send_all('page/assign', data)
}