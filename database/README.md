## How to Set Up the Database

This project uses **PostgreSQL**. You can choose:

- Local PostgreSQL (recommended for development)
- Supabase (easier for hosting)

### Initialize Tables

Log in as the PostgreSQL superuser:

```bash
sudo -u postgres psql
```

Switch to your database:

```sql
\c techblog
```

Run the following SQL scripts **in order** to create all tables and seed the schema:

```plain
database/drop_tables.sql
database/init_profiles_and_posts.sql
database/migrate_add_comments.sql
database/migrate_add_likes.sql
```

Replace `techblog_admin` and `techblog` with your local PostgreSQL credentials.

Then change table ownership:

```sql
ALTER TABLE profiles OWNER TO techblog_admin;
ALTER TABLE posts OWNER TO techblog_admin;
ALTER TABLE comments OWNER TO techblog_admin;
ALTER TABLE likes OWNER TO techblog_admin;
```

Then Exit with `\q`.

### Test the Connection

```bash
psql -U techblog_admin -d techblog -W
```

Once connected, test:

```sql
\dt
```

The result should be:

```plain
             List of relations
 Schema |   Name   | Type  |     Owner
--------+----------+-------+----------------
 public | comments | table | techblog_admin
 public | likes    | table | techblog_admin
 public | posts    | table | techblog_admin
 public | profiles | table | techblog_admin
```
