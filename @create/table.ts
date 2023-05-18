
// Constraints
// NOT NULL - নিশ্চিত করে যে একটি কলামের একটি NULL মান থাকতে পারে না
// UNIQUE - নিশ্চিত করে যে একটি কলামের সমস্ত মান আলাদা
// PRIMARY KEY - a NOT NULLএবং এর সংমিশ্রণ UNIQUE। একটি টেবিলের প্রতিটি সারিকে স্বতন্ত্রভাবে চিহ্নিত করে
// FOREIGN KEY - সারণীগুলির মধ্যে লিঙ্কগুলিকে ধ্বংস করে এমন ক্রিয়াগুলিকে প্রতিরোধ করে৷
// CHECK - নিশ্চিত করে যে একটি কলামের মানগুলি একটি নির্দিষ্ট শর্ত পূরণ করে৷
// DEFAULT - কোনো মান নির্দিষ্ট না থাকলে একটি কলামের জন্য একটি ডিফল্ট মান সেট করে
// CREATE INDEX - খুব দ্রুত ডাটাবেস থেকে ডেটা তৈরি এবং পুনরুদ্ধার করতে ব্যবহৃত হয়

// CREATE TABLE Persons(
//     ID int NOT NULL,
//     LastName varchar(255) NOT NULL,
//     FirstName varchar(255),
//     Age int,
//     CHECK(Age >= 18)
// );
// CREATE TABLE Orders(
//     OrderID int NOT NULL,
//     OrderNumber int NOT NULL,
//     PersonID int,
//     PRIMARY KEY(OrderID),
//     FOREIGN KEY(PersonID) REFERENCES Persons(PersonID)
// );

interface ConstraintsInterface {
    [field_name: string]: {
        "="?: number | string,
        ">"?: number | string,
        "<"?: number | string,
        ">="?: number | string,
        "<="?: number | string,
        "!="?: number | string,
        "include"?: string[] | number[] | any[]
        "not_include"?: string[] | number[] | any[]
        "pattern"?: {
            "start_with"?: string | number,
            "end_with"?: string | number,
            "both"?: string | number,
        },
        "not_pattern"?: {
            "start_with"?: string | number,
            "end_with"?: string | number,
            "both"?: string | number,
        },
        "between"?: {
            "from": string | number,
            "to": string | number
        },
    }
}
// CREATE TABLE `country` (
//   `Code` char(3) NOT NULL DEFAULT '',
//   `Name` char(52) NOT NULL DEFAULT '',
//   `Continent` enum('Asia','Europe','North America','Africa','Oceania','Antarctica','South America') NOT NULL DEFAULT 'Asia',
//   `Region` char(26) NOT NULL DEFAULT '',
//   `SurfaceArea` decimal(10,2) NOT NULL DEFAULT '0.00',
//   `IndepYear` smallint DEFAULT NULL,
//   `Population` int NOT NULL DEFAULT '0',
//   `LifeExpectancy` decimal(3,1) DEFAULT NULL,
//   `GNP` decimal(10,2) DEFAULT NULL,
//   `GNPOld` decimal(10,2) DEFAULT NULL,
//   `LocalName` char(45) NOT NULL DEFAULT '',
//   `GovernmentForm` char(45) NOT NULL DEFAULT '',
//   `HeadOfState` char(60) DEFAULT NULL,
//   `Capital` int DEFAULT NULL,
//   `Code2` char(2) NOT NULL DEFAULT '',
//   PRIMARY KEY (`Code`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

// Data type

// const t = 
interface createTable {
    table_name: string
    field: {
        [field_name: string]: [
            ["CHAR(size)" | "VARCHAR(size)" | "BINARY(size)" | "VARBINARY(size)" | "TINYBLOB" | "TINYTEXT" | "TEXT(size)" | "BLOB(size)" | "MEDIUMTEXT" | "MEDIUMBLOB" | "LONGTEXT" | "LONGBLOB" | "ENUM(val1, val2, val3, ...)" | "SET(val1, val2, val3, ...)" | any]
        ]

    }
}
const createTable = (props: createTable) => {
    return 534
}

const x = createTable({
    table_name: 'test',
    field: {
        name: [
            []
        ]
    }
})
console.log(x)