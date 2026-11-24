const boot = document.querySelector('#boot');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Keep section navigation smooth without leaving a hash that would restore to that section on refresh.
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || link.getAttribute('href') === '#') return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', location.pathname + location.search);
});
const closeBoot = () => { boot.classList.add('boot-out'); setTimeout(() => boot.remove(), 650); sessionStorage.setItem('ninjaBootSeen', '1'); };
document.querySelector('#skipBoot').addEventListener('click', closeBoot);
if (sessionStorage.getItem('ninjaBootSeen')) boot.remove(); else setTimeout(closeBoot, 2300);

document.querySelector('#year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const filters = document.querySelectorAll('.filter');
const productArea = document.querySelector('#productArea');
const searchInput = document.querySelector('#searchInput');
let activeFilter = 'all';
const whatsappBase = 'https://wa.me/201067647009?text=';
const whatsappLink = name => `${whatsappBase}${encodeURIComponent(`مرحبًا Ninja Store، أريد الاستفسار عن ${name}.`)}`;
const esc = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const products = (window.NINJA_PRODUCTS || []).filter(product => {
    const matchesFilter = activeFilter === 'all' || product.category === activeFilter;
    return matchesFilter && `${product.name || ''} ${product.categoryLabel || ''} ${product.condition || ''}`.toLowerCase().includes(query);
  });
  if (!products.length) {
    const hasProducts = window.NINJA_PRODUCTS && window.NINJA_PRODUCTS.length;
    productArea.className = 'empty-state reveal in-view';
    productArea.innerHTML = hasProducts ? '<div class="empty-mark"><span></span><span></span><span></span></div><p class="eyebrow">NO MATCHES</p><h3>مفيش نتائج مطابقة.</h3><p>جرّب كلمة بحث أخرى أو اختر تصنيفًا مختلفًا.</p>' : '<div class="empty-mark"><span></span><span></span><span></span></div><p class="eyebrow">PRODUCTS ARMORY / 01</p><h3>الأسلحة التقنية<br />في الطريق.</h3><p>لا نعرض منتجات أو أسعارًا غير مؤكدة. أضفها من ملف البيانات لتظهر هنا فورًا.</p><a href="https://wa.me/201067647009" target="_blank" rel="noreferrer" class="text-link">اسأل عن المتاح الآن <b>←</b></a>';
    return;
  }
  productArea.className = 'product-grid reveal in-view';
  productArea.innerHTML = products.map(product => `<article class="product-card" data-open-product="${esc(product.id)}" tabindex="0"><div class="product-image">${product.image ? `<img src="${esc(product.image)}" loading="lazy" alt="${esc(product.name)}" />` : '<div class="product-placeholder">NINJA<br />GEAR</div>'}<span class="scan-line"></span></div><div class="product-meta"><span>${esc(product.categoryLabel)}</span>${product.condition ? `<span>${esc(product.condition)}</span>` : ''}</div><h3>${esc(product.name)}</h3>${product.price ? `<p class="price">${esc(product.price)}</p>` : '<p class="price muted-price">اسأل عن السعر</p>'}<div class="card-actions"><button class="details-button">التفاصيل</button><a href="${whatsappLink(product.name)}" target="_blank" rel="noreferrer" aria-label="اطلب ${esc(product.name)} عبر واتساب">↗</a></div></article>`).join('');
}
filters.forEach(button => button.addEventListener('click', () => { filters.forEach(b => b.classList.remove('active')); button.classList.add('active'); activeFilter = button.dataset.filter; renderProducts(); productArea.classList.remove('slash-flash'); void productArea.offsetWidth; productArea.classList.add('slash-flash'); }));
searchInput.addEventListener('input', renderProducts);
function openDetails(id) {
  const product = (window.NINJA_PRODUCTS || []).find(item => String(item.id) === String(id)); if (!product) return;
  const dialog = document.createElement('dialog'); dialog.className = 'product-dialog';
  dialog.innerHTML = `<button class="dialog-close" aria-label="إغلاق">×</button><div class="dialog-image">${product.image ? `<img src="${esc(product.image)}" alt="${esc(product.name)}" />` : '<div class="product-placeholder">NINJA<br />GEAR</div>'}</div><div class="dialog-copy"><p class="eyebrow"><i></i>${esc(product.categoryLabel)}</p><h2>${esc(product.name)}</h2>${product.condition ? `<p class="condition">الحالة: ${esc(product.condition)}</p>` : ''}${product.description ? `<p>${esc(product.description)}</p>` : '<p>تواصل معنا لمعرفة كل التفاصيل والتوفر.</p>'}${product.price ? `<strong class="dialog-price">${esc(product.price)}</strong>` : ''}<a class="button button-dark" target="_blank" rel="noreferrer" href="${whatsappLink(product.name)}">اطلب عبر واتساب <span>←</span></a></div>`;
  document.body.append(dialog); dialog.showModal(); dialog.querySelector('.dialog-close').onclick = () => dialog.close(); dialog.addEventListener('close', () => dialog.remove());
}
productArea.addEventListener('click', event => { if (event.target.closest('a')) return; const trigger = event.target.closest('[data-open-product]'); if (trigger) openDetails(trigger.dataset.openProduct); });
productArea.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { const trigger = event.target.closest('[data-open-product]'); if (trigger) { event.preventDefault(); openDetails(trigger.dataset.openProduct); } } });
renderProducts();
