export default class Hooks {

    constructor(){
        this.init();
    }

    init(){
        this.actions = {};
        this.filters = {};
        this.single_actions = {};
        this.queue = {};
    }
    
    add(action_name, fn, priority = 10, once = false){

        if( typeof fn !== 'function' ) return;

        if( once ) {
            fn.once = true;
        }
 
        if( !this.actions[action_name] ) {
            this.actions[action_name] = {};
        }

        if( typeof this.actions[action_name][priority] === 'undefined' ) {
            this.actions[action_name][priority] = [];
        }

        this.actions[action_name][priority].push(fn);
    }

    do(action_name, args){

        this.do_single(action_name, args);

        if( !this.actions[action_name] ) return;

        for( const priority in this.actions[action_name] ) {
            const actions = this.actions[action_name][priority];
            actions.forEach((fn)=>{
                fn(args)
                this.remove_once_action(fn, actions);
            })
        }
    }

    add_action(action_name){
        this.actions[action_name] = {};
    }

    add_filter(filter_name, fn, priority = 10){

        if( !this.filters[filter_name] ) {
            this.filters[filter_name] = {};
        }

        if( !this.filters[filter_name][priority] ) {
            this.filters[filter_name][priority] = [];
        }
        
        this.filters[filter_name][priority].push(fn);
    }

    apply_filters(filter_name, value, args){

        if( !this.filters[filter_name] ) return value;

        for( const priority in this.filters[filter_name] ) {
            for( const fn of this.filters[filter_name][priority] ) {
                value = fn(value, args)
            }
        }
        return value;
    }

    clear(action_name = null){

        if( action_name ) {
            // single
            if( !this.actions[action_name] ) return;
            this.actions[action_name] = {};
        } else {
            this.init();
        }
    }

    add_single(action_name, key, fn){

        if( !this.single_actions[action_name] ) {
            this.single_actions[action_name] = {};
        }
        
        this.single_actions[action_name][key] = fn;
    }
    
    do_single(action_name, args){

        if( !this.single_actions[action_name] ) return;
        
        for( const key in this.single_actions[action_name] ) {
            this.single_actions[action_name][key](args);
        }
    }

    add_queue(action_name, fn){

        if( !this.queue[action_name] ) {
            this.queue[action_name] = {
                actions: []
            }
        }
        
        if( this.queue[action_name].actions.indexOf(fn) === -1 ) {
            this.queue[action_name].actions.push(fn)
        }

        const queue = this.queue[action_name]

        if( queue?.run ) {
            fn(queue.args);
        }
    }
    
    do_queue(action_name, args){

        if( !this.queue[action_name] ) {
            this.queue[action_name] = {
                actions: [],
            }
        }
        
        this.queue[action_name].run = true;
        this.queue[action_name].args = args;

        if( this.queue[action_name].actions.length ) {
            this.queue[action_name].actions.forEach(fn=>fn(args))
        }
    }

    remove_once_action(fn, actions){
        if( !fn?.once ) return;
        actions.splice(actions.indexOf(fn), 1);
    }

}