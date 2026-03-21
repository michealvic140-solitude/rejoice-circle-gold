-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ROLES ENUM
create type public.app_role as enum ('admin', 'moderator', 'user');

-- USER ROLES TABLE
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  unique (user_id, role)
);

-- PROFILES TABLE
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  first_name text not null default '',
  middle_name text,
  last_name text not null default '',
  nickname text,
  email text,
  phone text,
  dob text,
  age int,
  state_of_origin text,
  lga text,
  current_state text,
  current_address text,
  home_address text,
  bvn_nin text,
  profile_picture text,
  is_vip boolean default false,
  is_restricted boolean default false,
  is_banned boolean default false,
  is_frozen boolean default false,
  is_defaulter boolean default false,
  total_paid bigint default 0,
  trust_score int default 80,
  bank_acc_name text,
  bank_acc_number text,
  bank_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- GROUPS TABLE
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  contribution_amount bigint not null,
  cycle_type text not null check (cycle_type in ('daily','weekly','monthly')),
  total_slots int default 100,
  filled_slots int default 0,
  is_live boolean default false,
  is_locked boolean default false,
  chat_locked boolean default false,
  bank_name text,
  account_number text,
  account_name text,
  terms_text text default 'By joining this group you agree to make contributions on time.',
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- SLOTS TABLE
create table public.slots (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete cascade not null,
  seat_number int not null,
  user_id uuid references auth.users(id) on delete set null,
  username text,
  full_name text,
  status text not null default 'available' check (status in ('available','locked','taken')),
  locked_until timestamptz,
  payment_time text,
  payment_status text default 'unpaid' check (payment_status in ('unpaid','pending','paid','defaulter')),
  is_disbursed boolean default false,
  disbursed_at timestamptz,
  unique (group_id, seat_number)
);

-- TRANSACTIONS TABLE
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  group_id uuid references public.groups(id) on delete cascade,
  group_name text,
  user_id uuid references auth.users(id) on delete cascade not null,
  username text,
  seat_number int,
  amount bigint not null,
  status text default 'pending' check (status in ('pending','approved','declined')),
  screenshot_url text,
  admin_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- NOTIFICATIONS TABLE
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  message text not null,
  type text default 'info',
  read boolean default false,
  created_at timestamptz default now()
);

-- ANNOUNCEMENTS TABLE
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  type text default 'announcement' check (type in ('announcement','promotion','server-update','group-message')),
  image_url text,
  target_group_id uuid references public.groups(id) on delete cascade,
  admin_name text,
  created_at timestamptz default now()
);

-- SUPPORT TICKETS TABLE
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  username text,
  subject text not null,
  message text not null,
  attachment_url text,
  status text default 'open' check (status in ('open','replied','closed')),
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz default now()
);

-- AUDIT LOGS TABLE
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  performed_by uuid references auth.users(id) on delete set null,
  performed_by_username text,
  target_user_id uuid references auth.users(id) on delete set null,
  target_username text,
  type text default 'general',
  created_at timestamptz default now()
);

-- GROUP CHAT MESSAGES TABLE
create table public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  username text not null,
  message text not null,
  is_system boolean default false,
  created_at timestamptz default now()
);

-- EXIT REQUESTS TABLE
create table public.exit_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  username text,
  group_id uuid references public.groups(id) on delete cascade not null,
  group_name text,
  reason text,
  status text default 'pending' check (status in ('pending','approved','declined')),
  created_at timestamptz default now()
);

-- SEAT CHANGE REQUESTS TABLE
create table public.seat_change_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  username text,
  group_id uuid references public.groups(id) on delete cascade not null,
  group_name text,
  from_seat int not null,
  to_seat int not null,
  reason text,
  status text default 'pending' check (status in ('pending','approved','declined')),
  created_at timestamptz default now()
);

-- PAYOUT QUEUE TABLE
create table public.payout_queue (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  username text,
  seat_number int not null,
  amount bigint not null,
  status text default 'pending' check (status in ('pending','disbursed','cancelled')),
  disbursed_at timestamptz,
  created_at timestamptz default now()
);

-- CONTACT INFO TABLE
create table public.contact_info (
  id int primary key default 1,
  whatsapp text,
  facebook text,
  email text,
  call_number text,
  sms_number text,
  updated_at timestamptz default now()
);

-- PLATFORM SETTINGS TABLE
create table public.platform_settings (
  id int primary key default 1,
  maintenance_mode boolean default false,
  maintenance_message text default 'The platform is currently under maintenance. Please check back later.',
  updated_at timestamptz default now()
);

