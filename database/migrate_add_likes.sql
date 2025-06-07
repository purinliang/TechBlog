-- Likes table
create table likes (
  id serial primary key,
  post_id integer references posts(id) on delete cascade,
  user_id integer references profiles(id) on delete cascade,
  created_at timestamp default current_timestamp,
  unique(post_id, user_id)
);
