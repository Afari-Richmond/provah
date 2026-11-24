-- Expand projects.field from 3 to 8 categories. Safe to do without a data
-- migration: there are zero published projects in production at the time
-- of this change (confirmed via REST API before writing this migration).

alter table public.projects drop constraint projects_field_check;

alter table public.projects add constraint projects_field_check
  check (field in (
    'Engineering & Technology',
    'Health & Medicine',
    'Finance & Technology',
    'Agriculture & Agritech',
    'Energy & Sustainability',
    'Education & EdTech',
    'Creative & Media',
    'Business & Social Impact'
  ));
