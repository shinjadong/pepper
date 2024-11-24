Authentication
Supabase works through a mixture of JWT and Key auth.

If no Authorization header is included, the API will assume that you are making a request with an anonymous user.

If an Authorization header is included, the API will "switch" to the role of the user making the request. See the User Management section for more details.

We recommend setting your keys as Environment Variables.

Client API Keys
Client keys allow "anonymous access" to your database, until the user has logged in. After logging in the keys will switch to the user's own login token.

In this documentation, we will refer to the key using the name SUPABASE_KEY.

We have provided you a Client Key to get started. You will soon be able to add as many keys as you like. You can find the anon key in the API Settings page.

CLIENT API KEY
const SUPABASE_KEY = 'SUPABASE_CLIENT_API_KEY'
Example usage
const SUPABASE_URL = "https://bnlarqcnxnbyzxmufzfi.supabase.co"
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_KEY);
Service Keys
Service keys have FULL access to your data, bypassing any security policies. Be VERY careful where you expose these keys. They should only be used on a server and never on a client or browser.

In this documentation, we will refer to the key using the name SERVICE_KEY.

We have provided you with a Service Key to get started. Soon you will be able to add as many keys as you like. You can find the service_role in the API Settings page.

SERVICE KEY
const SERVICE_KEY = 'SUPABASE_SERVICE_KEY'
Example usage
const SUPABASE_URL = "https://bnlarqcnxnbyzxmufzfi.supabase.co"
const supabase = createClient(SUPABASE_URL, process.env.SERVICE_KEY);

Database
Fundamentals
Importing data
Import data into Supabase
You can import data into Supabase in multiple ways. The best method depends on your data size and app requirements.

If you're working with small datasets in development, you can experiment quickly using CSV import in the Supabase dashboard. If you're working with a large dataset in production, you should plan your data import to minimize app latency and ensure data integrity.

How to import data into Supabase#
You have multiple options for importing your data into Supabase:

CSV import via the Supabase dashboard
Bulk import using pgloader
Using the Postgres COPY command
Using the Supabase API
If you're importing a large dataset or importing data into production, plan ahead and prepare your database.

Option 1: CSV import via Supabase dashboard#
Supabase dashboard provides a user-friendly way to import data. However, for very large datasets, this method may not be the most efficient choice, given the size limit is 100MB. It's generally better suited for smaller datasets and quick data imports. Consider using alternative methods like pgloader for large-scale data imports.

Navigate to the relevant table in the Table Editor.
Click on “Insert” then choose "Import Data from CSV" and follow the on-screen instructions to upload your CSV file.
Option 2: Bulk import using pgloader#
pgloader is a powerful tool for efficiently importing data into a PostgreSQL database that supports a wide range of source database engines, including MySQL and MS SQL.

You can use it in conjunction with Supabase by following these steps:

Install pgloader on your local machine or a server. For more info, you can refer to the official pgloader installation page.

$ apt-get install pgloader

Create a configuration file that specifies the source data and the target Supabase database (e.g., config.load).
Here's an example configuration file:

LOAD DATABASE
FROM sourcedb://USER:PASSWORD@HOST/SOURCE_DB
INTO postgres://postgres.xxxx:password@xxxx.pooler.supabase.com:6543/postgres
ALTER SCHEMA 'public' OWNER TO 'postgres';
set wal_buffers = '64MB', max_wal_senders = 0, statement_timeout = 0, work_mem to '2GB';

Customize the source and Supabase database URL and options to fit your specific use case:

wal_buffers: This parameter is set to '64MB' to allocate 64 megabytes of memory for write-ahead logging buffers. A larger value can help improve write performance by caching more data in memory before writing it to disk. This can be useful during data import operations to speed up the writing of transaction logs.
max_wal_senders: It is set to 0, to disable replication connections. This is done during the data import process to prevent replication-related conflicts and issues.
statement_timeout: The value is set to 0, which means it's disabled, allowing SQL statements to run without a time limit.
work_mem: It is set to '2GB', allocating 2 GB of memory for query operations. This enhances the performance of complex queries by allowing larger in-memory datasets.
Run pgloader with the configuration file.

pgloader config.load

For databases using the Postgres engine, we recommend using the pg_dump and psql command line tools.

Option 3: Using Postgres copy command#
Read more about Bulk data loading.

Option 4: Using the Supabase API#
The Supabase API allows you to programmatically import data into your tables. You can use various client libraries to interact with the API and perform data import operations. This approach is useful when you need to automate data imports, and it gives you fine-grained control over the process. Refer to our API guide for more details.

When importing data via the Supabase API, it's advisable to refrain from bulk imports. This helps ensure a smooth data transfer process and prevents any potential disruptions.

Read more about Rate Limiting, Resource Allocation, & Abuse Prevention.

Preparing to import data#
Large data imports can affect your database performance. Failed imports can also cause data corruption. Importing data is a safe and common operation, but you should plan ahead if you're importing a lot of data, or if you're working in a production environment.

1. Back up your data#
   Backups help you restore your data if something goes wrong. Databases on Pro, Team and Enterprise Plans are automatically backed up on schedule, but you can also take your own backup. See Database Backups for more information.

2. Increase statement timeouts#
   By default, Supabase enforces query statement timeouts to ensure fair resource allocation and prevent long-running queries from affecting the overall system. When importing large datasets, you may encounter timeouts. To address this:

