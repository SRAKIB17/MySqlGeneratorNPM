# Contain

This is now development mode

1. Create Table (new)
2. Select Data
3. Relational Select Data
4. Insert Data
5. Update Data
6. Delete Data
7. Condition Parameter
8. Condition syntax
9. Insert Data

```js
npm i mysql-query-geniex
```

# Create Table

There will be separate files for each different model.
model_dir: The folder that will contain the models

`/model`: model extension is `*.model`

┌ ○ /
├ ○ /model/Post.model

```js
model Post {
  id        Int @default (autoincrement(4)) @primary
  title     String @unique
  content   String default (null)
  published Boolean @default (false)
  author    User @relation(fields: [authorId], references: [id])
  authorId  Int @not_null
  createdAt DateTime @default (now())
}

```

## Syntax

```js
model model_name {
  column_name  data_type Constraints
}
```

| Properties  | Details                                                        |
| ----------- | -------------------------------------------------------------- |
| model_name  | MySql Table Name                                               |
| column_name | Column Name                                                    |
| data_type   | Data Type                                                      |
| Constraints | SQL constraints are used to specify rules for data in a table. |

## date_type

<https://www.w3schools.com/MySQL/mysql_datatypes.asp>

## Constraints

Use in default (). Like `default (autoincrement(100))

| Default Constraints   | Details                  |
| --------------------- | ------------------------ |
| (autoincrement())     | Auto Increment           |
| (autoincrement(1000)) | Auto Increment from 1000 |
| (null)                | null                     |
| (true)                | Boolean True             |
| (false)               | Boolean False            |
| (now())               | Current time             |

| Constraints                                                           | Details                                                                                   |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| @default (pass constraints)                                           | Example: `@default (autoincrement(4))` .after @default must always be followed by a space |
| @unique                                                               | For unique column value                                                                   |
| @primary                                                              | For primary key                                                                           |
| @not_null                                                             | For not null                                                                              |
| @relation(fields: [column_name], references: [references_table_name]) | For Foreign key.                                                                          |

```js
import { queryGenModel} from 'mysql-query-gen'
const x = new queryGenModel({ model_dir: 'model' })

```

## RDMS(new)

```js
const x = genRdmsSql({
    table_list: {
        "table1": 'customer',
        "table2": "products",
        'table3': 'test'
    },
    specif_field: {
        // "table1": ['p', 'x'],
        "table2": ['y', 'sfsdf']
        // all: ["*"]
    },
    relation_key: {
        'on': {
            "relation": "INNER JOIN",
            "table1": 'product_id',//which
            'table3': 'customer_id', //with
        },
        on1: {
            relation: 'CROSS JOIN',
            table3: 'test_table3',
            table2: "test",
        },
        on2: {
            relation: 'CROSS JOIN',
            table3: 'test_table3',
            table2: "test",
        }

    },
    where: {
        table1: {
            "$or": {
                name: 5345,
                $between: {
                    "test": { $from: 35, $to: 534 },
                },
                $not_pattern: {
                    $or: {
                        country: {
                            $start: 4534
                        }
                    }
                }
                // (name = 5345 OR (test BETWEEN 35 AND 534) OR NOT LIKE country "4534%")
            }
        }
    }
}).limitSkip(10, 10).sort({
    table1: ['product', 1]
}).getSyntax()
console.log(x)
// SELECT products.y, products.sfsdf FROM customer as table1
// INNER JOIN ON customer.product_id = test.customer_id
// CROSS JOIN ON test.test_table3 = products.test
// WHERE(customer.name = 5345 OR(customer.test BETWEEN 35 AND 534) 
// OR NOT LIKE  customer.country "4534%")   ORDER BY customer.product ASC   LIMIT 10, 10
```

### $between

In MySQL, the BETWEEN operator is used to match a value against a range of values.
The BETWEEN operator checks if the column_name value is between value1 and value2, and if it is, the row is returned by the query. The BETWEEN operator is inclusive, which means that if the column_name value is equal to either value1 or value2, it will still be included in the query result.

```js
"$between": {
    test: { $from: 3534, $to: 544 },
    "$or": {
        price: { $from: 3534, $to: 3534 }
    }
},
// ((test BETWEEN 3534 AND 544) OR (price BETWEEN 3534 AND 3534))

// "$between": {
//     field_name: { $from: 'value', $to:  'value' },
// },

