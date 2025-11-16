import { hooks, client_request } from '../globals.js';
import { send_all } from '../main.js';
import { generate_id } from '../lib/utils.js';

client_request.on('component/add', component_add)
client_request.on('component/remove', component_remove)
client_request.on('component/assign', component_assign)

function component_add({data}){

    const project = hooks.get('project', data.project_id)
    if( !project ) return;

    const page = project.pages.find(i=>i.id===data.page_id)
    if( !page ) return;
    
    const component = {
        id: generate_id(data.component_name, page.components),
        name: data.component_name,
        status: null,
        assigned: [],
    };

    page.components.push(component)

    data.component = component;

    send_all('component/add', data)
}

function component_remove({data}){

    const project = hooks.get('project', data.project_id)
    if( !project ) return;

    const page = project.pages.find(i=>i.id===data.page_id)
    if( !page ) return;

    const index = page.components.findIndex(i=>i.id===data.component_id)
    if( index === -1 ) return;

    page.components.splice(index, 1);

    hooks.do('project/save', project)

    send_all('component/remove', data)
}

function component_assign({data}){
    
    const project = hooks.get('project', data.project_id)
    if( !project ) return;

    const page = project.pages.find(i=>i.id===data.page_id)
    if( !page ) return;
    
    const component = page.components.find(i=>i.id===data.component_id)
    if( !component ) return;

    const user_email = data.user;
    component.assigned = [user_email];

    hooks.do('project/save', project)

    data.user_data = hooks.get('user/data', user_email);
    
    send_all('component/assign', data)
}