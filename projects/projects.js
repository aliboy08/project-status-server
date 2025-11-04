import fs from 'fs';
import Project from './project.js';

export default class Projects {

    constructor(){

        this.projects = [];

        for( const file of fs.readdirSync('./data/projects') ) {
            this.projects.push(new Project(file));
        }
    }

    get_projects_overview(){

        const projects = [];

        this.projects.forEach(project=>{
            projects.push({
                name: project.data.name,
                slug: project.data.slug,
            })
        })

        return projects;
    }

    get_project(slug){
        return this.projects.find(i=>i.data.slug===slug);
    }

    get_project_data(slug){
        const project = this.get_project(slug)
        if( !project ) return null;
        return project.get_data();
    }
    
}