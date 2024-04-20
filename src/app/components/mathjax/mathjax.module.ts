import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathJaxDirective } from './mathjax.directive';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
    declarations: [
        MathJaxDirective,
        LoadingComponent,
    ],
    imports: [
        CommonModule],
    providers: [],
    exports: [
        MathJaxDirective,
    ]
})
export class MathjaxModule { }
