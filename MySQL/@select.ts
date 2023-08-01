import { conditionInterface, get_final_condition } from "../lib/condition.js"

function genSelectSql(props: {
    table: string,
    specif_field?: string[],
    where?: conditionInterface
}) {

    const table = props?.table
    const specif_field = props?.specif_field || []
    let limit_skip: string;
    let groupBY: string;
    let having: string;
    const hasCondition = Boolean(props?.where);
    const queryCondition = hasCondition ? (get_final_condition(props?.where)) : '';

    let s = `SELECT ${specif_field?.length ? specif_field?.join(', ') : "*"} FROM ${table}${hasCondition ? " WHERE " + queryCondition + " " : ""}`;

    class nextMethod {
        getSyntax() {
            return s
        }
        limitSkip(limit: number, skip = 0) {
            limit_skip = ` LIMIT ${skip}, ${limit}`;
            s = `SELECT ${specif_field?.length ? specif_field?.join(', ') : "*"} FROM ${table}${hasCondition ? " WHERE " + queryCondition + " " : ""}${groupBY ? ' GROUP BY ' + groupBY : ''}${having ? ' HAVING ' + having + " " : ''}${limit_skip ? " " + limit_skip : ''}`;
            return {
                count: this.count,
                getSyntax: this.getSyntax,
                sort: this.sort
            }
        }
        count() {
            s = `SELECT COUNT(*) as count FROM ${table}${hasCondition ? " WHERE " + queryCondition + " " : ""}${limit_skip ? " " + limit_skip : ''}`;

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
            s = `SELECT ${specif_field?.length ? specif_field?.join(', ') : "*"} FROM ${table}${hasCondition ? " WHERE " + queryCondition + " " : ""}${groupBY ? ' GROUP BY ' + groupBY + " " : ''} ${having ? ' HAVING ' + having + " " : ''}ORDER BY ${field_column} ${limit_skip ? " " + limit_skip : ''}`;
            return {
                getSyntax: this.getSyntax
            }
        }
        having(having_condition: conditionInterface) {
            const queryCondition = (get_final_condition(having_condition))
            s = `SELECT ${specif_field?.length ? specif_field?.join(', ') : "*"} FROM ${table}${hasCondition ? " WHERE " + queryCondition + " " : ""} GROUP BY ${groupBY} HAVING ${queryCondition}`;
            having = queryCondition;

            return {
                sort: this.sort,
                limitSkip: this.limitSkip,
                getSyntax: this.getSyntax
            }
        }
        groupBY(column_name: string[]) {
            groupBY = column_name?.join(',')
            s = `SELECT ${specif_field?.length ? specif_field?.join(', ') : "*"} FROM ${table}${hasCondition ? " WHERE " + queryCondition + " " : ""} GROUP BY ${groupBY}`;
            return {
                sort: this.sort,
                limitSkip: this.limitSkip,
                having: this.having,
                getSyntax: this.getSyntax
            }
        }
    }
    return new nextMethod()
}



export default genSelectSql

