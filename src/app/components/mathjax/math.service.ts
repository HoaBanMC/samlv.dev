import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, Observable } from 'rxjs';

interface MathJaxConfig {
  source: string;
  id: string;
}

declare global {
  interface Window {
    MathJax: any
  }
}

@Injectable({ providedIn: 'root' })
export class MathService {
  signal: Subject<boolean> = new Subject<boolean>();
  private mathJax: MathJaxConfig = {
    source:
      'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-svg-full.min.js',
    id: 'MathJaxScript',

  };
  private mathJaxFallback: MathJaxConfig = {
    source: 'assets/js/mathjax/mathjax.js',
    id: 'MathJaxBackupScript',
  };
  listElement = [];

  queuePromise;
  i = 0;
  constructor() {
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\[', '\\]'], ['\\(', '\\)'], ['$$', '$$'],
        ['\\[', '\\]']],
        displayMath: [
        ],
        processEscapes: true,      // use \$ to produce a literal dollar sign
        processEnvironments: true, // process \begin{xxx}...\end{xxx} outside math mode
        processRefs: true,         // process \ref{...} outside of math mode
        digits: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)?|\.[0-9]+)/,
        // pattern for recognizing numbers
        tags: 'none',              // or 'ams' or 'all'
        tagSide: 'right',          // side for \tag macros
        tagIndent: '0.8em',        // amount to indent tags
        useLabelIds: true,         // use label name rather than tag for ids
        multlineWidth: '85%',      // width of multline environment
        baseURL:                   // URL for use with links to tags (when there is a <base> tag in effect)
          (document.getElementsByTagName('base').length === 0) ?
            '' : String(document.location).replace(/#.*$/, ''),
        formatError:               // function called when TeX syntax errors occur
          (jax, err) => jax.formatError(err)
      }
    }
    this.signal = new ReplaySubject<boolean>();
    void this.registerMathJaxAsync(this.mathJax)
      .then(() => this.signal.next(true))
      .catch(error => {
        console.log('vao loi', error);
        void this.registerMathJaxAsync(this.mathJaxFallback)
          .then(() => this.signal.next(false))
          .catch(error1 => console.log(error1));
      });
  }

  private async registerMathJaxAsync(config: MathJaxConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      const script: HTMLScriptElement = document.createElement('script');
      script.id = config.id;
      script.type = 'text/javascript';
      script.src = config.source;
      script.crossOrigin = 'anonymous';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = error => reject(error);
      document.head.appendChild(script);
    });
  }

  ready(): Observable<boolean> {
    return this.signal;
  }

  render(element: HTMLElement, math: string, noWait?) {
    // Take initial typesetting which MathJax performs into account
    element.style.position = 'relative';
    this.i += 1;
    const timeWait = noWait ? 0 : Math.floor(this.i / 5000) * 1000;
    return window.MathJax.startup.promise.then(this.sleeper(timeWait)).then(() => {
      element.innerHTML = math;
      return window.MathJax.typeset([element]);
    })
  }
   sleeper(ms) {
    return (x) => {
      return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
  }
}