Increase the Statement Timeout: You can adjust the statement timeout for your session or connection to accommodate longer-running queries. Be cautious when doing this, as excessively long queries can negatively impact system performance. Read more about Statement Timeouts. 3. Estimate your required disk size#
Large datasets consume disk space. Ensure your Supabase project has sufficient disk capacity to accommodate the imported data. If you know how big your database is going to be, you can manually increase the size in your projects database settings.

Read more about disk management.

4. Disable triggers#
   When importing large datasets, it's often beneficial to disable triggers temporarily. Triggers can significantly slow down the import process, especially if they involve complex logic or referential integrity checks. After the import, you can re-enable the triggers.

To disable triggers, use the following SQL commands:

-- Disable triggers on a specific table
ALTER TABLE table_name DISABLE TRIGGER ALL;

-- To re-enable triggers
ALTER TABLE table_name ENABLE TRIGGER ALL;

5. Rebuild indices after data import is complete#
   Indexing is crucial for query performance, but building indices while importing a large dataset can be time-consuming. Consider building or rebuilding indices after the data import is complete. This approach can significantly speed up the import process and reduce the overall time required.

To build an index after the data import:

-- Create an index on a table
create index index_name on table_name (column_name);

Read more about Managing Indexes in PostgreSQL.

Edit this page on GitHub
Is this helpful?

Yes

No
On this page
How to import data into Supabase
Option 1: CSV import via Supabase dashboard
Option 2: Bulk import using pgloader
Option 3: Using Postgres copy command
Option 4: Using the Supabase API
Preparing to import data

1. Back up your data
2. Increase statement timeouts
3. Estimate your required disk size
4. Disable triggers
5. Rebuild indices after data import is complete
   Need some help?

Contact support
Latest product updates?

See Changelog
Something's not right?

Check system status
Database
Fundamentals
Securing your data
Securing your data
Supabase helps you control access to your data. With access policies, you can protect sensitive data and make sure users only access what they're allowed to see.

Connecting your app securely#
Supabase allows you to access your database using the auto-generated Data APIs. This speeds up the process of building web apps, since you don't need to write your own backend services to pass database queries and results back and forth.

You can keep your data secure while accessing the Data APIs from the frontend, so long as you:

Turn on Row Level Security (RLS) for your tables
Use your Supabase anon key when you create a Supabase client
Your anon key is safe to expose with RLS enabled, because row access permission is checked against your access policies and the user's JSON Web Token (JWT). The JWT is automatically sent by the Supabase client libraries if the user is logged in using Supabase Auth.

Never expose your service role key on the frontend
Unlike your anon key, your service role key is never safe to expose because it bypasses RLS. Only use your service role key on the backend. Treat it as a secret (for example, import it as a sensitive environment variable instead of hardcoding it).

More information#
Supabase and Postgres provide you with multiple ways to manage security, including but not limited to Row Level Security. See the Access and Security pages for more information:

Row Level Security
Column Level Security
Hardening the Data API
Managing Postgres roles
Managing secrets with Vault
Edit this page on GitHub
Is this helpful?

Yes

No
On this page
Connecting your app securely
More information
Need some help?

Contact support
Latest product updates?

See Changelog
Something's not right?

Check system status
Database
Working with your database (basics)
Managing tables, views, and data
Tables and Data
Tables are where you store your data.

Tables are similar to excel spreadsheets. They contain columns and rows.
For example, this table has 3 "columns" (id, name, description) and 4 "rows" of data:

id name description
1 The Phantom Menace Two Jedi escape a hostile blockade to find allies and come across a young boy who may bring balance to the Force.
2 Attack of the Clones Ten years after the invasion of Naboo, the Galactic Republic is facing a Separatist movement.
3 Revenge of the Sith As Obi-Wan pursues a new threat, Anakin acts as a double agent between the Jedi Council and Palpatine and is lured into a sinister plan to rule the galaxy.
4 Star Wars Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.
There are a few important differences from a spreadsheet, but it's a good starting point if you're new to Relational databases.

Creating tables#
When creating a table, it's best practice to add columns at the same time.

Tables and columns

You must define the "data type" of each column when it is created. You can add and remove columns at any time after creating a table.

Supabase provides several options for creating tables. You can use the Dashboard or create them directly using SQL.
We provide a SQL editor within the Dashboard, or you can connect to your database
and run the SQL queries yourself.

Dashboard

SQL
Go to the Table Editor page in the Dashboard.
Click New Table and create a table with the name todos.
Click Save.
Click New Column and create a column with the name task and type text.
Click Save.
When naming tables, use lowercase and underscores instead of spaces (e.g., table_name, not Table Name).

Columns#
You must define the "data type" when you create a column.

Data types#
Every column is a predefined type. PostgreSQL provides many default types, and you can even design your own (or use extensions) if the default types don't fit your needs. You can use any data type that Postgres supports via the SQL editor. We only support a subset of these in the Table Editor in an effort to keep the experience simple for people with less experience with databases.

Show/Hide default data types

You can "cast" columns from one type to another, however there can be some incompatibilities between types.
For example, if you cast a timestamp to a date, you will lose all the time information that was previously saved.

Primary keys#
A table can have a "primary key" - a unique identifier for every row of data. A few tips for Primary Keys:

It's recommended to create a Primary Key for every table in your database.
You can use any column as a primary key, as long as it is unique for every row.
It's common to use a uuid type or a numbered identity column as your primary key.
create table movies (
id bigint generated always as identity primary key
);

In the example above, we have:

created a column called id
assigned the data type bigint
instructed the database that this should be generated always as identity, which means that Postgres will automatically assign a unique number to this column.
Because it's unique, we can also use it as our primary key.
We could also use generated by default as identity, which would allow us to insert our own unique values.

