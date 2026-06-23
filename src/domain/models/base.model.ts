export interface TimeStampsModel {
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BaseModel extends TimeStampsModel {
  id: string;
}

export interface LocationModel extends TimeStampsModel {
  latitude?: number;
  longitude?: number;
}
