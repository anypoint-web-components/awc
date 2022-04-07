import './lib/demo-helper.js';
import '../src/define/anypoint-switch.js';
import '../src/define/star-rating.js';

document.getElementById('theme')!.addEventListener('change', (e) => {
  // @ts-ignore
  if (e.target.checked) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});

document.getElementById('styled')!.addEventListener('change', (e) => {
  // @ts-ignore
  if (e.target.checked) {
    document.body.classList.add('styled');
  } else {
    document.body.classList.remove('styled');
  }
});