create table movies (
id bigint generated by default as identity primary key
);

Loading data#
There are several ways to load data in Supabase. You can load data directly into the database or using the APIs.
Use the "Bulk Loading" instructions if you are loading large data sets.

Basic data loading#

SQL

JavaScript

Dart

Swift

Python

Kotlin
insert into movies
(name, description)
values
(
'The Empire Strikes Back',
'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda.'
),
(
'Return of the Jedi',
'After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star.'
);

Bulk data loading#
When inserting large data sets it's best to use PostgreSQL's COPY command.
This loads data directly from a file into a table. There are several file formats available for copying data: text, csv, binary, JSON, etc.

For example, if you wanted to load a CSV file into your movies table:

./movies.csv

"The Empire Strikes Back", "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda."
"Return of the Jedi", "After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star."
You would connect to your database directly and load the file with the COPY command:

psql -h DATABASE_URL -p 5432 -d postgres -U postgres \
 -c "\COPY movies FROM './movies.csv';"

Additionally use the DELIMITER, HEADER and FORMAT options as defined in the PostgreSQL COPY docs.

psql -h DATABASE_URL -p 5432 -d postgres -U postgres \
 -c "\COPY movies FROM './movies.csv' WITH DELIMITER ',' CSV HEADER"

If you receive an error FATAL: password authentication failed for user "postgres", reset your database password in the Database Settings and try again.

Joining tables with foreign keys#
Tables can be "joined" together using Foreign Keys.

Foreign Keys

This is where the "Relational" naming comes from, as data typically forms some sort of relationship.

In our "movies" example above, we might want to add a "category" for each movie (for example, "Action", or "Documentary").
Let's create a new table called categories and "link" our movies table.

create table categories (
id bigint generated always as identity primary key,
name text -- category name
);

alter table movies
add column category_id bigint references categories;

You can also create "many-to-many" relationships by creating a "join" table.
For example if you had the following situations:

You have a list of movies.
A movie can have several actors.
An actor can perform in several movies.

Dashboard

SQL

Schemas#
Tables belong to schemas. Schemas are a way of organizing your tables, often for security reasons.

Schemas and tables

If you don't explicitly pass a schema when creating a table, Postgres will assume that you want to create the table in the public schema.

We can create schemas for organizing tables. For example, we might want a private schema which is hidden from our API:

create schema private;

Now we can create tables inside the private schema:

create table private.salaries (
id bigint generated by default as identity primary key,
salary bigint not null,
actor_id bigint not null references public.actors
);

Views#
A View is a convenient shortcut to a query. Creating a view does not involve new tables or data. When run, an underlying query is executed, returning its results to the user.

Say we have the following tables from a database of a university:

students

id name type
1 Princess Leia undergraduate
2 Yoda graduate
3 Anakin Skywalker graduate
courses

id title code
1 Introduction to Postgres PG101
2 Authentication Theories AUTH205
3 Fundamentals of Supabase SUP412
grades

id student_id course_id result
1 1 1 B+
2 1 3 A+
3 2 2 A
4 3 1 A-
5 3 2 A
6 3 3 B-
Creating a view consisting of all the three tables will look like this:

create view transcripts as
select
students.name,
students.type,
courses.title,
courses.code,
grades.result
from grades
left join students on grades.student_id = students.id
left join courses on grades.course_id = courses.id;

alter view transcripts owner to authenticated;

Once done, we can now access the underlying query with:

select \* from transcripts;

View security#
By default, views are accessed with their creator's permission ("security definer"). If a privileged role creates a view, others accessing it will use that role's elevated permissions. To enforce row level security policies, define the view with the "security invoker" modifier.

-- alter a security_definer view to be security_invoker
alter view <view name>
set (security_invoker = true);

-- create a view with the security_invoker modifier
create view <view name> with(security_invoker=true) as (
select \* from <some table>
);

When to use views#
Views provide the several benefits:

Simplicity
Consistency
Logical Organization
Security
Simplicity#
As a query becomes more complex, it can be a hassle to call it over and over - especially when we run it regularly. In the example above, instead of repeatedly running:

select
students.name,
students.type,
courses.title,
courses.code,
grades.result
from
grades
left join students on grades.student_id = students.id
left join courses on grades.course_id = courses.id;

We can run this instead:

select \* from transcripts;

Additionally, a view behaves like a typical table. We can safely use it in table JOINs or even create new views using existing views.

Consistency#
Views ensure that the likelihood of mistakes decreases when repeatedly executing a query. In our example above, we may decide that we want to exclude the course Introduction to Postgres. The query would become:

select
students.name,
students.type,
courses.title,
courses.code,
grades.result
from
grades
left join students on grades.student_id = students.id
left join courses on grades.course_id = courses.id
where courses.code != 'PG101';

Without a view, we would need to go into every dependent query to add the new rule. This would increase in the likelihood of errors and inconsistencies, as well as introducing a lot of effort for a developer. With views, we can alter just the underlying query in the view transcripts. The change will be applied to all applications using this view.

Logical organization#
With views, we can give our query a name. This is extremely useful for teams working with the same database. Instead of guessing what a query is supposed to do, a well-named view can easily explain it. For example, by looking at the name of the view transcripts, we can infer that the underlying query might involve the students, courses, and grades tables.

Security#
Views can restrict the amount and type of data presented to a user. Instead of allowing a user direct access to a set of tables, we provide them a view instead. We can prevent them from reading sensitive columns by excluding them from the underlying query.

