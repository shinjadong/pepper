-- presence 테이블 생성
create table if not exists presence (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  block_id uuid references blocks(id) on delete set null,
  last_seen timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- presence 테이블에 RLS 정책 추가
alter table presence enable row level security;

create policy "사용자는 자신의 presence를 수정할 수 있습니다."
  on presence for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "모든 사용자가 presence를 볼 수 있습니다."
  on presence for select
  using (true);

-- 실시간 구독을 위한 함수 생성
create or replace function handle_presence_updated()
returns trigger
language plpgsql
as $$
begin
  perform pg_notify(
    'presence',
    json_build_object(
      'user_id', new.user_id,
      'block_id', new.block_id,
      'last_seen', new.last_seen
    )::text
  );
  return new;
end;
$$;

-- 트리거 생성
create trigger on_presence_updated
  after insert or update or delete
  on presence
  for each row
  execute function handle_presence_updated();
