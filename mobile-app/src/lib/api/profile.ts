import { ok, type ApiResponse } from "@/lib/api/envelope";
import { mockProfessional, mockStudent } from "@/lib/mocks/users";
import type { ProfessionalProfile, StudentProfile } from "@/lib/types/user";

// Mock-backed for now. TODO: swap to real `fetch` calls against
// /api/v1/students/me and /api/v1/professionals/me once `server/` exists.

export async function fetchStudentProfile(): Promise<ApiResponse<StudentProfile>> {
  return ok(mockStudent);
}

export async function fetchProfessionalProfile(): Promise<ApiResponse<ProfessionalProfile>> {
  return ok(mockProfessional);
}