Materialized views#
A materialized view is a form of view but it also stores the results to disk. In subsequent reads of a materialized view, the time taken to return its results would be much faster than a conventional view. This is because the data is readily available for a materialized view while the conventional view executes the underlying query each time it is called.

Using our example above, a materialized view can be created like this:

create materialized view transcripts as
select
students.name,
students.type,
courses.title,
courses.code,
grades.result
from
grades
left join students on grades.student_id = students.id
left join courses on grades.course_id = courses.id;

Reading from the materialized view is the same as a conventional view:

select \* from transcripts;

Refreshing materialized views#
Unfortunately, there is a trade-off - data in materialized views are not always up to date. We need to refresh it regularly to prevent the data from becoming too stale. To do so:

refresh materialized view transcripts;

It's up to you how regularly refresh your materialized views, and it's probably different for each view depending on its use-case.

Materialized views vs conventional views#
Materialized views are useful when execution times for queries or views are too slow. These could likely occur in views or queries involving multiple tables and billions of rows. When using such a view, however, there should be tolerance towards data being outdated. Some use-cases for materialized views are internal dashboards and analytics.

Creating a materialized view is not a solution to inefficient queries. You should always seek to optimize a slow running query even if you are implementing a materialized view.

Resources#
Official Docs: Create table
Official Docs: Create view
PostgreSQL Tutorial: Create tables
PostgreSQL Tutorial: Add column
PostgreSQL Tutorial: Views
Edit this page on GitHub
Is this helpful?

Yes

No
On this page
Creating tables
Columns
Data types
Primary keys
Loading data
Basic data loading
Bulk data loading
Joining tables with foreign keys
Schemas
Views
View security
When to use views
Materialized views
Refreshing materialized views
Materialized views vs conventional views
Resources
Need some help?

Contact support
Latest product updates?

See Changelog
Something's not right?

Check system status
Database
Working with your database (basics)
Working with arrays
Working With Arrays
PostgreSQL supports flexible array types. These arrays are also supported in the Supabase Dashboard and in the JavaScript API.

Create a table with an array column#
Create a test table with a text array (an array of strings):

Dashboard

SQL
Go to the Table editor page in the Dashboard.
Click New Table and create a table with the name arraytest.
Click Save.
Click New Column and create a column with the name textarray, type text, and select Define as array.
Click Save.
Insert a record with an array value#

Dashboard

SQL

JavaScript

Swift

Python
Go to the Table editor page in the Dashboard.
Select the arraytest table.
Click Insert row and add ["Harry", "Larry", "Moe"].
Click Save.
View the results#

Dashboard

SQL
Go to the Table editor page in the Dashboard.
Select the arraytest table.
You should see:

id textarray
1 ["Harry","Larry","Moe"]
Query array data#
PostgreSQL uses 1-based indexing (e.g., textarray[1] is the first item in the array).

SQL

JavaScript

Swift
To select the first item from the array and get the total length of the array:

SELECT textarray[1], array_length(textarray, 1) FROM arraytest;

returns:

textarray array_length
Harry 3
Resources#
Supabase JS Client
Supabase - Get started for free
PostgreSQL Arrays
Edit this page on GitHub
Is this helpful?

Yes

No
On this page
Create a table with an array column
Insert a record with an array value
View the results
Query array data
Resources
Need some help?

Contact support
Latest product updates?

See Changelog
Something's not right?

Check system status
Database
Working with your database (basics)
Managing indexes
Managing Indexes in PostgreSQL
An index makes your Postgres queries faster. The index is like a "table of contents" for your data - a reference list which allows queries to quickly locate a row in a given table without needing to scan the entire table (which in large tables can take a long time).

Indexes can be structured in a few different ways. The type of index chosen depends on the values you are indexing. By far the most common index type, and the default in Postgres, is the B-Tree. A B-Tree is the generalized form of a binary search tree, where nodes can have more than two children.

Even though indexes improve query performance, the Postgres query planner may not always make use of a given index when choosing which optimizations to make. Additionally indexes come with some overhead - additional writes and increased storage - so it's useful to understand how and when to use indexes, if at all.

Create an index#
Let's take an example table:

create table persons (
id bigint generated by default as identity primary key,
age int,
height int,
weight int,
name text,
deceased boolean
);

All the queries in this guide can be run using the SQL Editor in the Supabase Dashboard, or via psql if you're connecting directly to the database.

We might want to frequently query users based on their age:

select name from persons where age = 32;

Without an index, Postgres will scan every row in the table to find equality matches on age.

You can verify this by doing an explain on the query:

explain select name from persons where age = 32;

Outputs:

Seq Scan on persons (cost=0.00..22.75 rows=x width=y)
Filter: (age = 32)

To add a simple B-Tree index you can run:

create index idx_persons_age on persons (age);

It can take a long time to build indexes on large datasets and the default behaviour of create index is to lock the table from writes.

Luckily Postgres provides us with create index concurrently which prevents blocking writes on the table, but does take a bit longer to build.

Here is a simplified diagram of the index we just created (note that in practice, nodes actually have more than two children).

B-Tree index example in Postgres

You can see that in any large data set, traversing the index to locate a given value can be done in much less operations (O(log n)) than compared to scanning the table one value at a time from top to bottom (O(n)).

Partial indexes#
If you are frequently querying a subset of rows then it may be more efficient to build a partial index. In our example, perhaps we only want to match on age where deceased is false. We could build a partial index:

