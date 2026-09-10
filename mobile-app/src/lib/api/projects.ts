import { ok, type ApiResponse } from "@/lib/api/envelope";
import { getProjectById, mockProjects } from "@/lib/mocks/projects";
import type { Project } from "@/lib/types/project";

// Mock-backed for now. TODO: swap to real `fetch` calls against
// /api/v1/discovery/projects once `server/` exists (see context/progress-tracker.md).

export async function listProjects(): Promise<ApiResponse<Project[]>> {
  return ok(mockProjects);
}

export async function fetchProjectById(id: string): Promise<ApiResponse<Project | undefined>> {
  return ok(getProjectById(id));
}
