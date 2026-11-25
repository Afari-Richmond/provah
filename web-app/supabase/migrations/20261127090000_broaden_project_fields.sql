-- The field taxonomy read as tech-only (every non-tech category still had
-- "& Technology"/"Agritech"/"EdTech" bolted on), which doesn't fit Provah's
-- stated scope of all final-year capstone projects, not just CS ones.
-- Rename the fields that were tech-coded, split "Engineering & Technology"
-- into three sharper categories, and add Climate Science and Social
-- Sciences & Humanities so non-STEM capstones have a real home.
alter table public.projects drop constraint projects_field_check;

update public.projects set field = 'Finance & Accounting' where field = 'Finance & Technology';
update public.projects set field = 'Agriculture & Environment' where field = 'Agriculture & Agritech';
update public.projects set field = 'Education' where field = 'Education & EdTech';
update public.projects set field = 'Business & Management' where field = 'Business & Social Impact';

alter table public.projects add constraint projects_field_check
  check (field in (
    'Engineering & Technology',
    'Artificial Intelligence',
    'Cybersecurity',
    'Health & Medicine',
    'Finance & Accounting',
    'Business & Management',
    'Agriculture & Environment',
    'Climate Science',
    'Energy & Sustainability',
    'Education',
    'Creative & Media',
    'Social Sciences & Humanities'
  ));
