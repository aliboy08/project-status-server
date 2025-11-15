import { hooks, client_request } from '../globals.js';
import { send_all } from '../main.js';
import { generate_id } from '../lib/utils.js';

hooks.on('project/init', init_pages)
client_request.on('page/add', page_add)
client_request.on('page/remove', page_remove)
client_request.on('page/assign', page_assign)

function init_pages(project){

    project.pages = [];

    if( !project.data.pages ) return;

    project.add_page = (page_name)=>{

        const page_data = {
            id: generate_id(page_name, project.pages),
            name: page_name,
            status: null,
            assigned: [],
        };

        init_page(page_data, project)
    }

    project.get_page = (page_id)=>{        
        return project.pages.find(i=>i.id===page_id)
    }

    project.data.pages.forEach(page_data=>{
        init_page(page_data, project)
    })

    project.hooks.on('data', data=>{
        data.pages = project.pages.map(page=>page.data)
    })
}

function init_page(page_data, project){

    const remove = ()=>{
        const index = project.pages.findIndex(page);
        project.pages.splice(index, 1);
        project.save();
    }

    const assign = (user_email)=>{
        page.data.assigned = [user_email];
        project.save();
    }

    const page = {
        id: page_data.id,
        data: page_data,
        remove,
        assign,
    }
    
    project.pages.push(page)
}

function page_add({ data }){

    const project = hooks.get('project', data.project_slug)
    if( !project ) return;

    const page = {
        id: generate_id(data.page_name, project.pages),
        name: data.page_name,
        status: null,
        assigned: [],
    };

    project.pages.push(page);

    data.page_data = page;

    send_all('page/add', data)
    
    project.save();
}

function page_remove({ data }){

    const project = hooks.get('project', data.project_slug)
    if( !project ) return;
    
    const page = project.get_page(data.page_id)
    if( !page ) return;

    page.remove();

    send_all('page/remove', data)
}

function page_assign({ data }){

    const project = hooks.get('project', data.project_slug)
    if( !project ) return;

    const page = project.get_page(data.page_id)
    if( !page ) return;

    page.assign(data.user)

    send_all('page/assign', data)
}