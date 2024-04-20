import { trigger, transition, style, animate } from '@angular/animations';
export const modalAnimation = trigger('modalAnimation', [
  transition(':enter', [
    style({ top: '-100%' }),
    animate('500ms', style({ top: '50%' })),
  ]),
  transition(':leave', [
    animate('500ms', style({ top: '-100%' }))
  ])
])
