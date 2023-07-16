
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

            const include = (value, method = '', operation = ' AND ') => {
                return `(${Object.entries(value).map(inc => {
                    const include_field = inc[0]
                    const include_value = inc[1]
                    if (include_field.toLowerCase() == '$or' || include_field.toLowerCase() == '$and') {
                        return include(include_value, method)
                    }
                    else {
                        return "(" + (checkRdmsTable + include_field) + (method == 'not' ? " NOT IN " : " IN ") + `(${JSON.stringify(include_value).slice(1, -1)}))`
                    }
                }).join(operation)})`
            }
            const pattern = (value, method = '', operation = " AND ") => {

                return Object.entries(value).map((inc, index, arr) => {
                    const pattern_field = inc[0]
                    const pattern_value: any = inc[1]
                    if (pattern_field.toLowerCase() == '$or' || pattern_field.toLowerCase() == '$and') {
                        return pattern(pattern_value, method, pattern_field?.toUpperCase())
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
                        return `(${matchPattern})`
                    }
                }).join(operation)
            }

            const between = (value, operation = ' AND ') => {

                return Object.entries(value).map(inc => {
                    const between_field = inc[0]
                    const between_value: any = inc[1]
                    if (between_field.toLowerCase() == '$or' || between_field.toLowerCase() == '$and') {
                        return between(between_value)
                    }
                    else {
                        return '(' + (checkRdmsTable + between_field) + ' BETWEEN ' + `${JSON.stringify(between_value.$from)} AND ${JSON.stringify(between_value.$to)})`
                    }
                }).join(operation)
            }
            switch (field) {
                case '$between':
                    const { $or: betweenOr, $and: betweenAnd, ...otherBetween } = value;

                    let between_or_condition = betweenOr ? between(betweenOr, " OR ") : ""
                    let between_and_condition = betweenAnd ? between(betweenAnd, " AND ") : ""
                    let between_other_condition = Object.values(otherBetween).length ? between(otherBetween, ' AND ') : ''

                    return `${between_or_condition ? between_or_condition : ""}${(between_or_condition && between_and_condition) ? " AND " + between_and_condition : (between_and_condition ? between_and_condition : "")}${(between_and_condition || between_or_condition) && between_other_condition ? " AND " + between_other_condition : (between_other_condition ? between_other_condition : '')}`

                    return between(value)

                    break;
                case '$include':
                    const { $or, $and, ...other } = value;

                    let include_or_condition = $or ? include($or, '', " OR ") : ""
                    let include_and_condition = $and ? include($and, "", " AND ") : ""
                    let include_other_condition = Object.values(other).length ? include(other, '', ' AND ') : ''

                    return `${include_or_condition ? include_or_condition : ""}${(include_or_condition && include_and_condition) ? " AND " + include_and_condition : (include_and_condition ? include_and_condition : "")}${(include_and_condition || include_or_condition) && include_other_condition ? " AND " + include_other_condition : (include_other_condition ? include_other_condition : '')}`
                    break;
                case '$not_include':
                    const { $or: notOr, $and: notAnd, ...not_other } = value;

                    let not_or_condition = notOr ? include(notOr, 'not', " OR ") : ""
                    let not_and_condition = notAnd ? include(notAnd, "not", " AND ") : ""
                    let not_other_condition = Object.values(not_other).length ? include(not_other, 'not', ' AND ') : ''

                    return `${not_or_condition ? not_or_condition : ""}${(not_or_condition && not_and_condition) ? " AND " + not_and_condition : (not_and_condition ? not_and_condition : "")}${(not_and_condition || not_or_condition) && not_other_condition ? " AND " + not_other_condition : (not_or_condition ? not_other_condition : '')}`

                case '$pattern':

                    const { $or: PatOr, $and: PatAnd, ...patOther } = value;
                    let or_pat_condition = PatOr ? pattern(PatOr, '', " OR ") : ""
                    let and_pat_condition = PatAnd ? pattern(PatAnd, '', " AND ") : ""
                    let other_pat_condition = Object.values(patOther).length ? pattern(patOther, '', " AND ") : ""

                    return `${or_pat_condition ? or_pat_condition : ""}${(or_pat_condition && and_pat_condition) ? " AND " + and_pat_condition : (and_pat_condition ? and_pat_condition : "")}${(and_pat_condition || or_pat_condition) && other_pat_condition ? " AND " + other_pat_condition : (other_pat_condition ? other_pat_condition : '')}`

                    break;
                case '$not_pattern':
                    const { $or: notPatOr, $and: notPatAnd, ...notPatOther } = value;
                    let not_or_pat_condition = notPatOr ? pattern(notPatOr, '', " OR ") : ""
                    let not_and_pat_condition = notPatAnd ? pattern(notPatAnd, '', " AND ") : ""
                    let not_other_pat_condition = Object.values(notPatOther).length ? pattern(notPatOther, '', " AND ") : ""
                    return `${not_or_pat_condition ? not_or_pat_condition : ""}${(not_or_pat_condition && not_and_pat_condition) ? " AND " + not_and_pat_condition : (not_and_pat_condition ? not_and_pat_condition : "")}${(not_and_pat_condition || not_or_pat_condition) && not_other_pat_condition ? " AND " + not_other_pat_condition : (not_other_pat_condition ? not_other_pat_condition : '')}`

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
    const { $and, $or, ...other_value } = value || {};
    let other_value_condition = only_other_condition(other_value, '', '', rdmsTable)
    let and_condition = only_other_condition($and || {}, '', " AND ", rdmsTable)

    let or_condition = only_other_condition($or || {}, '', ' OR ', rdmsTable)
    const final_condition: any = `(${other_value_condition}${((other_value_condition && and_condition) ? ') AND (' + and_condition : and_condition) + (((other_value_condition && or_condition) || (and_condition && or_condition)) ? ") OR (" + or_condition : or_condition)})`
    return final_condition?.replaceAll(/\( AND /gi, '(')
}
