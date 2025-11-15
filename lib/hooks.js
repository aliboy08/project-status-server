export default class Hooks {

    constructor(){
        this.init();
    }

    init(){
        this.actions = {};
        this.queue = {};
        this.getters = {};
    }

    on(action_name, fn, options = {}){

        if( typeof fn !== 'function' ) return;

        const priority = options.priority ?? 10;

        const action = {
            fn,
            priority,
            once: options.once ?? false,
        }

        if( !this.actions[action_name] ) {
            this.actions[action_name] = {};
        }

        if( !this.actions[action_name][priority] ) {
            this.actions[action_name][priority] = [];
        }

        this.actions[action_name][priority].push(action);
    }

    do(action_name, args){

        if( !this.actions[action_name] ) return;

        for( const priority in this.actions[action_name] ) {
            
            const actions = this.actions[action_name][priority];

            actions.forEach(action=>{

                action.fn(args)

                if( action.once ) {
                    actions.splice(actions.indexOf(action), 1);
                }
            })
        }
    }

    set(key, fn, options = {}){

        if( typeof fn !== 'function' ) return;

        if( !this.getters[key] ) {
            this.getters[key] = {};
        }
        
        const priority = options.priority ?? 10;

        const getter = {
            fn,
            priority,
            once: options.once ?? false,
        }

        if( !this.getters[key][priority] ) {
            this.getters[key][priority] = [];
        }
        
        this.getters[key][priority].push(getter);
    }

    get(key, value = null, args = null){
        
        if( !this.getters[key] ) return value;
        
        for( const priority in this.getters[key] ) {

            const getters = this.getters[key][priority];

            for( const getter of getters ) {

                value = getter.fn(value, args)

                if( getter.once ) {
                    getters.splice(getters.indexOf(getter), 1);
                }

            }
            
        }
        
        return value;
    }

    clear( options = null ){

        if( !options ) {
            return this.init();
        }

        if( options.action ) {
            this.actions[options.action] = {};
        }

        if( options.queue ) {
            this.queue[options.queue] = {};
        }

        if( options.getter ) {
            this.getters[options.getter] = {};
        }

    }

    on_queue(action_name, fn){

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

}