create index idx_living_persons_age on persons (age)
where deceased is false;

Ordering indexes#
By default B-Tree indexes are sorted in ascending order, but sometimes you may want to provide a different ordering. Perhaps our application has a page featuring the top 10 oldest people. Here we would want to sort in descending order, and include NULL values last. For this we can use:

create index idx_persons_age_desc on persons (age desc nulls last);

Reindexing#
After a while indexes can become stale and may need rebuilding. Postgres provides a reindex command for this, but due to Postgres locks being placed on the index during this process, you may want to make use of the concurrent keyword.

reindex index concurrently idx_persons_age;

Alternatively you can reindex all indexes on a particular table:

reindex table concurrently persons;

Take note that reindex can be used inside a transaction, but reindex [index/table] concurrently cannot.

Index Advisor#
Indexes can improve query performance of your tables as they grow. The Supabase Dashboard offers an Index Advisor, which suggests potential indexes to add to your tables.

For more information on the Index Advisor and its suggestions, see the index_advisor extension.

To use the Dashboard Index Advisor:

Go to the Query Performance page.
Click on a query to bring up the Details side panel.
Select the Indexes tab.
Enable Index Advisor if prompted.
Understanding Index Advisor results#
The Indexes tab shows the existing indexes used in the selected query. Note that indexes suggested in the "New Index Recommendations" section may not be used when you create them. Postgres' query planner may intentionally ignore an available index if it determines that the query will be faster without. For example, on a small table, a sequential scan might be faster than an index scan. In that case, the planner will switch to using the index as the table size grows, helping to future proof the query.

If additional indexes might improve your query, the Index Advisor shows the suggested indexes with the estimated improvement in startup and total costs:

Startup cost is the cost to fetch the first row
Total cost is the cost to fetch all the rows
Costs are in arbitrary units, where a single sequential page read costs 1.0 units.

Edit this page on GitHub

Watch video guide

Video guide preview
Is this helpful?

Yes

No
On this page
Create an index
Partial indexes
Ordering indexes
Reindexing
Index Advisor
Understanding Index Advisor results
Need some help?

Contact support
Latest product updates?

See Changelog
Something's not right?

Check system status
Database
Working with your database (basics)
Querying joins and nested tables
Querying Joins and Nested tables
The data APIs automatically detect relationships between Postgres tables. Since Postgres is a relational database, this is a very common scenario.

One-to-many joins#
Let's use an example database that stores countries and cities:

Tables

SQL
Countries

id name
1 United Kingdom
2 United States
Cities

id name country_id
1 London 1
2 Manchester 1
3 Los Angeles 2
4 New York 2
The APIs will automatically detect relationships based on the foreign keys:

JavaScript

Dart

Swift

Kotlin

Python

GraphQL

URL
const { data, error } = await supabase.from('countries').select(`  id, 
  name, 
  cities ( id, name )`)

TypeScript types for joins#
supabase-js always returns a data object (for success), and an error object (for unsuccessful requests).

These helper types provide the result types from any query, including nested types for database joins.

Given the following schema with a relation between cities and countries:

create table countries (
"id" serial primary key,
"name" text
);

create table cities (
"id" serial primary key,
"name" text,
"country_id" int references "countries"
);

We can get the nested CountriesWithCities type like this:

import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'

const countriesWithCitiesQuery = supabase.from('countries').select(`  id,
  name,
  cities (
    id,
    name
  )`)
type CountriesWithCities = QueryData<typeof countriesWithCitiesQuery>

const { data, error } = await countriesWithCitiesQuery
if (error) throw error
const countriesWithCities: CountriesWithCities = data

Many-to-many joins#
The data APIs will detect many-to-many joins. For example, if you have a database which stored teams of users (where each user could belong to many teams):

create table users (
"id" serial primary key,
"name" text
);

create table teams (
"id" serial primary key,
"team_name" text
);

create table members (
"user_id" int references users,
"team_id" int references teams,
primary key (user_id, team_id)
);

In these cases you don't need to explicitly define the joining table (members). If we wanted to fetch all the teams and the members in each team:

JavaScript

Dart

Swift

Kotlin

Python

GraphQL

URL
const { data, error } = await supabase.from('teams').select(`  id, 
  team_name, 
  users ( id, name )`)

Specifying the ON clause for joins with multiple foreign keys#
For example, if you have a project that tracks when employees check in and out of work shifts:

-- Employees
create table users (
"id" serial primary key,
"name" text
);

-- Badge scans
create table scans (
"id" serial primary key,
"user_id" int references users,
"badge_scan_time" timestamp
);

-- Work shifts
create table shifts (
"id" serial primary key,
"user_id" int references users,
"scan_id_start" int references scans, -- clocking in
"scan_id_end" int references scans, -- clocking out
"attendance_status" text
);

In this case, you need to explicitly define the join because the joining column on shifts is ambiguous as they are both referencing the scans table.

To fetch all the shifts with scan_id_start and scan_id_end related to a specific scan, use the following syntax:

JavaScript

Dart

Swift

Kotlin

Python

GraphQL
const { data, error } = await supabase.from('shifts').select(
`     *,
    start_scan:scans!scan_id_start (
      id,
      user_id,
      badge_scan_time
    ),
   end_scan:scans!scan_id_end (
     id, 
     user_id,
     badge_scan_time
    )
  `
)

Edit this page on GitHub
Is this helpful?

Yes

No
On this page
One-to-many joins
TypeScript types for joins
Many-to-many joins
Specifying the ON clause for joins with multiple foreign keys
Need some help?

