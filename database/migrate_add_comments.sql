-- Comments table
create table comments (
  id serial primary key,
  post_id integer not null references posts(id) on delete cascade,
  author_id integer references profiles(id) on delete set null,
  parent_comment_id integer references comments(id) on delete cascade,
  content text not null,
  like_count integer default 0,
  reply_count integer default 0,
  created_at timestamp default current_timestamp
);
