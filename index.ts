import find from "./@select/index"
import insert from "./@insert"
import update from './@update'
import deleteQ from './@delete'

class SqlGenerator {
    db: 'mysql'
    find: any
    insert: any;
    update: any;
    deleteQ: any;

    constructor({ db }) {
        this.db = db
        if (this.db == 'mysql') {
            this.find = find
            this.insert = insert;
            this.update = update;
            this.deleteQ = deleteQ
        }
    }
}


export default SqlGenerator