Contact support
Latest product updates?

See Changelog
Something's not right?

Check system status
Database
Working with your database (basics)
JSON and unstructured data
Managing JSON and unstructured data
Using the JSON data type in Postgres.
Postgres supports storing and querying unstructured data.

JSON vs JSONB#
Postgres supports two types of JSON columns: json (stored as a string) and jsonb (stored as a binary). The recommended type is jsonb for almost all cases.

json stores an exact copy of the input text. Database functions must reparse the content on each execution.
jsonb stores database in a decomposed binary format. While this makes it slightly slower to input due to added conversion overhead, it is significantly faster to process, since no reparsing is needed.
When to use JSON/JSONB#
Generally you should use a jsonb column when you have data that is unstructured or has a variable schema. For example, if you wanted to store responses for various webhooks, you might not know the format of the response when creating the table. Instead, you could store the payload as a jsonb object in a single column.

Don't go overboard with json/jsonb columns. They are a useful tool, but most of the benefits of a relational database come from the ability to query and join structured data, and the referential integrity that brings.

Create JSONB columns#
json/jsonb is just another "data type" for Postgres columns. You can create a jsonb column in the same way you would create a text or int column:

SQL

Dashboard
create table books (
id serial primary key,
title text,
author text,
metadata jsonb
);

Inserting JSON data#
You can insert JSON data in the same way that you insert any other data. The data must be valid JSON.

SQL

Dashboard

JavaScript

Dart

Swift

Kotlin

Python
insert into books
(title, author, metadata)
values
(
'The Poky Little Puppy',
'Janette Sebring Lowrey',
'{"description":"Puppy is slower than other, bigger animals.","price":5.95,"ages":[3,6]}'
),
(
'The Tale of Peter Rabbit',
'Beatrix Potter',
'{"description":"Rabbit eats some vegetables.","price":4.49,"ages":[2,5]}'
),
(
'Tootle',
'Gertrude Crampton',
'{"description":"Little toy train has big dreams.","price":3.99,"ages":[2,5]}'
),
(
'Green Eggs and Ham',
'Dr. Seuss',
'{"description":"Sam has changing food preferences and eats unusually colored food.","price":7.49,"ages":[4,8]}'
),
(
'Harry Potter and the Goblet of Fire',
'J.K. Rowling',
'{"description":"Fourth year of school starts, big drama ensues.","price":24.95,"ages":[10,99]}'
);

Query JSON data#
Querying JSON data is similar to querying other data, with a few other features to access nested values.

Postgres support a range of JSON functions and operators. For example, the -> operator returns values as jsonb data. If you want the data returned as text, use the ->> operator.

SQL

JavaScript

Swift

Kotlin

Python

Result
select
title,
metadata ->> 'description' as description, -- returned as text
metadata -> 'price' as price,
metadata -> 'ages' -> 0 as low_age,
metadata -> 'ages' -> 1 as high_age
from books;

Validating JSON data#
Supabase provides the pg_jsonschema extension that adds the ability to validate json and jsonb data types against JSON Schema documents.

Once you have enabled the extension, you can add a "check constraint" to your table to validate the JSON data:

create table customers (
id serial primary key,
metadata json
);

alter table customers
add constraint check_metadata check (
json_matches_schema(
'{
"type": "object",
"properties": {
"tags": {
"type": "array",
"items": {
"type": "string",
"maxLength": 16
}
}
}
}',
metadata
)
);

Resources#
Postgres: JSON Functions and Operators
Postgres JSON types
Edit this page on GitHub

Watch video guide

Video guide preview
Is this helpful?

Yes

No
On this page
JSON vs JSONB
When to use JSON/JSONB
Create JSONB columns
Inserting JSON data
Query JSON data
Validating JSON data
Resources
Need some help?

Contact support
Latest product updates?

See Changelog
Something's not right?

Check system status

Supabase wordmark
DOCS
Start
Products
Build
Manage
Reference
Resources

Search
docs...

K
Dashboard

Main menu
Database
Overview
Fundamentals
Connecting to your database
Importing data
Securing your data
Working with your database (basics)
Managing tables, views, and data
Working with arrays
Managing indexes
Querying joins and nested tables
JSON and unstructured data
Working with your database (intermediate)
Implementing cascade deletes
Managing enums
Managing database functions
Managing database triggers
Managing database webhooks
Using Full Text Search
Partitioning your tables
Managing connections
Access and security
Row Level Security
Column Level Security
Hardening the Data API
Custom Claims & RBAC
Managing Postgres Roles
Using Custom Postgres Roles
Managing secrets with Vault
Superuser Access and Unsupported Operations
Configuration, optimization, and testing
Database configuration
Managing database replication
Query optimization
Database Advisors
Testing your database
Customizing Postgres config
Debugging
Timeouts
Debugging and monitoring
Debugging performance issues
Supavisor
ORM Quickstarts
Prisma
Drizzle
Postgres.js
GUI quickstarts
pgAdmin
PSQL
DBeaver
Extensions
Overview
HypoPG: Hypothetical indexes
plv8: Javascript Language
http: RESTful Client
index_advisor: Query optimization
PGAudit: Postgres Auditing
pgjwt: JSON Web Tokens
PGroonga: Multilingual Full Text Search
pgRouting: Geospatial Routing
pg_cron: Job Scheduling
pg_graphql: GraphQL Support
pg_hashids: Short UIDs
pg_jsonschema: JSON Schema Validation
pg_net: Async Networking
pg_plan_filter: Restrict Total Cost
pg_stat_monitor: Extended Query Performance Monitoring
pgvector: Embeddings and vector similarity
pg_stat_statements: SQL Planning and Execution Statistics
PostGIS: Geo queries
pgsodium (pending deprecation): Encryption Features
pgTAP: Unit Testing
plpgsql_check: PL/pgSQL Linter
timescaledb: Time-series data
uuid-ossp: Unique Identifiers
RUM: inverted index for full-text search
Foreign Data Wrappers
Overview
Connecting to Auth0
Connecting to Airtable
Connecting to AWS Cognito
Connecting to AWS S3
Connecting to BigQuery
Connecting to ClickHouse
Connecting to Firebase
Connecting to Logflare
Connecting to MSSQL
Connecting to Paddle
Connecting to Redis
Connecting to Snowflake
Connecting to Stripe
Examples
Drop All Tables in Schema
Select First Row per Group
Print PostgreSQL Version
Replicating from Supabase to External Postgres
Database
Working with your database (basics)
Managing tables, views, and data
Tables and Data
Tables are where you store your data.

