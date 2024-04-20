import { DynamicDragDropGreensockHTMLComponent } from './dynamic-html-dragdrop-greensock.component';

import { NgModule, ModuleWithProviders } from '@angular/core';
import { DynamicHTMLComponent } from './dynamic-html.component';
import { DynamicHTMLOptions } from './options';
import { DynamicHTMLRenderer } from './renderer';
import { InputService } from './inputService';
import { DynamicDragDropHTMLComponent } from './dynamic-html-dragdrop.component';
import { DynamicHTMLDrawlineComponent } from './dynamic-html-drawline.component';
import { DynamicDragDropMultipleHTMLComponent } from './dynamic-html-dragdrop-multiple.component';
import { DynamicColorPickerHTMLComponent } from './dynamic-html-colorpicker.component';
import { DynamicCheckBooleanHTMLComponent } from './dynamic-html-check-boolean.component';
import { DynamicCheckMultipleChoicesHTMLComponent } from './dynamic-html-check-multiplechoices.component';
import { DynamicHtmlCircleCharacterComponent } from './dynamic-html-circle-character.component';
import { DynamicDragDropSortGreensockHTMLComponent } from './dynamic-html-dragdrop-sort-greensock.component';
import { DynamicHTMLDrawline2Component } from './dynamic-html-drawline2.component';
import { DynamicHtmlChooseOnTheMapComponent } from './dynamic-html-choose-on-the-map.component';
import { DynamicHtmlDragdropBebrasGsapComponent } from './dynamic-html-dragdrop-bebras-gsap.component';
import { CommonModule } from '@angular/common';
import { DynamicHtmlBebrasPlantingProblem } from './dynamic-html-bebras-planting-problem.component';
import { DynamicHtmlBebrasPaintingHouses } from './dynamic-html-bebras-painting-houses.component';
import { DynamicHtmlClickOrderComponent } from './dynamic-html-click-order.component';
import { DynamicHtmlClickOrderCellsComponent } from './dynamic-html-click-order-cells.component';
import { DynamicHtmlSelectDropdownABCComponent } from './dynamic-html-select-dropdown-abc.component';
import { DynamicHTMLRecordingComponent } from './dynamic-html-recording.component';
import { MathjaxModule } from '../mathjax/mathjax.module';
import { DynamicHtmlInputByKeypadComponent } from './dynamic-html-input-by-keypad.component';
import { DynamicHTMLRecordingElsaComponent } from './dynamic-html-recording-elsa.component';
import { DynamicPictureDragdropAnswerComponent } from './dynamic-picture-dragdrop-answer.component';
import { DynamicPicturePickAnswerComponent } from './dynamic-picture-pick-answer.component';
import { DynamicHtmlTextByKeypadComponent } from './dynamic-html-text-by-keypad.component';
import { SafeHtmlPipe } from '../../common/safeHtml.pipe';

@NgModule({
    declarations: [
        DynamicHTMLComponent,
        DynamicDragDropHTMLComponent,
        DynamicHTMLDrawlineComponent,
        DynamicHtmlChooseOnTheMapComponent,
        DynamicDragDropMultipleHTMLComponent,
        DynamicColorPickerHTMLComponent,
        DynamicCheckBooleanHTMLComponent,
        DynamicCheckMultipleChoicesHTMLComponent,
        DynamicHtmlCircleCharacterComponent,
        DynamicDragDropGreensockHTMLComponent,
        DynamicDragDropSortGreensockHTMLComponent,
        DynamicHTMLDrawline2Component,
        DynamicHtmlDragdropBebrasGsapComponent,
        DynamicHtmlBebrasPlantingProblem,
        DynamicHtmlBebrasPaintingHouses,
        DynamicHtmlClickOrderComponent,
        DynamicHtmlClickOrderCellsComponent,
        DynamicHtmlSelectDropdownABCComponent,
        DynamicHTMLRecordingComponent,
        DynamicHtmlInputByKeypadComponent,
        DynamicHTMLRecordingElsaComponent,
        DynamicPicturePickAnswerComponent,
        DynamicPictureDragdropAnswerComponent,
        DynamicHtmlTextByKeypadComponent
    ],
    imports: [
        MathjaxModule,
        CommonModule,
        SafeHtmlPipe
    ],
    exports: [
        DynamicHTMLComponent,
        DynamicDragDropHTMLComponent,
        DynamicHTMLDrawlineComponent,
        DynamicHtmlChooseOnTheMapComponent,
        DynamicDragDropMultipleHTMLComponent,
        DynamicColorPickerHTMLComponent,
        DynamicCheckBooleanHTMLComponent,
        DynamicCheckMultipleChoicesHTMLComponent,
        DynamicHtmlCircleCharacterComponent,
        DynamicDragDropGreensockHTMLComponent,
        DynamicDragDropSortGreensockHTMLComponent,
        DynamicHTMLDrawline2Component,
        DynamicHtmlDragdropBebrasGsapComponent,
        DynamicHtmlBebrasPlantingProblem,
        DynamicHtmlBebrasPaintingHouses,
        DynamicHtmlClickOrderComponent,
        DynamicHtmlClickOrderCellsComponent,
        DynamicHtmlSelectDropdownABCComponent,
        DynamicHTMLRecordingComponent,
        DynamicHtmlInputByKeypadComponent,
        DynamicHTMLRecordingElsaComponent,
        DynamicPicturePickAnswerComponent,
        DynamicPictureDragdropAnswerComponent,
        DynamicHtmlTextByKeypadComponent
    ],
})
export class DynamicHTMLModule {
    static forRoot(options: DynamicHTMLOptions): ModuleWithProviders<DynamicHTMLModule> {
        return {
            ngModule: DynamicHTMLModule,
            providers: [
                InputService,
                DynamicHTMLRenderer,
                { provide: DynamicHTMLOptions, useValue: options },
                // { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: options.components, multi: true },
            ],
        };
    }
}
