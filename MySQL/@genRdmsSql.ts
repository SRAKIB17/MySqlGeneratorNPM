// import { conditionInterface, get_final_condition } from "../lib/condition"

import { conditionInterface, get_final_condition, only_other_condition } from "../lib/condition";

export default function genRdmsSql(props: {
    table_list: {
        "table1": any,
        "table2": any,
        "table3"?: any,
        "table4"?: any,
        "table5"?: any,
        "table6"?: any,
    },
    specific_field: {
        "table1"?: string[],
        "table2"?: string[],
        "table3"?: string[],
        "table4"?: string[],
        "table5"?: string[],
        "table6"?: string[],
    },
    relation_key: {
        "on": {
            "relation": 'JOIN' | 'INNER JOIN' | 'CROSS JOIN' | 'RIGHT JOIN' | 'LEFT JOIN',
            "table1"?: string,
            "table2"?: string,
            "table3"?: string,
            "table4"?: string,
            "table5"?: string,
            "table6"?: string,
        },
        "on1"?: {
            "relation": 'JOIN' | 'INNER JOIN' | 'CROSS JOIN' | 'RIGHT JOIN' | 'LEFT JOIN',
            "table1"?: string,
            "table2"?: string,
            "table3"?: string,
            "table4"?: string,
            "table5"?: string,
            "table6"?: string,
        },
        "on2"?: {
            "relation": 'JOIN' | 'INNER JOIN' | 'CROSS JOIN' | 'RIGHT JOIN' | 'LEFT JOIN',
            "table1"?: string,
            "table2"?: string,
            "table3"?: string,
            "table4"?: string,
            "table5"?: string,
            "table6"?: string,
        },
        "on3"?: {
            "relation": 'JOIN' | 'INNER JOIN' | 'CROSS JOIN' | 'RIGHT JOIN' | 'LEFT JOIN',
            "table1"?: string,
            "table2"?: string,
            "table3"?: string,
            "table4"?: string,
            "table5"?: string,
            "table6"?: string,
        },
        "on4"?: {
            "relation": 'JOIN' | 'INNER JOIN' | 'CROSS JOIN' | 'RIGHT JOIN' | 'LEFT JOIN',
            "table1"?: string,
            "table2"?: string,
            "table3"?: string,
            "table4"?: string,
            "table5"?: string,
            "table6"?: string,
        },
    }
    where: {
        "table1"?: conditionInterface,
        "table2"?: conditionInterface,
        "table3"?: conditionInterface,
        "table4"?: conditionInterface,
        "table5"?: conditionInterface,
        "table6"?: conditionInterface,
    }
}) {

    const table_list = props.table_list;
    const table_length = Object.values(table_list)?.length

    const relation_key = props.relation_key;
    const specif_field = Object.entries(props?.specific_field).map((sf) => {
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
            if (aliasesTable !== 'table1') relationTable = table_list[aliasesTable]
            const column = rdmsTable[1]
            return `${table_list[aliasesTable]}.${column}`
        }).join(' = ')
        return `${relation} ${relationTable} ON ${getCondition}`
    })?.slice(0, table_length - 1)?.join('\n')

    // Jodi condition pass na kori tahele shudu faka string pass korlei hobe
    let tableOperator
    let condition = Object.entries(props?.where).map((whr) => {

        const table = whr[0]
        let condition = whr[1];

        return Object.entries(condition)?.map((check, index) => {
            const and_or = check?.[0];
            tableOperator = and_or;
            const againCondition = check?.[1];

            if (and_or?.toLowerCase().includes('$and') || and_or?.toLowerCase()?.includes('$or')) {
                return `(${only_other_condition(againCondition, '', (and_or == '$or' ? ' OR ' : " AND "), table_list[table])})`
            }
            else {
                return `(${get_final_condition({ [and_or]: againCondition }, table_list[table])})`
            }
        })?.join(' AND ')
    }).join(tableOperator?.includes('$or') ? ' OR ' : " AND ")


    let sql = `SELECT ${(!Object.keys(props.specific_field).length) ? "*" : specif_field} FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""}`

    let limit_skip: string;
    let groupBY: string;
    let having: string;

    class nextMethod {
        getSyntax() {
            return sql?.trim()
        }
        limitSkip(limit: number, skip = 0) {
            limit_skip = ` LIMIT ${skip}, ${limit}`;
            sql = `SELECT ${(!Object.keys(props.specific_field).length) ? "*" : specif_field} FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""}${groupBY ? ' GROUP BY ' + groupBY : ''}${having ? ' HAVING ' + having + " " : ''}${limit_skip ? " " + limit_skip : ''}`

            return {
                count: this.count,
                getSyntax: this.getSyntax,
                sort: this.sort,
                sum: this.sum,
                max: this.max,
                min: this.min
            }
        }
        count() {
            sql = `SELECT COUNT(*) as count FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""} ${limit_skip ? " " + limit_skip : ''}`
            return {
                getSyntax: this.getSyntax
            }
        }

        sum(statement: string) {
            sql = `SELECT sum(${statement}) as summation FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""} ${groupBY ? ' GROUP BY ' + groupBY : ''}${having ? ' HAVING ' + having + " " : ''}${limit_skip ? " " + limit_skip : ''}`
            return {
                getSyntax: this.getSyntax
            }
        }

        max(statement: string) {
            sql = `SELECT max(${statement}) as maximum FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""} ${groupBY ? ' GROUP BY ' + groupBY : ''}${having ? ' HAVING ' + having + " " : ''}${limit_skip ? " " + limit_skip : ''}`
            return {
                getSyntax: this.getSyntax
            }
        }

        min(statement: string) {
            sql = `SELECT max(${statement}) as minimum FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""} ${groupBY ? ' GROUP BY ' + groupBY : ''}${having ? ' HAVING ' + having + " " : ''}${limit_skip ? " " + limit_skip : ''}`
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
                return `${table_list[field_column]}.${asc[0]} ${(asc[1] == 1 ? "ASC" : "DESC")}`
            }).toString()
            sql = `SELECT ${(!Object.keys(props.specific_field).length) ? "*" : specif_field} FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""}${groupBY ? ' GROUP BY ' + groupBY : ''}${having ? ' HAVING ' + having + " " : ''}${Object.values(field).length ? ' ORDER BY ' + field_column : ''} ${limit_skip ? " " + limit_skip : ''}`
            return {
                getSyntax: this.getSyntax
            }
        }
        having(having_condition: conditionInterface) {
            const queryCondition = (get_final_condition(having_condition));
            having = queryCondition;
            sql = `SELECT ${(!Object.keys(props.specific_field).length) ? "*" : specif_field} FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""}${groupBY ? ' GROUP BY ' + groupBY : ''}${having ? ' HAVING ' + having + " " : ''}`

            return {
                sort: this.sort,
                limitSkip: this.limitSkip,
                getSyntax: this.getSyntax,
                sum: this.sum,
                max: this.max,
                min: this.min
            }
        }
        groupBY(column_name: string[]) {
            groupBY = column_name?.join(',')
            sql = `SELECT ${(!Object.keys(props.specific_field).length) ? "*" : specif_field} FROM ${table_list.table1} ${relationWithTable}${condition ? " WHERE " + condition + " " : ""}${groupBY ? ' GROUP BY ' + groupBY : ''}`
            return {
                sort: this.sort,
                limitSkip: this.limitSkip,
                having: this.having,
                getSyntax: this.getSyntax,
                sum: this.sum,
                max: this.max,
                min: this.min
            }
        }

    }
    return new nextMethod()
}


