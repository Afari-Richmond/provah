-- Projects only had short problem/solution write-ups — add an optional
-- long-form description for students who want to go deeper, and an
-- optional direct link to a thesis/write-up document (distinct from the
-- generic project_documents uploads, same pattern as github_url/demo_url).
alter table public.projects add column long_description text;
alter table public.projects add column thesis_url text;
