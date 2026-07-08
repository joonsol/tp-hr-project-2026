import { apiFetch } from "@/lib/api/client";
import { Position, PositionRequest } from "@/lib/types/position";

export function listPositions(): Promise<Position[]> {
  return apiFetch<Position[]>("/positions");
}

export function getPosition(id: number): Promise<Position> {
  return apiFetch<Position>(`/positions/${id}`);
}

export function createPosition(request: PositionRequest): Promise<Position> {
  return apiFetch<Position>("/positions", { method: "POST", body: JSON.stringify(request) });
}

export function updatePosition(id: number, request: PositionRequest): Promise<Position> {
  return apiFetch<Position>(`/positions/${id}`, { method: "PUT", body: JSON.stringify(request) });
}

export function deletePosition(id: number): Promise<void> {
  return apiFetch<void>(`/positions/${id}`, { method: "DELETE" });
}
