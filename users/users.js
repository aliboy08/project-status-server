import fs from 'fs';

const data_file_path = './data/users.json';

export default class Users {

    constructor(){

        this.active_users = [];

        this.all_users = get_file_data();
    }

    login(user){

        if( !user?.email ) return false;

        this.add_user(user)

        if( this.active_users.find(i=>i.email===user.email) ) return false;

        this.active_users.push(user)

        return true;
    }

    logout(user){

        if( !user?.email ) return false;

        const index_to_remove = this.active_users.findIndex(i=>i.email===user.email)

        if( index_to_remove === -1 ) return false;

        this.active_users.splice(index_to_remove, 1);

        return true;
    }

    get_user_data(user_email){
        return this.all_users.find(i=>i.email==user_email);
    }

    add_user(user){

        if( this.all_users.find(i=>i.email==user.email) ) return;

        this.all_users.push(user)
        
        save_file_data(this.all_users)
    }
}

function get_file_data(){
    const file_data = fs.readFileSync(data_file_path, 'utf8');
    return file_data ? JSON.parse(file_data) : [];
}

function save_file_data(data){
    fs.writeFile(data_file_path, JSON.stringify(data), ()=>{});
}