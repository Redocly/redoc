import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import {DescendantInfo} from "../utils/spec-manager";


@Injectable()
export class SchemaChangerService {

  // Observable descendant sources
  private selectedDescendantSource = new Subject<any>();

  // Observable descendant streams
  selectedDescendantChanged$ = this.selectedDescendantSource.asObservable();

  // Service message commands
  announceDescendantChange(idx: string, descendantName: string, isRequestSchema: boolean, responseCode: string) {
    this.selectedDescendantSource.next({idx:idx, name:descendantName, isRequestSchema:isRequestSchema, responseCode:responseCode});
  }

}