import { conditionInterface, get_final_condition } from "../../lib/condition"

function genSelectSql(props: {
    table: string,
    specif_field?: string[],
    where?: conditionInterface
}) {

    const table = props.table
    const specif_field = props.specif_field || []
    let limit_skip: string
    const queryCondition = (get_final_condition(props.where))

    let s = `SELECT ${specif_field.length ? specif_field.join(', ') : "*"} FROM ${table}${queryCondition ? " WHERE " + queryCondition + " " : ""}`;

    class nextMethod {
        getSyntax() {
            return s
        }
        limitSkip(limit: number, skip = 0) {
            s += ` LIMIT ${skip}, ${limit}`;
            limit_skip = ` LIMIT ${skip}, ${limit}`;
            return {
                count: this.count,
                getSyntax: this.getSyntax,
                sort: this.sort
            }
        }
        count() {
            s = `SELECT COUNT(*) as count FROM ${table}${queryCondition ? " WHERE " + queryCondition + " " : ""}  ${limit_skip ? " " + limit_skip : ''}`;

            return {
                getSyntax: this.getSyntax
            }
        }

        sort(field: { [column_name: string]: number }) {

            const field_column = Object.entries(field).map(f => {
                const field_column = f[0]
                const asc: number = f[1]
                return `${field_column} ${(asc == 1 ? "ASC" : "DESC")}`
            }).toString()
            s = `SELECT ${specif_field.length ? specif_field.join(', ') : "*"} FROM ${table}${queryCondition ? " WHERE " + queryCondition + " " : ""} ORDER BY ${field_column} ${limit_skip ? " " + limit_skip : ''}`;
            return {
                getSyntax: this.getSyntax
            }
        }
    }
    return new nextMethod()
}

export default genSelectSql


