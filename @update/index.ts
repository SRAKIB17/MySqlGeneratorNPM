import { conditionInterface, get_final_condition } from "../lib/condition";

function update(props: {
    update_data: {
        [column_name: string]: string | number | boolean
    },
    table: string,
    where: conditionInterface
}) {
    const update_data = props.update_data;
    const table = props.table
    const queryCondition = (get_final_condition(props.where))

    const updateInfo = Object.entries(update_data)?.map(info => {
        const column = info[0]
        const value = info[1]
        return column + '=' + JSON.stringify(value)
    })?.join(',');

    const s = `UPDATE ${table} SET ${updateInfo}${queryCondition ? " WHERE " + queryCondition + " " : ""}`;
    const getSyntax = () => {
        return s
    }
    return {
        getSyntax
    }
}

export default update