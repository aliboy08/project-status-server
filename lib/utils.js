export function generate_id(input, arr = null){

    const id = input.toLowerCase().replaceAll(' ', '_');

    if( arr ) {
        if( arr.find(i=>i.id===id) ) {
            return id+'_'+generate_random_chars(5);
        }
    }

    return id;
}

export function generate_random_chars(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}