-- FORGOTTEN PASSWORD REQUESTS TABLE
create table public.forgot_password_requests (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  status text default 'pending' check (status in ('pending','resolved')),
  admin_note text,
  created_at timestamptz default now()
);

-- RLS ENABLE
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.groups enable row level security;
alter table public.slots enable row level security;
alter table public.transactions enable row level security;
alter table public.notifications enable row level security;
alter table public.announcements enable row level security;
alter table public.support_tickets enable row level security;
alter table public.audit_logs enable row level security;
alter table public.group_messages enable row level security;
alter table public.exit_requests enable row level security;
alter table public.seat_change_requests enable row level security;
alter table public.payout_queue enable row level security;
alter table public.contact_info enable row level security;
alter table public.platform_settings enable row level security;
alter table public.forgot_password_requests enable row level security;

-- SECURITY DEFINER FUNCTION
create or replace function public.get_user_role(_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role::text from public.user_roles where user_id = _user_id limit 1;
$$;

-- PROFILES POLICIES
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (get_user_role(auth.uid()) in ('admin','moderator'));
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can update any profile" on public.profiles for update using (get_user_role(auth.uid()) = 'admin');
create policy "Anyone can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- USER ROLES POLICIES
create policy "Users can view own role" on public.user_roles for select using (auth.uid() = user_id);
create policy "Admins can view all roles" on public.user_roles for select using (get_user_role(auth.uid()) = 'admin');
create policy "Admins can manage roles" on public.user_roles for all using (get_user_role(auth.uid()) = 'admin');
create policy "Allow insert own role on signup" on public.user_roles for insert with check (auth.uid() = user_id);

-- GROUPS POLICIES
create policy "Anyone can view groups" on public.groups for select using (true);
create policy "Admins can manage groups" on public.groups for all using (get_user_role(auth.uid()) in ('admin','moderator'));

-- SLOTS POLICIES
create policy "Anyone logged in can view slots" on public.slots for select using (auth.uid() is not null);
create policy "Users can claim slots" on public.slots for insert with check (auth.uid() = user_id);
create policy "Users can update own slot" on public.slots for update using (auth.uid() = user_id);
create policy "Admins can manage all slots" on public.slots for all using (get_user_role(auth.uid()) in ('admin','moderator'));

-- TRANSACTIONS POLICIES
create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Admins can view all transactions" on public.transactions for select using (get_user_role(auth.uid()) in ('admin','moderator'));
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Admins can update transactions" on public.transactions for update using (get_user_role(auth.uid()) in ('admin','moderator'));

-- NOTIFICATIONS POLICIES
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Anyone can insert notifications" on public.notifications for insert with check (true);
create policy "Users can mark own read" on public.notifications for update using (auth.uid() = user_id);

-- ANNOUNCEMENTS POLICIES
create policy "Anyone can view announcements" on public.announcements for select using (true);
create policy "Admins can manage announcements" on public.announcements for all using (get_user_role(auth.uid()) = 'admin');

-- SUPPORT TICKETS POLICIES
create policy "Users can view own tickets" on public.support_tickets for select using (auth.uid() = user_id);
create policy "Users can create tickets" on public.support_tickets for insert with check (auth.uid() = user_id);
create policy "Admins can manage all tickets" on public.support_tickets for all using (get_user_role(auth.uid()) in ('admin','moderator'));

-- AUDIT LOGS POLICIES
create policy "Users can view own audit logs" on public.audit_logs for select using (auth.uid() = target_user_id);
create policy "Admins can view all audit logs" on public.audit_logs for select using (get_user_role(auth.uid()) in ('admin','moderator'));
create policy "System can insert audit logs" on public.audit_logs for insert with check (true);

-- GROUP MESSAGES POLICIES
create policy "Group members can view messages" on public.group_messages for select using (auth.uid() is not null);
create policy "Group members can send messages" on public.group_messages for insert with check (auth.uid() = user_id);

-- EXIT REQUESTS POLICIES
create policy "Users can view own exit requests" on public.exit_requests for select using (auth.uid() = user_id);
create policy "Users can create exit requests" on public.exit_requests for insert with check (auth.uid() = user_id);
create policy "Admins can manage exit requests" on public.exit_requests for all using (get_user_role(auth.uid()) in ('admin','moderator'));

-- SEAT CHANGE REQUESTS POLICIES
create policy "Users can manage own seat change requests" on public.seat_change_requests for all using (auth.uid() = user_id);
create policy "Admins can manage seat changes" on public.seat_change_requests for all using (get_user_role(auth.uid()) in ('admin','moderator'));

-- PAYOUT QUEUE POLICIES
create policy "Users can view own payouts" on public.payout_queue for select using (auth.uid() = user_id);
create policy "Admins can manage payouts" on public.payout_queue for all using (get_user_role(auth.uid()) in ('admin','moderator'));

-- CONTACT INFO POLICIES
create policy "Anyone can view contact info" on public.contact_info for select using (true);
create policy "Admins can manage contact info" on public.contact_info for all using (get_user_role(auth.uid()) = 'admin');

-- PLATFORM SETTINGS POLICIES
create policy "Anyone can view platform settings" on public.platform_settings for select using (true);
create policy "Admins can manage platform settings" on public.platform_settings for all using (get_user_role(auth.uid()) = 'admin');

-- FORGOT PASSWORD POLICIES
create policy "Anyone can insert password requests" on public.forgot_password_requests for insert with check (true);
create policy "Admins can manage password requests" on public.forgot_password_requests for all using (get_user_role(auth.uid()) = 'admin');

-- TRIGGER: Auto-create profile and role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, first_name, last_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('support-attachments', 'support-attachments', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('announcements', 'announcements', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;

create policy "Users can upload payment proofs" on storage.objects for insert with check (bucket_id = 'payment-proofs' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can view own payment proofs" on storage.objects for select using (bucket_id = 'payment-proofs' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Admins can view all payment proofs" on storage.objects for select using (bucket_id = 'payment-proofs' and get_user_role(auth.uid()) in ('admin','moderator'));
create policy "Announcements images are public" on storage.objects for select using (bucket_id = 'announcements');
create policy "Admins can upload announcement images" on storage.objects for insert with check (bucket_id = 'announcements' and get_user_role(auth.uid()) = 'admin');
create policy "Avatars are public" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload own avatar" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users can upload support attachments" on storage.objects for insert with check (bucket_id = 'support-attachments' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Admins can view support attachments" on storage.objects for select using (bucket_id = 'support-attachments' and get_user_role(auth.uid()) in ('admin','moderator'));

-- SEED DATA
insert into public.contact_info (id, whatsapp, facebook, email, call_number, sms_number)
values (1, '+234 800 000 0000', 'https://facebook.com/rejoiceajo', 'support@rejoiceajo.com', '+234 800 000 0001', '+234 800 000 0002')
on conflict (id) do nothing;

insert into public.platform_settings (id, maintenance_mode, maintenance_message)
values (1, false, 'We are performing scheduled maintenance. We will be back shortly. Thank you for your patience.')
on conflict (id) do nothing;

insert into public.announcements (title, body, type, admin_name) values 
  ('Welcome to Rejoice Ajo', 'We are excited to launch our luxury rotating savings platform. Start saving today with trusted circles!', 'announcement', 'Admin'),
  ('New Groups Available', 'Join our Golden Circle and Silver Vault savings groups. Limited slots available!', 'promotion', 'Admin');

insert into public.groups (id, name, description, contribution_amount, cycle_type, total_slots, filled_slots, is_live, bank_name, account_number, account_name, terms_text)
values
  ('a0000000-0000-0000-0000-000000000001', 'Golden Circle Alpha', 'Our premier daily contribution group for serious savers. Members contribute daily and receive payouts in slot order.', 5000, 'daily', 100, 0, true, 'First Bank Nigeria', '3012345678', 'Rejoice Ajo Platform', 'By joining this group you agree to make daily contributions on time. Failure to pay will result in defaulter status.'),
  ('a0000000-0000-0000-0000-000000000002', 'Silver Vault Weekly', 'Weekly contributions for those who prefer a relaxed saving pace. Ideal for mid-level savers.', 25000, 'weekly', 100, 0, true, 'GTBank', '0123456789', 'Rejoice Ajo Platform', 'Weekly contributions must be made before 11:59 PM every Sunday. Late payment = defaulter status.'),
  ('a0000000-0000-0000-0000-000000000003', 'Platinum Monthly Reserve', 'Monthly contributions for high-value savers. Receive large payout when your slot arrives.', 100000, 'monthly', 100, 0, false, 'Zenith Bank', '2012345678', 'Rejoice Ajo Platform', 'Monthly contributions are due on the 1st of each month. Members must contribute for the full 12-month cycle.'),
  ('a0000000-0000-0000-0000-000000000004', 'Diamond Elite Circle', 'Exclusive group for top contributors. Limited slots available for our most trusted members.', 50000, 'weekly', 100, 0, true, 'Access Bank', '0098765432', 'Rejoice Ajo Platform', 'Diamond Elite members hold a higher standard. Contributions must be verified with a payment screenshot uploaded by 9 PM every Sunday.')
on conflict (id) do nothing;