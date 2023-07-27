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

    const updateInfo = Object.entries(update_data)?.map((info: any[]) => {
        const column = info[0];

        const value: any = info[1]?.trim();

        const check = value?.indexOf(column) == 0 || value?.lastIndexOf(column) >= (value.length - column?.length);
        return (column + '=' + ((value?.match(/[+|-|\/|*]/gi)?.length == 1 && check) ? value?.toString() : JSON.stringify(value)))
    })?.join(',');

    const s = `UPDATE ${table} SET ${updateInfo}${queryCondition ? " WHERE " + queryCondition + " " : ""}`;
    const getSyntax = () => {
        return s
    }
    return {
        getSyntax
    }
}

export default genUpdateSql