Tables are similar to excel spreadsheets. They contain columns and rows.
For example, this table has 3 "columns" (id, name, description) and 4 "rows" of data:

id name description
1 The Phantom Menace Two Jedi escape a hostile blockade to find allies and come across a young boy who may bring balance to the Force.
2 Attack of the Clones Ten years after the invasion of Naboo, the Galactic Republic is facing a Separatist movement.
3 Revenge of the Sith As Obi-Wan pursues a new threat, Anakin acts as a double agent between the Jedi Council and Palpatine and is lured into a sinister plan to rule the galaxy.
4 Star Wars Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.
There are a few important differences from a spreadsheet, but it's a good starting point if you're new to Relational databases.

Creating tables#
When creating a table, it's best practice to add columns at the same time.

Tables and columns

You must define the "data type" of each column when it is created. You can add and remove columns at any time after creating a table.

Supabase provides several options for creating tables. You can use the Dashboard or create them directly using SQL.
We provide a SQL editor within the Dashboard, or you can connect to your database
and run the SQL queries yourself.

Dashboard

SQL
Go to the Table Editor page in the Dashboard.
Click New Table and create a table with the name todos.
Click Save.
Click New Column and create a column with the name task and type text.
Click Save.
When naming tables, use lowercase and underscores instead of spaces (e.g., table_name, not Table Name).

Columns#
You must define the "data type" when you create a column.

Data types#
Every column is a predefined type. PostgreSQL provides many default types, and you can even design your own (or use extensions) if the default types don't fit your needs. You can use any data type that Postgres supports via the SQL editor. We only support a subset of these in the Table Editor in an effort to keep the experience simple for people with less experience with databases.

Show/Hide default data types

You can "cast" columns from one type to another, however there can be some incompatibilities between types.
For example, if you cast a timestamp to a date, you will lose all the time information that was previously saved.

Primary keys#
A table can have a "primary key" - a unique identifier for every row of data. A few tips for Primary Keys:

It's recommended to create a Primary Key for every table in your database.
You can use any column as a primary key, as long as it is unique for every row.
It's common to use a uuid type or a numbered identity column as your primary key.
create table movies (
id bigint generated always as identity primary key
);

In the example above, we have:

created a column called id
assigned the data type bigint
instructed the database that this should be generated always as identity, which means that Postgres will automatically assign a unique number to this column.
Because it's unique, we can also use it as our primary key.
We could also use generated by default as identity, which would allow us to insert our own unique values.

create table movies (
id bigint generated by default as identity primary key
);

Loading data#
There are several ways to load data in Supabase. You can load data directly into the database or using the APIs.
Use the "Bulk Loading" instructions if you are loading large data sets.

Basic data loading#

SQL

JavaScript

Dart

Swift

Python

Kotlin
insert into movies
(name, description)
values
(
'The Empire Strikes Back',
'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda.'
),
(
'Return of the Jedi',
'After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star.'
);

Bulk data loading#
When inserting large data sets it's best to use PostgreSQL's COPY command.
This loads data directly from a file into a table. There are several file formats available for copying data: text, csv, binary, JSON, etc.

For example, if you wanted to load a CSV file into your movies table:

./movies.csv

"The Empire Strikes Back", "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda."
"Return of the Jedi", "After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star."
You would connect to your database directly and load the file with the COPY command:

psql -h DATABASE_URL -p 5432 -d postgres -U postgres \
 -c "\COPY movies FROM './movies.csv';"

Additionally use the DELIMITER, HEADER and FORMAT options as defined in the PostgreSQL COPY docs.

psql -h DATABASE_URL -p 5432 -d postgres -U postgres \
 -c "\COPY movies FROM './movies.csv' WITH DELIMITER ',' CSV HEADER"

If you receive an error FATAL: password authentication failed for user "postgres", reset your database password in the Database Settings and try again.

Joining tables with foreign keys#
Tables can be "joined" together using Foreign Keys.

Foreign Keys

This is where the "Relational" naming comes from, as data typically forms some sort of relationship.

In our "movies" example above, we might want to add a "category" for each movie (for example, "Action", or "Documentary").
Let's create a new table called categories and "link" our movies table.

create table categories (
id bigint generated always as identity primary key,
name text -- category name
);

alter table movies
add column category_id bigint references categories;

You can also create "many-to-many" relationships by creating a "join" table.
For example if you had the following situations:

You have a list of movies.
A movie can have several actors.
An actor can perform in several movies.

Dashboard

