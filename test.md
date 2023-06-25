## Case:

```js

 const rdmsSql = genRdmsSql({
        table_list: {
            table1: 'user_wishlist',
            table2: 'products'
        },
        relation_key: {
            on: {
                table1: 'productID',
                table2: 'productID',
                relation: 'LEFT JOIN'
            }
        },
        where: {
            table1: {
                userID: userID
            }
        },
        specif_field: {
            table2: [`*,
            CASE 
                WHEN products.quantity - products.sku <= 0 THEN 'Stock out'
                ELSE 'Available'
            END AS availabilityStatus`],
            table1: [
                '*',
            ]
        }
    }).getSyntax()

```
```js
        specif_field:  [`
            CASE 
                WHEN products.quantity - products.sku <= 0 THEN 'Stock out'
                ELSE 'Available'
            END AS availabilityStatus`]

```