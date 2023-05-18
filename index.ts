import genSelectSql from "./MySQL/@select"
import genInsertSql from "./MySQL/@insert"
import genUpdateSql from "./MySQL/@update"
import genDeleteSql from "./MySQL/@delete"

class MySqlGeneratorMain {
    genDeleteSql: any
    genSelectSql: any;
    genInsertSql: any;
    genUpdateSql: any;

    constructor() {
        this.genSelectSql = genSelectSql
        this.genInsertSql = genInsertSql;
        this.genUpdateSql = genUpdateSql;
        this.genDeleteSql = genDeleteSql
    }
}
const MySqlGenerator = new MySqlGeneratorMain()
export default MySqlGenerator
