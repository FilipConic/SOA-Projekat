export interface ExecutionKeyPointDTO {
  id: string;
  name: string;
  description: string;
  image?: string;
  latitude: number;
  longitude: number;
  order: number;
  isCompleted: boolean;
  completedAt?: string | Date;
}

export interface TourExecutionDTO {
  id: string;
  tourId: string;
  tourTitle: string;
  tourDescription: string;
  status: string;
  startTime: string | Date;
  endTime?: string | Date;
  lastActivity: string | Date;
  keypoints: ExecutionKeyPointDTO[];
}

export interface PositionDTO {
  latitude: number;
  longitude: number;
}