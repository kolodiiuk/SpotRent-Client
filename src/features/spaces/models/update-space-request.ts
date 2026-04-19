import {CreateSpaceRequest} from './create-space-request';
import {AttributeValue} from './attribute-value';

export interface UpdateSpaceRequest extends CreateSpaceRequest {
  ownerId?: number;
  attributeValues?: AttributeValue[];
}
