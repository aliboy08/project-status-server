import fs from 'fs';
import { hooks, client_request } from '../globals.js';

const projects = [];

client_request.on('projects', send_projects)
client_request.on('project', send_project)

hooks.on('init', init_projects)
hooks.on('project/save', save_project)
hooks.set('project', get_project)

function send_project({ data, ws }){
    const project = hooks.get('project', data.project_id)
    if( !project ) return;
    ws.send_client('project', {
        project: project.get_data()
    })
}

function send_projects({ ws }){
    ws.send_client('projects', {
        projects: projects.map(project=>{
            return {
                id: project.id,
                name: project.name,
            }
        })
    })
}

function init_projects(){
    
    for( const file of fs.readdirSync('./data/projects') ) {

        const file_path = `./data/projects/${file}`;

        const project = JSON.parse(fs.readFileSync(file_path, 'utf8'));

        if( typeof project.pages === 'undefined' ) {
            project.pages = [];
        }

        if( typeof project.status === 'undefined' ) {
            project.status = null;
        }
        
        hooks.do('project/init', project)
        
        projects.push(project)
    }
}

function save_project(project){
    
    if( typeof project === 'string' ) {
        project = hooks.get('project', project)
    }

    hooks.do('project/save/data', project)

    const file_path = `./data/projects/${project.id}.json`;

    fs.writeFile(file_path, JSON.stringify(project), err=>{
        if (err) console.error('project save error:', err);
    });
}

function get_project(project_id){
    return projects.find(i=>i.id===project_id);
}