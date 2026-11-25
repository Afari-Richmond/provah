-- profiles.field_of_study is freeform text (no check constraint), so the
-- projects.field renames never touched it — profiles created against the
-- old taxonomy (including the original 3-category "Engineering" era) still
-- show stale values in search results and on profile pages.
update public.profiles set field_of_study = 'Engineering & Technology' where field_of_study = 'Engineering';
update public.profiles set field_of_study = 'Finance & Accounting' where field_of_study = 'Finance & Technology';
update public.profiles set field_of_study = 'Agriculture & Environment' where field_of_study = 'Agriculture & Agritech';
update public.profiles set field_of_study = 'Education' where field_of_study = 'Education & EdTech';
update public.profiles set field_of_study = 'Business & Management' where field_of_study = 'Business & Social Impact';
