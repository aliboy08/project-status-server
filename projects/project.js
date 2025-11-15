import fs from 'fs';
import Hooks from '../lib/hooks.js';
import { hooks, client_request } from '../globals.js';

client_request.on('project', send_project)
hooks.set('project/init', init_project)

function send_project({ data, ws }){
    const project = hooks.get('project', data.slug)
    if( !project ) return;
    ws.send_client('project', { project: project.data })
}

function init_project(file){

    const file_path = `./data/projects/${file}`;

    const data = JSON.parse(fs.readFileSync(file_path, 'utf8'));
    data.status = data.status ?? null;
    
    const project = {
        data,
        hooks: new Hooks(),
    }

    const get_data = ()=>{
        const data = project.data;
        project.hooks.do('data', data)
        return data;
    }

    const save = ()=>{
        fs.writeFile(file_path, JSON.stringify(project.get_data()), err=>{
            if (err) console.error('project save error:', err);
        });
    }

    project.get_data = get_data;
    project.save = save;

    hooks.do('project/init', project)

    return project;
}
