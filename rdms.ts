// import { conditionInterface, get_final_condition } from "../lib/condition"

function genRdmsSql(props: {
    table: string,
    specif_field?: string[],
    // where?: conditionInterface
}) {

    const table = props.table
    const specif_field = props.specif_field || []
    let limit_skip: string
    // const queryCondition = (get_final_condition(props.where))

    // let s = `SELECT ${specif_field.length ? specif_field.join(', ') : "*"} FROM ${table}${queryCondition ? " WHERE " + queryCondition + " " : ""}`;

    class nextMethod {
        getSyntax() {
            // return s
        }

        // 
        innerJoin() {

            return ({
                getSyntax: this.getSyntax,
                leftJoin: this.leftJoin,
                rightJoin: this.rightJoin,
                crossJoin: this.crossJoin
            })
        }
        leftJoin() {
            return ({
                getSyntax: this.getSyntax,
                innerJoin: this.innerJoin,
                rightJoin: this.rightJoin,
                crossJoin: this.crossJoin
            })
        }
        rightJoin() {
            return ({
                getSyntax: this.getSyntax,
                leftJoin: this.leftJoin,
                innerJoin: this.innerJoin,
                crossJoin: this.crossJoin
            })
        }
        crossJoin() {
            return ({
                getSyntax: this.getSyntax,
                leftJoin: this.leftJoin,
                innerJoin: this.innerJoin,
                rightJoin: this.rightJoin
            })
        }
    }
    return new nextMethod()
}

console.log(genRdmsSql({ table: 'test' }))

