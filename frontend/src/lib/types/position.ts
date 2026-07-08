export interface Position {
  positionId: number;
  positionName: string;
  level: number | null;
}

export interface PositionRequest {
  positionName: string;
  level: number | null;
}
