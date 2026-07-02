export type StatefulEvents =
  | { type: 'approved' }
  | { type: 'rejected' }
  | { type: 'resources-assigned' }
  | { type: 'revision-accepted' }
  | { type: 'revision-rejected' }
  | { type: 'promise-rejected' }
  | { type: 'promise-accepted' }
  | { type: 'studies-accepted' }
  | { type: 'studies-rejected' }
  | { type: 'anteproject-accepted' }
  | { type: 'anteproject-rejected' }
  | { type: 'titles-accepted' }
  | { type: 'titles-rejected' }
  | { type: 'promise-paid' }
  | { type: 'promise-not-paid' };
