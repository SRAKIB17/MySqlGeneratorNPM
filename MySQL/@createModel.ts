import { readdirSync, readFileSync } from 'fs'


const defaultValueWithColumn = (defaultValue: string) => {
    const defaultValueObj: { value: string, auto_increment?: string } = {
        value: ''
    }
    switch (defaultValue) {

        case '(autoincrement())':
            defaultValueObj.value = " AUTO_INCREMENT"
            break;

        case '(now())':
            defaultValueObj.value = " DEFAULT CURRENT_TIMESTAMP"
            break;

        case '(null)':
            defaultValueObj.value = " DEFAULT NULL"
            break;
        case '(false)':
            defaultValueObj.value = " DEFAULT FALSE"
            break;
        case '(true)':
            defaultValueObj.value = " DEFAULT TRUE"
            break;

        default:
            if (defaultValue.includes('autoincrement')) {
                defaultValueObj.value = " AUTO_INCREMENT"
                defaultValueObj.auto_increment = defaultValue[defaultValue.indexOf('autoincrement') + 14]
            }
            else {
                defaultValueObj.value = " DEFAULT " + JSON.stringify(defaultValue.slice(1, -1))
            }
            break;


    }
    return defaultValueObj

}

class queryGenModel {
    #model_dir: string
    constructor({ model_dir }) {
        this.#model_dir = model_dir
    }
    get model() {
        try {
            const getModel = readdirSync(this.#model_dir).filter(dir => dir.includes('.model')).map(model => {
                const open = readFileSync(`${this.#model_dir}/${model}`, {
                    flag: 'r'
                }).toString()
                let foreignKey: string[] = [];
                let primaryKey;
                let auto_increment;
                let value = open.slice(open.indexOf('{') + 1, open.lastIndexOf("}")).trim().split('\n').map(column => {
                    const getColumnDetailsSyn = column.trim().replace(/ +/g, ' ')
                    const getColumnDetails = column.trim().replace(/ +/g, ' ').split(' ')

                    const columnName = getColumnDetails[0];
                    const dataType = getColumnDetails[1]

                    // check default 
                    const defaultCheck = getColumnDetails.indexOf('@default')
                    const defaultValue = defaultCheck == -1 ? null : defaultValueWithColumn(getColumnDetails[defaultCheck + 1].toLowerCase())

                    const checkPrimaryKey = getColumnDetails.includes('@primary')
                    const checkNotNull = getColumnDetails.includes('@not_null')

                    const checkUnique = getColumnDetails.includes('@unique')

                    const checkForeignKey = getColumnDetailsSyn.indexOf('@relation(')

                    const foreignKeyCheck = checkForeignKey == -1 ? null : getColumnDetailsSyn.slice(checkForeignKey + 10, getColumnDetailsSyn.indexOf(")", checkForeignKey + 10)).split(',')

                    const foreignKeyColumn = foreignKeyCheck?.[0]?.split(':')[1].trim().slice(1, -1).split(',')[0]

                    const foreignKeyReference = foreignKeyCheck?.[1]?.split(':')[1].trim().slice(1, -1).split(',')[0]



                    if (foreignKeyCheck) {
                        foreignKey.push(`\tFOREIGN KEY(${columnName}) REFERENCES ${foreignKeyReference}(${foreignKeyColumn})`)
                    }

                    if (defaultValue?.auto_increment) auto_increment = defaultValue?.auto_increment;

                    return `\t${columnName} ${dataType}${checkNotNull ? " NOT NULL" : ""}${checkPrimaryKey ? " PRIMARY KEY" : ""}${checkUnique ? " UNIQUE" : ""}${defaultValue ? defaultValue.value : ''}`

                }).join(',\n')

                if (foreignKey) {
                    value += ',\n' + foreignKey.join(',\n')
                }

                const model_name = open.split("{")[0].split(' ')[1]
                const table = `
CREATE TABLE IF NOT EXISTS ${model_name} (
${value}
)${auto_increment ? ' AUTO_INCREMENT=' + auto_increment : ''};
                `
                console.log(table)
                return table
            })
            return getModel
        }
        catch (err) {
            console.log(err.message)
        }

    }

}
const x = new queryGenModel({ model_dir: 'model' }).model

export default queryGenModel