// const searchProductSql = genRdmsSql({
//     table_list: {
//         table1: 'products',
//         table2: "product_categories",
//         table3: 'product_reviews',
//         table4: 'vendor_details'
//     },
//     relation_key: {
//         on: {
//             relation: 'LEFT JOIN',
//             table1: 'categoryID',
//             table2: 'categoryID'
//         },
//         on1: {
//             table1: 'productID',
//             relation: 'LEFT JOIN',
//             table3: 'productID'
//         },
//         on2: {
//             table1: 'vendorID',
//             relation: 'LEFT JOIN',
//             table4: 'vendorID'
//         }
//     },
//     specif_field: {
//         table1: ['*'],
//         table2: ['*, SUM(rating) / count(rating) as rating, count(userID) as totalReviews'],
//         table4: ['vendorID', 'vendorLogo', 'shopName', 'membershipLevel as vendorMembershipLevel', 'userName'],
//     },
//     where: {
//         table1: {
//             $or: {
//                 $pattern: {
//                     $or: {
//                         title: {
//                             $both: "query"
//                         },
//                         brand: {
//                             $both: "query"
//                         },
//                         description: {
//                             $both: "query"
//                         },
//                         categoryID: {
//                             $both: "query"
//                         },
//                         fullDescription: {
//                             $both: "query"
//                         },
//                         subCategoryID: {
//                             $both: "query"
//                         },
//                         tags: {
//                             $both: "query"
//                         },
//                     }
//                 }
//             }
//         },
//         table2: {
//             $or: {
//                 $pattern: {
//                     category: {
//                         $both: "query"
//                     },
//                 }
//             }
//         },
//         table4: {
//             $or: {
//                 $pattern: {
//                     $or: {
//                         shopName: {
//                             $both: "query"
//                         },
//                         userName: {
//                             $both: "query"
//                         },
//                     }
//                 }
//             }
//         }
//     },

// }).getSyntax();


// console.log(searchProductSql)