SQL

Schemas#
Tables belong to schemas. Schemas are a way of organizing your tables, often for security reasons.

Schemas and tables

If you don't explicitly pass a schema when creating a table, Postgres will assume that you want to create the table in the public schema.

We can create schemas for organizing tables. For example, we might want a private schema which is hidden from our API:

create schema private;

Now we can create tables inside the private schema:

create table private.salaries (
id bigint generated by default as identity primary key,
salary bigint not null,
actor_id bigint not null references public.actors
);

Views#
A View is a convenient shortcut to a query. Creating a view does not involve new tables or data. When run, an underlying query is executed, returning its results to the user.

Say we have the following tables from a database of a university:

students

id name type
1 Princess Leia undergraduate
2 Yoda graduate
3 Anakin Skywalker graduate
courses

id title code
1 Introduction to Postgres PG101
2 Authentication Theories AUTH205
3 Fundamentals of Supabase SUP412
grades

id student_id course_id result
1 1 1 B+
2 1 3 A+
3 2 2 A
4 3 1 A-
5 3 2 A
6 3 3 B-
Creating a view consisting of all the three tables will look like this:

create view transcripts as
select
students.name,
students.type,
courses.title,
courses.code,
grades.result
from grades
left join students on grades.student_id = students.id
left join courses on grades.course_id = courses.id;

alter view transcripts owner to authenticated;

Once done, we can now access the underlying query with:

select \* from transcripts;

View security#
By default, views are accessed with their creator's permission ("security definer"). If a privileged role creates a view, others accessing it will use that role's elevated permissions. To enforce row level security policies, define the view with the "security invoker" modifier.

-- alter a security_definer view to be security_invoker
alter view <view name>
set (security_invoker = true);

-- create a view with the security_invoker modifier
create view <view name> with(security_invoker=true) as (
select \* from <some table>
);

When to use views#
Views provide the several benefits:

Simplicity
Consistency
Logical Organization
Security
Simplicity#
As a query becomes more complex, it can be a hassle to call it over and over - especially when we run it regularly. In the example above, instead of repeatedly running:

select
students.name,
students.type,
courses.title,
courses.code,
grades.result
from
grades
left join students on grades.student_id = students.id
left join courses on grades.course_id = courses.id;

We can run this instead:

select \* from transcripts;

Additionally, a view behaves like a typical table. We can safely use it in table JOINs or even create new views using existing views.

Consistency#
Views ensure that the likelihood of mistakes decreases when repeatedly executing a query. In our example above, we may decide that we want to exclude the course Introduction to Postgres. The query would become:

select
students.name,
students.type,
courses.title,
courses.code,
grades.result
from
grades
left join students on grades.student_id = students.id
left join courses on grades.course_id = courses.id
where courses.code != 'PG101';

Without a view, we would need to go into every dependent query to add the new rule. This would increase in the likelihood of errors and inconsistencies, as well as introducing a lot of effort for a developer. With views, we can alter just the underlying query in the view transcripts. The change will be applied to all applications using this view.

Logical organization#
With views, we can give our query a name. This is extremely useful for teams working with the same database. Instead of guessing what a query is supposed to do, a well-named view can easily explain it. For example, by looking at the name of the view transcripts, we can infer that the underlying query might involve the students, courses, and grades tables.

Security#
Views can restrict the amount and type of data presented to a user. Instead of allowing a user direct access to a set of tables, we provide them a view instead. We can prevent them from reading sensitive columns by excluding them from the underlying query.

Materialized views#
A materialized view is a form of view but it also stores the results to disk. In subsequent reads of a materialized view, the time taken to return its results would be much faster than a conventional view. This is because the data is readily available for a materialized view while the conventional view executes the underlying query each time it is called.

Using our example above, a materialized view can be created like this:

create materialized view transcripts as
select
students.name,
students.type,
courses.title,
courses.code,
grades.result
from
grades
left join students on grades.student_id = students.id
left join courses on grades.course_id = courses.id;

Reading from the materialized view is the same as a conventional view:

select \* from transcripts;

Refreshing materialized views#
Unfortunately, there is a trade-off - data in materialized views are not always up to date. We need to refresh it regularly to prevent the data from becoming too stale. To do so:

refresh materialized view transcripts;

It's up to you how regularly refresh your materialized views, and it's probably different for each view depending on its use-case.

Materialized views vs conventional views#
Materialized views are useful when execution times for queries or views are too slow. These could likely occur in views or queries involving multiple tables and billions of rows. When using such a view, however, there should be tolerance towards data being outdated. Some use-cases for materialized views are internal dashboards and analytics.

Creating a materialized view is not a solution to inefficient queries. You should always seek to optimize a slow running query even if you are implementing a materialized view.

Resources#
Official Docs: Create table
Official Docs: Create view
PostgreSQL Tutorial: Create tables
PostgreSQL Tutorial: Add column
PostgreSQL Tutorial: Views
Edit this page on GitHub
Is this helpful?

Yes

No
On this page
Creating tables
Columns
Data types
Primary keys
Loading data
Basic data loading
Bulk data loading
Joining tables with foreign keys
Schemas
Views
View security
When to use views
Materialized views
Refreshing materialized views
Materialized views vs conventional views
Resources
Need some help?

Contact support
Latest product updates?

See Changelog
Something's not right?

Check system status
© Supabase Inc
—
Contributing
Author Styleguide
Open Source
SupaSquad
Privacy Settings
GitHub
Twitter
Discord

,
Tables and Data | Supabase Docs
