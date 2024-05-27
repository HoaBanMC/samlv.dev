import { Routes } from '@angular/router';
import { ConvertXlsx2JsonComponent } from './convert-xlsx-2-json/convert-xlsx-2-json.component';
import { PdfFlipbookComponent } from './pdf-flipbook/pdf-flipbook.component';

export const routes: Routes = [
    {
        path: 'convert-xlsx-2-json',
        component: ConvertXlsx2JsonComponent
    },
    {
        path: 'pdf-flipbook',
        component: PdfFlipbookComponent
    }
];
