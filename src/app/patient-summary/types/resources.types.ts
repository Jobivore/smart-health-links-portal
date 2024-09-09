import { Patient } from './patient.types';
import { Condition } from './resources/condition.types';
import { Organization } from './resources/organisation.types';

export enum ResourceType {
  Patient = 'Patient',
  Composition = 'Composition',
  Organization = 'Organization',
  AllergyIntolerance = 'AllergyIntolerance',
  Condition = 'Condition',
}

export interface ResourceMap {
  Patient: Patient;
  Organization: Organization;
  Condition: Condition;
  // TODO:Add different resources such as Composition, Condition, etc..
}
