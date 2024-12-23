-- Enable RLS
alter table notes enable row level security;
alter table folders enable row level security;

-- Add columns to notes table
alter table notes 
  add column is_favorite boolean default false,
  add column is_trashed boolean default false,
  add column trashed_at timestamp with time zone;

-- Add note_count to folders table
alter table folders
  add column note_count integer default 0;

-- Create history table
create table history (
  id uuid default uuid_generate_v4() primary key,
  type text not null check (type in ('MOVE_NOTE', 'MOVE_FOLDER', 'RENAME_NOTE', 'RENAME_FOLDER')),
  note_id uuid references notes(id) on delete set null,
  folder_id uuid references folders(id) on delete set null,
  from_folder_id uuid references folders(id) on delete set null,
  to_folder_id uuid references folders(id) on delete set null,
  from_name text,
  to_name text,
  timestamp timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS on history table
alter table history enable row level security;

-- RLS policies
create policy "Users can view their own history"
  on history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own history"
  on history for insert
  with check (auth.uid() = user_id);

-- Update note_count function
create or replace function update_folder_note_count()
returns trigger as $$
begin
  -- Decrement old folder's count
  if (TG_OP = 'DELETE' or (TG_OP = 'UPDATE' and OLD.folder_id is distinct from NEW.folder_id)) then
    update folders
    set note_count = note_count - 1
    where id = OLD.folder_id;
  end if;

  -- Increment new folder's count
  if (TG_OP = 'INSERT' or (TG_OP = 'UPDATE' and OLD.folder_id is distinct from NEW.folder_id)) then
    update folders
    set note_count = note_count + 1
    where id = NEW.folder_id;
  end if;

  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

-- Create trigger for note_count
drop trigger if exists update_folder_note_count_trigger on notes;
create trigger update_folder_note_count_trigger
  after insert or update of folder_id or delete
  on notes
  for each row
  execute function update_folder_note_count();

-- Update folder policies
create policy "Users can view their own folders"
  on folders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own folders"
  on folders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own folders"
  on folders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own folders"
  on folders for delete
  using (auth.uid() = user_id);

-- Update note policies
create policy "Users can view their own notes"
  on notes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notes"
  on notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notes"
  on notes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notes"
  on notes for delete
  using (auth.uid() = user_id);
