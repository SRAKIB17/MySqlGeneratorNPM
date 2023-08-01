interface mysqlCrudInsertSyntax {
    table: string,
    insert_data: object,
    hasDate?: boolean,
    date_field?: string
}

function genInsertSql({ table, insert_data, hasDate = false, date_field }: mysqlCrudInsertSyntax) {
    const getColumns = [...Object.keys(insert_data)].join(',')
    const columnValues = JSON?.stringify([...Object.values(insert_data)])?.slice(1, -1);
    const sql = `INSERT INTO ${table} (${getColumns}${hasDate ? ("," + date_field) : ""}) VALUES (${columnValues}${hasDate ? ",CURRENT_TIMESTAMP" : ""})`;
    const getSyntax = () => {
        return sql
    }
    return {
        getSyntax
    }
}

export default genInsertSql