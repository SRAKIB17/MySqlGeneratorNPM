import { conditionInterface, get_final_condition } from "../lib/condition"


function genUpdateSql(props: {
    update_data: {
        [column_name: string]: string | number | boolean
    },
    table: string,
    where: conditionInterface
}) {
    const update_data = props.update_data;
    const table = props.table
    const queryCondition = (get_final_condition(props?.where))


    const updateInfo = Object.entries(update_data)?.map((info) => {
        const column = info?.[0];
        const isNumber = typeof info?.[1] == 'number' || typeof info?.[1] == 'boolean';
        const column_value: any = info?.[1]
        const value = isNumber ? info?.[1] : column_value?.trim();

        const check = isNumber ? false : (value?.indexOf(column) == 0 || value?.lastIndexOf(column) == (value?.length - column?.length));

        return (column + '=' + ((isNumber ? false : (value?.match(/[+|-|\/|*]/gi)?.length == 1 && check)) ? value?.toString() : JSON?.stringify(value)));
    })?.join(',');


    const s = `UPDATE ${table} SET ${updateInfo}${queryCondition ? " WHERE " + queryCondition + " " : ""}`;
    const getSyntax = () => {
        return s
    }
    return s
}

const x = genUpdateSql({
    table: "table",
    update_data: {},
    where: {}
})

console.log(x)

export default genUpdateSql