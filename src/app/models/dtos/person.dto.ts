import { PersonUiModel } from "../ui-models/person.ui-model";

export interface PersonDTO extends Omit<PersonUiModel, 'id'> {}