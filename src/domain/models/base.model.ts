export interface TimeStampsModel {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BaseModel {
  id: string;
}

export interface LocationModel extends TimeStampsModel {
  latitude?: number;
  longitude?: number;
}
