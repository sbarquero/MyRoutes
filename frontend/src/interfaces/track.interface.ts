import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

export interface Track {
  _id: string;
  name: string;
  description: string;
  userId: string;
  isPublic: boolean;
  createAt: Date;
  updateAt: Date;
  uploadAt: Date;
  geojsonData: FeatureCollection<Geometry, GeoJsonProperties>;
  visible: boolean;
}

export interface UpdateTrackDto {
  name: string;
  description: string;
  isPublic: boolean;
  createAt: Date;
}
