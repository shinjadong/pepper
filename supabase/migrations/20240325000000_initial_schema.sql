-- Create notes table
create table if not exists public.notes (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    content text,
    folder_id uuid references public.folders(id) on delete set null,
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create folders table
create table if not exists public.folders (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    parent_id uuid references public.folders(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.notes enable row level security;
alter table public.folders enable row level security;

create policy "Users can only see their own notes"
    on public.notes for select
    using (auth.uid() = user_id);

create policy "Users can insert their own notes"
    on public.notes for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own notes"
    on public.notes for update
    using (auth.uid() = user_id);

create policy "Users can delete their own notes"
    on public.notes for delete
    using (auth.uid() = user_id);

create policy "Users can only see their own folders"
    on public.folders for select
    using (auth.uid() = user_id);

create policy "Users can insert their own folders"
    on public.folders for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own folders"
    on public.folders for update
    using (auth.uid() = user_id);

create policy "Users can delete their own folders"
    on public.folders for delete
    using (auth.uid() = user_id);

-- Create functions for updating timestamps
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

-- Create triggers for updating timestamps
create trigger handle_notes_updated_at
    before update on public.notes
    for each row
    execute function public.handle_updated_at();

create trigger handle_folders_updated_at
    before update on public.folders
    for each row
    execute function public.handle_updated_at();
