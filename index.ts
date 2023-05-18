import genSelectSql from "./SQL/MySQL/@select"
import genInsertSql from "./SQL/MySQL/@insert"
import genUpdateSql from "./SQL/MySQL/@update"
import genDeleteSql from "./SQL/MySQL/@delete"

class SqlGenerator {
    db: 'mysql'
    genDeleteSql: any
    genSelectSql: any;
    genInsertSql: any;
    genUpdateSql: any;

    constructor({ db }) {
        this.db = db
        if (this.db == 'mysql') {
            this.genSelectSql = genSelectSql
            this.genInsertSql = genInsertSql;
            this.genUpdateSql = genUpdateSql;
            this.genDeleteSql = genDeleteSql
        }
    }
}


export default SqlGenerator