```

#### wrong pattern

```js
"$between": {
    test: { $from: 3534, $to: 544 },
    $pattern: {
        test: { $both: 345 }
    }
},
```

```js
"$between": {
    test: { $from: 3534, $to: 544 },
   $or:{
     $pattern: {
        test: { $both: 345 }
    }
   }
},
```

 `$between` , `$include`, `$not_include`, `$pattern`, `$not_pattern` will not pass inside `$between`. `$and` or `$or` can use inside

### $include

In MySQL, the IN operator is used to check if a value matches any value in a list of specified values.
The IN operator checks if the column_name value matches any of the specified values in the list (value1, value2, value3, ...). If there is a match, the row is returned by the query.

```js
'$include': {
    data: ["34534", 43, 4],
    '$or': {
        country: ["USA", "US", "INDIA"]
    }
}
// ((data IN ("34534",43,4)) OR (country NOT IN ("USA", "US", "INDIA")))
```

 `$between` , `$include`, `$not_include`, `$pattern`, `$not_pattern` will not pass inside `$include`. `$and` or `$or` can use inside

```js
'$not_include': {
    data: ["34534", 43, 4],
    '$or': {
        country: ["USA", "US", "INDIA"]
    }
}
// ((data NOT IN ("34534",43,4)) OR (country NOT IN ("USA", "US", "INDIA")))

```

 `$between` , `$include`, `$not_include`, `$pattern`, `$not_pattern` will not pass inside `$not_include`. `$and` or `$or` can use inside

### $pattern

The LIKE operator is used in a WHERE clause to search for a specified pattern in a column.

```js
$pattern: {
    test: { $both: 345 },
    $or: {
        country: {
            $start: 'ban'
        }
    }
}
// (LIKE test "%345%" OR LIKE country "ban%")

```

Wrong pattern:

```js
$pattern: {
    test: { $both: 345 },
    $or: {
        $start: 'ban'
    }
}
```

 `$between` , `$include`, `$not_include`, `$pattern`, `$not_pattern` will not pass inside `$pattern`. `$and` or `$or` can use inside

```js
$not_pattern: {
    country: { $both: 'un' },
    $or: {
        country: {
            $start: 'ban'
        }
    }
}
// ( NOT LIKE country "%un%" OR LIKE country "ban%")
```

 `$between` , `$include`, `$not_include`, `$pattern`, `$not_pattern` will not pass inside `$not_pattern`. `$and` or `$or` can use inside

### $or

```js

 "$or": {
    name: 5345,
    $between: {
        "test": { $from: 35, $to: 534 },
    },
    $not_pattern: {
        $or: {
            country: {
                $start: 4534
            }
        }
    }
    // (name = 5345 OR (test BETWEEN 35 AND 534) OR NOT LIKE country "4534%")
}
```

### $and

```js

 "$and": {
    name: 5345,
    $between: {
        "test": { $from: 35, $to: 534 },
    },
    $not_pattern: {
        $or: {
            country: {
                $start: 4534
            }
        }
    }
    // (name = 5345 AND (test BETWEEN 35 AND 534) AND NOT LIKE country "4534%")
}
```

#### Example

1.

```  js
where: {
    test: 534,
        price: {
            $eq: 34
    }
}
// (test = 534 AND price = 34)
where: {
    test: 534,
    $or:{
        price: {$lt: 34}
    }
}
// (test = 534) OR (price < 34)
```

## Condition Syntax

| condition syntax   | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `=` / `$eq`        | Equal to                                                      |
| `>`  /  `$gt`      | Greater than                                                  |
| `<`   / `$lt`      | Less than                                                     |
| `>=` /  `$gte`     | Greater than or equal to                                      |
| `<=`  /  `$lte`    | Less than or equal to                                         |
| `!=`  /  `$not_eq` | Not equal to                                                  |
| `$end`             | Matches a pattern .Finds any values that end with             |
| `$start`           | Matches a pattern .Finds any values that start with           |
| `$both`            | Matches a pattern .Finds any values that have in any position |

## Insert

| Insert parameter | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| table            | (required)  table name . Example: `db_name.table_name`                     |
| insert_data      | (required)  Must be an object                                              |
| hasDate          | (optional)   If the table contains date name column. Default `false`       |
| date_field       | (optional)   Date column name. The date will be converted to UTC time zone |

note:  Should always call the getSyntax function at the end for get syntax

``` javascript
import { genInsertSql} from 'mysql-query-gen'

const insert = genInsertSql({
    table: 'test',
    insert_data: { name: 'X', age: 'test' },
    date_field: 'entry_date',
    hasDate: true
}).getSyntax()
console.log(insert)

// INSERT INTO test (name,age,entry_date) VALUES ("X","test",UTC_TIMESTAMP())
```

without date:

``` javascript

