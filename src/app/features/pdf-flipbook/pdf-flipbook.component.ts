import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-pdf-flipbook',
  standalone: true,
  imports: [CommonModule, NgxExtendedPdfViewerModule],
  templateUrl: './pdf-flipbook.component.html',
  styleUrl: './pdf-flipbook.component.scss'
})
export class PdfFlipbookComponent {

  pdfVisible = false;

  constructor() {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';


  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.pdfVisible = true;
    }, 2000);
  }
}
