import fs from 'fs';
import Pages from './pages.js';

export default class Project {

    constructor(file){

        this.file_path = `./data/projects/${file}`;

        this.data = JSON.parse(fs.readFileSync(this.file_path, 'utf8'))
        
        this.name = this.data.name;
        this.slug = this.data.slug;
        this.status = this.data.status ?? null;

        this.pages = new Pages(this);
    }

    get_data(mode = 'default'){

        return {
            name: this.name,
            slug: this.slug,
            status: this.status,
            pages: this.pages.get_data(mode),
        }
    }

    save(){
        
        const data = JSON.stringify(this.get_data('save'));

        fs.writeFile(this.file_path, data, err=>{
            if (err) console.error('Project file write error:', err);
        });
    }

}