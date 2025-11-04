import Page from './page.js';

export default class Pages {
    
    constructor(project){

        this.project = project;

        this.pages = [];

        this.init_pages();
    }
    
    init_pages(){

        if( !this.project.data.pages ) return;
        
        this.project.data.pages.forEach(page_data=>{
            this.pages.push(new Page(page_data))
        })
    }

    get_data(mode){
        return this.pages.map(i=>i.get_data(mode))
    }
    
    add(page_name){

        if( this.get_page(page_name) ) return false;

        const page = new Page({ name: page_name })

        this.pages.push(page)

        this.project.save();

        return page;
    }

    remove(page_name){

        const page = this.get_page(page_name)
        if( !page ) return false;

        this.pages.splice(this.pages.indexOf(page), 1);

        this.project.save();

        return true;
    }

    get_page(page_name){

        for( const page of this.pages ) {
            if( page.name === page_name ) return page;
        }

        return null;
    }

}