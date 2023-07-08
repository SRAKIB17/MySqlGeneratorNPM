
interface AndOrCondition {
    "="?: number | string,
    ">"?: number | string,
    "<"?: number | string,
    ">="?: number | string,
    "<="?: number | string,
    "!="?: number | string,
    "$include"?: {
        [field_name: string]: string[] | number[] | any[],
        "$or"?: any,
        "$and"?: any
    },
    "$not_include"?: {
        [field_name: string]: string[] | number[] | any[],
        "$or"?: any,
        "$and"?: any
    },
    "$pattern"?: {
        [field_name: string]: {
            "$start"?: string | number,
            "$end"?: string | number,
            "$both"?: string | number,
        } | any,
        "$or"?: any,
        "$and"?: any
    },
    "$not_pattern"?: {
        [field_name: string]: {
            "$start"?: string | number,
            "$end"?: string | number,
            "$both"?: string | number,
        } | any,
        "$or"?: any,
        "$and"?: any
    },
    "$between"?: {
        [field_name: string]: {
            "$from": string | number,
            "$to": string | number,
        } | any,
        "$or"?: any,
        "$and"?: any
    },
    [field_name: string]: any
}


export interface conditionInterface {
    $or?: AndOrCondition,
    $and?: AndOrCondition,
    [field_name: string]: string | any | AndOrCondition
}

const simpleOperatorCheck = (operator: any) => {

    const value = operator.toLowerCase()
    switch (value) {
        case '$eq':
            return '='
            break;
        case '$gt':
            return '>'
            break;
        case '$lt':
            return '<'
            break;
        case 'gte':
            return '>='
            break;
        case '$lte':
            return '<='
            break;
        case '$not_eq':
            return '!='
            break;
        default:
            return operator
            break;
    }
}



export const only_other_condition = (value: any, pre_field = '', condition = '', rdmsTable = '') => {

    const checkRdmsTable = rdmsTable ? ` ${rdmsTable}.` : ''

    const or = Object.keys(value).includes('$or')
    return Object.entries(value).map((c, index, arr) => {
        const field = c[0]
        const value: any = c[1]
        const check_separator = ['$eq', '$gt', '$lt', '$lte', '$gte', '$not_eq', "=", ">", "<", ">=", "<=", "!="]
        const special_operator = ['$between', '$include', '$not_include', '$pattern', '$not_pattern']
        if (special_operator.includes(field.toLowerCase())) {

            const include = (value, method = '') => {
                return Object.entries(value).map(inc => {
                    const include_field = inc[0]
                    const include_value = inc[1]
                    if (include_field.toLowerCase() == '$or' || include_field.toLowerCase() == '$and') {
                        return include(include_value, method)
                    }
                    else {
                        return "(" + (checkRdmsTable + include_field) + (method == 'not' ? " NOT IN " : " IN ") + `(${JSON.stringify(include_value).slice(1, -1)}))`
                    }
                }).join(`${"$or" in value ? ' OR ' : " AND "}`)
            }
            const pattern = (value, method = '') => {
                return Object.entries(value).map(inc => {
                    const pattern_field = inc[0]
                    const pattern_value: any = inc[1]
                    if (pattern_field.toLowerCase() == '$or' || pattern_field.toLowerCase() == '$and') {
                        return pattern(pattern_value, method)
                    }
                    else {
                        let matchPattern = `${checkRdmsTable + pattern_field} ${method == 'not' ? "NOT LIKE" : "LIKE"} `
                        const check = Object.entries(pattern_value)[0] || ''

                        switch (check[0]) {
                            case '$end':
                                matchPattern += JSON.stringify('%' + check[1])
                                break;
                            case '$start':
                                matchPattern += JSON.stringify(check[1] + '%')
                                break;
                            case '$both':
                                matchPattern += JSON.stringify('%' + check[1] + '%')
                                break;
                            default:
                                break;
                        }
                        return matchPattern
                    }
                }).join(`${"$or" in value ? ' OR ' : " AND "}`)
            }
            switch (field) {
                case '$between':
                    const between = (value) => {
                        return Object.entries(value).map(inc => {
                            const between_field = inc[0]
                            const between_value: any = inc[1]
                            if (between_field.toLowerCase() == '$or' || between_field.toLowerCase() == '$and') {
                                return between(between_value)
                            }
                            else {
                                return '(' + (checkRdmsTable + between_field) + ' BETWEEN ' + `${JSON.stringify(between_value.$from)} AND ${JSON.stringify(between_value.$to)})`
                            }
                        }).join(`${"$or" in value ? ' OR ' : " AND "}`)
                    }
                    return between(value)
                    break;
                case '$include':
                    return include(value)
                    break;
                case '$not_include':
                    return include(value, 'not')
                    break;

                case '$pattern':
                    return pattern(value)
                    break;
                case '$not_pattern':
                    return pattern(value, 'not')
                    break;

                default:
                    break;
            }
        }
        else {
            if (typeof value == 'object') {
                if (check_separator.includes(field.toLowerCase())) {
                    return only_other_condition(value, '', condition)
                }
                else {
                    return only_other_condition(value, field, condition)
                }
            }
            else {

                const separator = check_separator.includes(field?.toLowerCase())

                return `${pre_field ? (checkRdmsTable + pre_field) : (checkRdmsTable + field)} ${separator ? simpleOperatorCheck(field) : '='} ${JSON.stringify(value)}`
            }
        }
    }).join(`${condition ? condition : (or ? " OR " : " AND ")}`)
}


export const get_final_condition = (value, rdmsTable = '') => {
    const { $and, $or, ...other_value } = value;
    let other_value_condition = only_other_condition(other_value, '', '', rdmsTable)

    let and_condition = only_other_condition($and || {}, '', " AND ", rdmsTable)

    let or_condition = only_other_condition($or || {}, '', ' OR ', rdmsTable)

    return `(${other_value_condition}${((other_value_condition && and_condition) ? ') AND (' + and_condition : and_condition) + (((other_value_condition && or_condition) || (and_condition && or_condition)) ? ") OR (" + or_condition : or_condition)})`
}
