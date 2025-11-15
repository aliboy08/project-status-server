import fs from 'fs';
import Hooks from '../lib/hooks.js';
import { hooks, client_request } from '../globals.js';

client_request.on('project', send_project)
hooks.set('project/init', init_project)

function send_project({ data, ws }){
    const project = hooks.get('project', data.slug)
    if( !project ) return;
    ws.send_client('project', {
        project: project.get_data()
    })
}

function init_project(file){

    const file_path = `./data/projects/${file}`;

    const data = JSON.parse(fs.readFileSync(file_path, 'utf8'));
    data.status = data.status ?? null;
    
    const project = {
        data,
        hooks: new Hooks(),
    }

    project.get_data = ()=>{
        // const data = project.data;
        // const project_data = {...project.data};
        const data = structuredClone(project.data)
        // project.hooks.do('data/get', data)
        hooks.do('project/get_data', {data, project})
        return data;
    }

    project.save = ()=>{

        const data = project.data;
        project.hooks.do('data/save', data)

        fs.writeFile(file_path, JSON.stringify(data), err=>{
            if (err) console.error('project save error:', err);
        });
    };

    hooks.do('project/init', project)

    return project;
}
