import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Observable } from '@angular/core';

@Injectable()
export class SchemaChangerService {

  // Observable descendant sources
  private selectedDescendantSource = new Subject<any>();

  // Observable descendant streams
  private selectedDescendantChanged$ = this.selectedDescendantSource.asObservable();

  selectedDescendantChanged() {
    return this.selectedDescendantChanged$;
  }

  // Service message commands
  announceDescendantChange(idx: string, descendantName: string, isRequestSchema: boolean, responseCode: string) {
    this.selectedDescendantSource.next({idx:idx, name:descendantName, isRequestSchema:isRequestSchema, responseCode:responseCode});
  }

}
