-- Comments table
create table comments (
  id serial primary key,
  post_id integer references posts(id) on delete cascade,
  author_id integer references profiles(id) on delete set null,
  content text not null,
  created_at timestamp default current_timestamp
);
