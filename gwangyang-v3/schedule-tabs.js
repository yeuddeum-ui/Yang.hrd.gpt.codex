const cards = [...document.querySelectorAll('.day-grid > .day-card')];
const grid = document.querySelector('.day-grid');
if (grid && cards.length) {
  let motion;
  import('https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm').then(m => motion = m).catch(() => {});
  const style = document.createElement('style');
  style.textContent = `
    .schedule-tabs{display:flex;gap:12px;margin:0 0 24px}
    .schedule-tabs button{font:700 18px inherit;font-family:inherit;font-size:18px;padding:20px 30px;border:1px solid #b5c8d8;background:#fff;color:#102237;cursor:pointer;border-radius:12px}
    .schedule-tabs button[aria-selected="true"]{background:#071a2f;color:#fff;border-color:#071a2f}
    .day-grid{display:block}.day-card[hidden]{display:none!important}
    .schedule-table{width:100%;border-collapse:collapse;margin-top:28px;text-align:left}
    .schedule-table th{background:#edf4fa;color:#37617e;padding:18px;font-size:16px}
    .schedule-table td{padding:23px 18px;border-bottom:1px solid #dce5ec;font-size:18px;line-height:1.6}
    .schedule-table td:first-child{white-space:nowrap;color:#326486;font-size:16px;font-weight:700}
    .schedule-table tr:hover td{background:#f0f7ff}
    .table-scroll{overflow-x:auto}
    @media(max-width:720px){.schedule-tabs button{padding:16px 20px}.day-card{padding:24px 12px}.schedule-table th,.schedule-table td{padding:18px 10px}.schedule-table{min-width:560px}}
  `;
  document.head.append(style);
  const tabs = document.createElement('div');
  tabs.className = 'schedule-tabs';
  tabs.setAttribute('role','tablist');
  tabs.setAttribute('aria-label','교육 일차 선택');
  cards.forEach((card,i) => {
    card.id = 'schedule-panel-' + i;
    card.setAttribute('role','tabpanel');
    card.setAttribute('aria-labelledby','schedule-tab-' + i);
    card.querySelectorAll('ol').forEach(list => {
      const table = document.createElement('table');
      table.className = 'schedule-table';
      table.innerHTML = '<thead><tr><th scope="col">시간</th><th scope="col">교육 내용</th><th scope="col">장소 / 담당</th></tr></thead>';
      const body = document.createElement('tbody');
      list.querySelectorAll('li').forEach(li => {
        const tr = document.createElement('tr');
        ['time','b','small'].forEach(sel => {
          const td = document.createElement('td');
          td.textContent = li.querySelector(sel)?.textContent || '';
          tr.append(td);
        });
        body.append(tr);
      });
      table.append(body);
      const wrap = document.createElement('div');
      wrap.className = 'table-scroll';
      wrap.append(table);
      list.replaceWith(wrap);
    });
    const button = document.createElement('button');
    button.type = 'button'; button.id = 'schedule-tab-' + i;
    button.setAttribute('role','tab');
    button.setAttribute('aria-controls',card.id);
    button.textContent = 'DAY ' + (i+1);
    button.addEventListener('click', () => select(i));
    button.addEventListener('keydown', e => {
      if (['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
        e.preventDefault();
        const next = e.key === 'Home' ? 0 : e.key === 'End' ? cards.length-1 : (i+(e.key === 'ArrowRight'?1:-1)+cards.length)%cards.length;
        select(next); tabs.children[next].focus();
      }
    });
    tabs.append(button);
  });
  grid.before(tabs);
  function select(index) {
    cards.forEach((card,i) => {
      card.hidden = i !== index;
      tabs.children[i].setAttribute('aria-selected',String(i===index));
      tabs.children[i].tabIndex = i === index ? 0 : -1;
    });
    if (motion && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      motion.animate(cards[index].querySelectorAll('tbody tr'), {opacity:[0,1],transform:['translateY(20px)','translateY(0px)']}, {duration:0.5,delay:motion.stagger(0.065),ease:[0.22,1,0.36,1]});
    }
  }
  select(0);
}
