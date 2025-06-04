-- Drop tables if exist
drop table if exists posts;
drop table if exists profiles;

-- Users table (simplified, not using Supabase auth.users)
create table profiles (
  id serial primary key,
  username text not null unique,
  password_hash text not null,
  created_at timestamp default current_timestamp
);

-- Posts table
create table posts (
  id serial primary key,
  title text not null,
  content text not null,
  author_id integer references profiles(id) on delete set null,
  created_at timestamp default current_timestamp
);
