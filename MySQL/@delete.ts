import { conditionInterface, get_final_condition } from "../lib/condition"


function genDeleteSql(props: {
    table: string,
    where: conditionInterface
}) {
    const table = props.table
    const queryCondition = (get_final_condition(props.where))
    const s = `DELETE FROM ${table}${queryCondition ? " WHERE " + queryCondition + " " : ""}`;
    const getSyntax = () => {
        return s
    }
    return { getSyntax }
}

export default genDeleteSql;