import fs from 'fs';
import { hooks, client_request } from '../globals.js';

const projects = [];

hooks.on('init', init_projects)
hooks.set('project', get_project)
client_request.on('projects', send_projects)

function get_project(slug){
    return projects.find(i=>i.data.slug===slug);
}

function send_projects({ ws }){
    ws.send_client('projects', {
        projects: projects.map(project=>{
            return {
                name: project.data.name,  
                slug: project.data.slug,
            }
        })
    })
}

function init_projects(){
    for( const file of fs.readdirSync('./data/projects') ) {
        const project = hooks.get('project/init', file)
        projects.push(project)
    }
}