-- Fix overly permissive INSERT policies
-- Replace "Anyone can insert notifications" with proper check
drop policy if exists "Anyone can insert notifications" on public.notifications;
create policy "Authenticated users can insert notifications" on public.notifications
  for insert with check (auth.uid() is not null);

-- Fix "System can insert audit logs" — restrict to authenticated
drop policy if exists "System can insert audit logs" on public.audit_logs;
create policy "Authenticated users can insert audit logs" on public.audit_logs
  for insert with check (auth.uid() is not null);

-- Fix "Anyone can insert password requests" — require at least something meaningful
drop policy if exists "Anyone can insert password requests" on public.forgot_password_requests;
create policy "Public can insert password requests" on public.forgot_password_requests
  for insert with check (identifier is not null and length(identifier) > 2);