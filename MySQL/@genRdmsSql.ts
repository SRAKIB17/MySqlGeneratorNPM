// import { conditionInterface, get_final_condition } from "../lib/condition"

import { conditionInterface, get_final_condition, only_other_condition } from "../lib/condition";

export default function genRdmsSql(props: {
    table_list: {
        "table1": any,
        "table2": any,
        "table3"?: any,
        "table4"?: any,
    },
    specif_field: {
        "table1"?: string[],
        "table2"?: string[],
        "table3"?: string[],
        "table4"?: string[],
    },
    relation_key: {
        "on": {
            "relation": 'JOIN' | 'INNER JOIN' | 'CROSS JOIN' | 'RIGHT JOIN' | 'LEFT JOIN',
            "table1"?: string,
            "table2"?: string,
            "table3"?: string,
            "table4"?: string,
        },
        "on1"?: {
            "relation": 'JOIN' | 'INNER JOIN' | 'CROSS JOIN' | 'RIGHT JOIN' | 'LEFT JOIN',
            "table1"?: string,
            "table2"?: string,
            "table3"?: string,
            "table4"?: string,
        },
        "on2"?: {
            "relation": 'JOIN' | 'INNER JOIN' | 'CROSS JOIN' | 'RIGHT JOIN' | 'LEFT JOIN',
            "table1"?: string,
            "table2"?: string,
            "table3"?: string,
            "table4"?: string,
        },
    }
    where: {
        "table1"?: conditionInterface,
        "table2"?: conditionInterface,
        "table3"?: conditionInterface,
        "table4"?: conditionInterface,
    }
}) {

    const table_list = props.table_list;
    const table_length = Object.values(table_list).length

    const relation_key = props.relation_key;
    const specif_field = Object.entries(props?.specif_field).map((sf) => {
        const table = sf?.[0]
        const column = sf?.[1]?.map(clm => {
            return `${table_list[table]}.${clm}`
        })
        return column
    }).flat().join(', ');


    const relationWithTable = Object.entries(relation_key).map((r_key) => {
        const relationRdms = r_key[1]
        const { relation, ...onCondition } = relationRdms;
        let relationTable;
        const getCondition = Object.entries(onCondition).map((rdmsTable) => {
            const aliasesTable = rdmsTable[0]
            if (!relationTable) relationTable = aliasesTable

            const column = rdmsTable[1]
            return `${table_list[aliasesTable]}.${column}`
        }).join(' = ')
        return `${relation} ${relationTable} ON ${getCondition}`
    }).slice(0, table_length - 1).join('\n')


    // jodi contidion pass na kori tahele shudu faka string pass korlei hobe
    const condition = Object.entries(props?.where).map((whr) => {
        const table = whr[0]
        const condition = whr[1]
        return get_final_condition(condition, table_list[table])
    }).join(' AND ')


    let sql = `SELECT ${(!Object.keys(props.specif_field).length) ? "*" : specif_field} FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""}`

    let limit_skip: string


    class nextMethod {
        getSyntax() {
            return sql?.trim()
        }
        limitSkip(limit: number, skip = 0) {
            sql += ` LIMIT ${skip}, ${limit}`;
            limit_skip = ` LIMIT ${skip}, ${limit}`;
            return {
                count: this.count,
                getSyntax: this.getSyntax,
                sort: this.sort
            }
        }
        count() {
            sql = `SELECT COUNT(*) as count FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""} ${limit_skip ? " " + limit_skip : ''}`
            return {
                getSyntax: this.getSyntax
            }
        }

        sort(field: {
            table1?: [string, 0 | 1],
            table2?: [string, 0 | 1],
            table3?: [string, 0 | 1],
            table4?: [string, 0 | 1],

        }) {
            const field_column = Object.entries(field).map(f => {
                const field_column = f[0]
                const asc = f[1]
                console.log(asc)

                return `${table_list[field_column]}.${asc[0]} ${(asc[1] == 1 ? "ASC" : "DESC")}`
            }).toString()
            sql = `SELECT ${(!Object.keys(props.specif_field).length) ? "*" : specif_field} FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""}${Object.values(field).length ? ' ORDER BY ' + field_column : ''} ${limit_skip ? " " + limit_skip : ''}`
            // ORDER BY table1.column_to_sort
            return {
                getSyntax: this.getSyntax
            }
        }
    }
    return new nextMethod()
}


