import { users } from '../users/init.js';

export default class Page {
    
    constructor(data){
        this.name = data.name;
        this.status = data.status ?? null;
        this.assigned = data.assigned ?? [];
    }

    get_data(mode = 'defualt'){

        return {
            name: this.name,
            status: this.status,
            assigned: mode === 'save' ? this.assigned : this.get_assigned_data(),
        }
    }

    get_assigned_data(){

        const data = [];

        for( const user_email of this.assigned ) {
            data.push(users.get_user_data(user_email));
        }

        return data;
    }

    assign(user){
        this.assigned = [user]
    }

}