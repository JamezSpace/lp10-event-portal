import { PersonApiModel } from '../api-models/person.api-model';

export interface PersonUiModel
  extends Omit<PersonApiModel, '_id' | 'created_at' | 'modified_at'> {
  id: number;
  parish: string;
  zone: string;
  region?: string;
  province?: string;
}
