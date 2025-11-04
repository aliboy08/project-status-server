import { client_request } from '../globals.js';
import { send_all } from '../main.js';
import Projects from './projects.js';

const projects = new Projects();

client_request.add('projects', ({ ws })=>{
    ws.send_client('projects', { projects: projects.get_projects_overview() })
})

client_request.add('project', ({ data, ws })=>{
    ws.send_client('project', { project: projects.get_project_data(data.slug) })
})

client_request.add('project/page/add', ({ data })=>{

    const project = projects.get_project(data.project_slug);
    if( !project ) return;

    data.page_data = project.pages.add(data.page_name);

    send_all('project/page/add', data)
})

client_request.add('project/page/remove', ({ data })=>{

    const project = projects.get_project(data.project_slug);
    if( !project ) return;
    
    if( !project.pages.remove(data.page_name) ) return;

    send_all('project/page/remove', data)
})

client_request.add('project/page/assign', ({ data })=>{

    const project = projects.get_project(data.project_slug);
    if( !project ) return;

    const page = project.pages.get_page(data.page_name);
    if( !page ) return;

    page.assign(data.user)

    data.page = page.get_data();

    project.save();

    send_all('project/page/assign', data)
})