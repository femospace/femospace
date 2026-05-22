import { JSDOM } from 'jsdom';

async function test() {
  const dom = await JSDOM.fromURL('http://localhost:5173', {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  });
  dom.window.console.log = (...args) => console.log('LOG:', ...args);
  dom.window.console.warn = (...args) => console.warn('WARN:', ...args);
  dom.window.console.error = (...args) => console.error('ERROR:', ...args);
  dom.window.onerror = (message, source, lineno, colno, error) => {
    console.error('WINDOW ERROR:', message, error);
  };
  dom.window.addEventListener('unhandledrejection', (event) => {
    console.error('UNHANDLED REJECTION:', event?.reason);
  });
  
  await new Promise(r => setTimeout(r, 5000));
}
test().catch(console.error);
