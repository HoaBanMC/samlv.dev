import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import JSZip from 'jszip';
import * as CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';

import { zip, ZipOptions } from 'fflate';
import { BlobWriter, ZipWriter } from '@zip-js/zip-js';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
})
export class GamesComponent {
  async createPasswordZip() {
    const writer = new BlobWriter();
    const zipWriter = new ZipWriter(writer, { password: '123123' });

    const json = {
      name: 'Angular',
      version: 19,
    };

    await zipWriter.add(
      'hello.json',
      new Blob([JSON.stringify(json)]).stream()
    );

    // Close the writer to generate the ZIP
    const zipBlob = await zipWriter.close();

    // Trigger the download
    const url = URL.createObjectURL(zipBlob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'secure.zip';
    anchor.click();

    // Clean up
    URL.revokeObjectURL(url);
  }

  createPasswordProtectedZip() {
    const files = {
      'hello.txt': new TextEncoder().encode('Hello, world!'),
      'example.json': new TextEncoder().encode(
        JSON.stringify({ name: 'Angular', version: 18 })
      ),
    };

    const options: ZipOptions = { level: 9 };

    zip(files, options, (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      // Convert the data to a Blob for download
      const blob = new Blob([data], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'example-encrypted.zip';
      link.click();
    });
  }

  createZip() {
    const zip = new JSZip();

    // Add files to the archive
    zip.file('hello.txt', 'Hello, world!');
    zip.file('example.json', JSON.stringify({ name: 'Angular', version: 18 }));

    // Generate and save the ZIP file
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'example.zip');
    });
  }

  async createZipWithPassword() {
    const password = 'SecurePassword123!';
    const zip = new JSZip();

    // Add files to the ZIP
    zip.file('example.txt', 'This is the content of the text file.');
    zip.file('notes.txt', 'Some additional notes.');

    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Encrypt the ZIP file using CryptoJS
    const reader = new FileReader();
    reader.onload = () => {
      const encrypted = CryptoJS.AES.encrypt(
        reader.result as string,
        password
      ).toString();

      // Convert encrypted content back to Blob
      const encryptedBlob = new Blob([encrypted], { type: 'application/zip' });

      // Create a download link
      const url = window.URL.createObjectURL(encryptedBlob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'encrypted.zip';
      anchor.click();

      // Clean up the URL
      window.URL.revokeObjectURL(url);
    };

    reader.readAsDataURL(zipBlob);
  }
}