const insert =genInsertSql({
    table: 'test',
    insert_data: { name: 'X', age: 'test', entry_date: new Date()},
}).getSyntax()
console.log(insert)
// INSERT INTO test (name,age,entry_date) VALUES ("X","test","2023-04-26T18:42:00.788Z")
```

## SELECT statement

| parameter      | Description                                             |
| -------------- | ------------------------------------------------------- |
| table          | (required)   table name . Example: `db_name.table_name` |
| specific_field | (optional) Must be an array (return specific field)     |
| where          | (optional) pass multiple or one condition               |

note:  Should always call the getSyntax function at the end for get syntax

``` javascript
import { genSelectSql} from 'mysql-query-gen'

const test = genSelectSql({
    table: 'test',
    specif_field: ['test', 'wow'],
    where: {
        name: { "!=": "RAKIB" },
        age: {
                between: {
                    from: 10,
                    to: 34,
                }
        },
    }
}).getSyntax()
console.log(test)
// SELECT COUNT(*) as count FROM 34535 WHERE (name != "RAKIB" AND (test BETWEEN 3534 AND 544) AND (price BETWEEN 3534 AND 3534))
```

### getSyntax()

return mysql query. Its call every statement

### limitSkip(): Add limit and skip value

| parameter          | Description         |
| ------------------ | ------------------- |
| limitSkip(10)      | limit 10 , skip 0   |
| limitSkip(100, 10) | limit 100 , skip 10 |

```js
const test = genSelectSql({
    table: 'test',
    where: {
        name: { "!=": "RAKIB" },
    }
}).limitSkip(10,10).getSyntax()
//SELECT * FROM test WHERE name != "RAKIB"  LIMIT 10, 10
```

### COUNT()

count() method use last position

```js
const test = genSelectSql({
    table: 'test',
    where: {
        name: { "!=": "RAKIB" },
    }
}).count().getSyntax()
//SELECT * FROM test WHERE name != "RAKIB" 
```

or:

```js
genSelectSql({
    // .....................................
    specif_field: ['count(*) as count']
    // .....................................
}).getSyntax()

```

### SORT()

sort() method use last position
 To sort in ascending order, you specify 1 for each field you want to sort. To sort in descending order, you specify -1 for each field.

pass an object and multiple filed

```js
const test = genSelectSql({
    table: 'test',
    where: {
        name: { "!=": "RAKIB" },
    }
}).sort({ name: 1, age: -1 }).getSyntax()
// SELECT * FROM test WHERE name != "RAKIB"  ORDER BY name ASC,age DESC 
```

### For RDMS

```js
onst x = genRdmsSql({
    //---------------------------------------
    //---------------------------------------
    //---------------------------------------
    //---------------------------------------
    //---------------------------------------
}).sort(
    {
        table1: ['product', 1]
    }
).getSyntax()

//.sort(
//  {
//      table1: ['column_name', 1 or 0)]
//  }
// ).getSyntax()
```

| Method          | Description                                             |
| --------------- | ------------------------------------------------------- |
| MIN(field_name) | table name . Example: `db_name.table_name`              |
| MAX(field_name) | Must be an object                                       |
| SUM(field_name) | If the table contains date name column. Default `false` |

```js
genSelectSql({
    // .....................................
    specif_field: ['SUM(*) as sum']
    // .....................................
}).getSyntax()

```

## Update

| update parameter | Description                                           |
| ---------------- | ----------------------------------------------------- |
| table            | (required) table name . Example: `db_name.table_name` |
| update_data      | (required) Must be a  object                          |
| where            | (required) for and or condition                       |

note:  Should always call the getSyntax function at the end for get syntax

```js
import { genUpdateSql} from 'mysql-query-gen'

const update = {
    name: "Jhon",
}
const test = genUpdateSql({
    update_data: update,
    table: "person",
    where: {
        name: { "!=": "RAKIB" },
        "$between": {
            age: { $from: 3, $to: 20 }
        },
}}).getSyntax()
// UPDATE person SET name="Jhon" WHERE (name != "RAKIB" AND (age BETWEEN 3 AND 20))      
```

## DELETE

| delete parameter | Description                                           |
| ---------------- | ----------------------------------------------------- |
| table            | (required) table name . Example: `db_name.table_name` |
| where            | (required) for and or condition                       |

note:  Should always call the getSyntax function at the end for get syntax

```js
import { genDeleteSql} from 'mysql-query-gen'

const dl = genDeleteSql({
    table: 'person',
    where: {
        id: {
                "$eq": 3454
        }
    }
}).getSyntax()
//DELETE FROM person WHERE (id = 3454)
```
