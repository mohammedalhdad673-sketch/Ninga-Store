(() => {
  'use strict';

  const STORE = Object.freeze({ whatsappNumber: '201067647009', phoneNumber: '+201067647009' });
  const services = (window.NINJA_REPAIR_SERVICES || []).filter(({ visible }) => visible);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]);
  // wa.me accepts international digits only: no leading +, 00, or spaces.
  const whatsappUrl = (message) => `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;

  const repairSection = document.createElement('section');
  repairSection.id = 'repair';
  repairSection.className = 'repair section-line';
  repairSection.innerHTML = `
    <div class="repair-hero section-shell">
      <div class="repair-copy reveal"><p class="eyebrow"><i></i> NINJA REPAIR LAB / SERVICE INQUIRY</p><h2>NINJA REPAIR LAB<br /><em>جهازك يستحق فرصة تانية.</em></h2><p>من مشاكل الشحن والشاشات إلى أعطال السوفت وير والهاردوير، تواصل مع Ninja Store للاستفسار عن خدمة الصيانة المتاحة لجهازك.</p><a class="button button-repair" href="#device-check">ابدأ طلب صيانة <span>←</span></a></div>
      <div class="lab-device reveal" aria-label="تصوير توضيحي لفحص الهاتف"><div class="lab-watermark"><img src="ninja-logo.png" alt="" /></div><span class="lab-label label-a">CIRCUIT_01</span><span class="lab-label label-b">SCAN_READY</span><span class="lab-label label-c">PRECISION</span><div class="circuit circuit-a"></div><div class="circuit circuit-b"></div><div class="circuit circuit-c"></div><div class="phone-lab"><div class="lab-cam"></div><div class="lab-chip chip-one">CORE</div><div class="lab-chip chip-two">MEM</div><div class="lab-battery">POWER<br /><b>88%</b></div><div class="lab-board"></div><div class="lab-scan"></div></div><div class="ninja-shadow" aria-hidden="true"><span></span><i></i><b></b></div></div>
    </div>
    <div class="repair-services section-shell"><div class="section-heading reveal"><div><p class="eyebrow"><i></i> REPAIR SERVICES</p><h2>إيه اللي محتاج <em>يتصلح؟</em></h2></div><p>تصنيفات للاستفسار فقط. تواصل معنا لتأكيد توفر الخدمة المناسبة لجهازك.</p></div><div id="servicesGrid" class="services-grid reveal"></div></div>
    <div id="device-check" class="diagnostic section-shell"><div class="diagnostic-copy reveal"><p class="eyebrow"><i></i> NINJA DEVICE CHECK</p><h2>خلّي طلبك<br /><em>واضح من البداية.</em></h2><p>املأ التفاصيل المتاحة، وسيتم تجهيز رسالة منظمة لفريقنا على واتساب. هذه ليست نتيجة فحص آلية؛ هي طريقة أسرع لشرح المشكلة.</p><div class="diagnostic-visual"><span>01</span><i></i><span>SCAN</span><i></i><span>READY</span></div></div><form id="diagnosticForm" class="diagnostic-form reveal" novalidate><div class="form-head"><span>REQUEST / 01</span><b>تفاصيل الجهاز</b></div><label>نوع الجهاز<select name="brand" required><option value="" selected disabled>اختر النوع</option><option>iPhone</option><option>Samsung</option><option>Xiaomi</option><option>Oppo</option><option>Realme</option><option>Other</option></select></label><label>موديل الجهاز<input name="model" required maxlength="80" autocomplete="off" placeholder="مثال: iPhone 13" /></label><label>نوع العطل<select name="issue" required><option value="" selected disabled>اختر المشكلة</option><option>الشاشة</option><option>البطارية</option><option>الشحن</option><option>السوفت وير</option><option>الصوت</option><option>الكاميرا</option><option>عطل آخر</option></select></label><label>وصف المشكلة<textarea name="description" required rows="3" maxlength="800" placeholder="اكتب الأعراض أو أي تفاصيل مهمة"></textarea></label><label>رقم الهاتف للتواصل<input name="phone" required inputmode="tel" type="tel" autocomplete="tel" pattern="^(?:\\+20|20|0)?1[0-9]{9}$" placeholder="010 6764 7009" /></label><p class="form-note">سيتم فتح واتساب لإرسال البيانات إلى Ninja Store.</p><button class="button button-dark form-submit" type="submit">SEND TO NINJA LAB <span>←</span></button><p id="formError" class="form-error" aria-live="polite"></p></form></div>
    <div class="repair-journey section-shell"><div class="section-heading reveal"><div><p class="eyebrow"><i></i> REPAIR EXPERIENCE</p><h2>رحلة جهازك داخل <em>المختبر</em></h2></div><p>خطوات توضيحية لطريقة العمل المقترحة بعد التواصل مع الفريق.</p></div><ol class="journey-list"><li class="reveal"><span>01</span><div><b>DEVICE RECEIVED</b><h3>استلام الجهاز وتسجيل بياناته.</h3></div></li><li class="reveal"><span>02</span><div><b>DIAGNOSIS</b><h3>تحديد المشكلة بعد الفحص.</h3></div></li><li class="reveal"><span>03</span><div><b>REPAIR</b><h3>تنفيذ الإصلاح بعد موافقة العميل.</h3></div></li><li class="reveal"><span>04</span><div><b>READY</b><h3>إبلاغ العميل بجاهزية الجهاز للاستلام.</h3></div></li></ol></div>
    <div class="repair-cta section-shell reveal"><p class="eyebrow"><i></i> NEED A HAND?</p><h2>عندك مشكلة في جهازك؟</h2><p>ابعتلنا تفاصيل العطل، وفريق Ninja Store هيساعدك تعرف الخطوة المناسبة.</p><div><a class="button button-dark" href="${whatsappUrl('مرحبًا Ninja Store، أريد الاستفسار عن خدمة الصيانة.')}" target="_blank" rel="noopener noreferrer">استفسر عبر واتساب <span>←</span></a><a class="button button-light" href="tel:${STORE.phoneNumber}">اتصل بنا</a></div></div>`;

  const aboutSection = document.querySelector('#about');
  if (aboutSection) aboutSection.before(repairSection); else document.querySelector('main')?.append(repairSection);

  document.querySelector('.site-header nav')?.insertAdjacentHTML('afterbegin', '<a href="#repair">الصيانة</a>');
  document.querySelector('.hero-actions')?.insertAdjacentHTML('beforeend', '<a class="hero-repair-link" href="#repair">NINJA REPAIR LAB <span>↙</span></a>');
  document.querySelector('.footer-links')?.insertAdjacentHTML('afterbegin', '<a href="#repair">الصيانة</a>');

  const servicesGrid = repairSection.querySelector('#servicesGrid');
  servicesGrid.innerHTML = services.map((service) => `<article class="service-card"><span class="service-icon">${escapeHtml(service.icon)}</span><p>LAB / ${escapeHtml(service.id).toUpperCase()}</p><h3>${escapeHtml(service.title)}</h3><div><span>${escapeHtml(service.description)}</span><button type="button" data-service="${escapeHtml(service.id)}">استفسر <b>←</b></button></div></article>`).join('');

  function openServiceDialog(service) {
    const dialog = document.createElement('dialog');
    dialog.className = 'service-dialog';
    dialog.innerHTML = `<button class="dialog-close" type="button" aria-label="إغلاق">×</button><span class="service-icon">${escapeHtml(service.icon)}</span><p class="eyebrow"><i></i> NINJA REPAIR LAB</p><h2>${escapeHtml(service.title)}</h2><p>${escapeHtml(service.description)}</p><a class="button button-dark" target="_blank" rel="noopener noreferrer" href="${whatsappUrl(`مرحبًا Ninja Store، أريد الاستفسار عن خدمة: ${service.title}.`)}">استفسر عبر واتساب <span>←</span></a>`;
    document.body.append(dialog); dialog.showModal();
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => dialog.remove(), { once: true });
  }

  servicesGrid.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-service]');
    if (!trigger) return;
    const service = services.find(({ id }) => id === trigger.dataset.service);
    if (service) openServiceDialog(service);
  });

  const form = repairSection.querySelector('#diagnosticForm');
  const formError = repairSection.querySelector('#formError');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { formError.textContent = 'من فضلك أكمل البيانات بشكل صحيح، وتأكد من رقم الهاتف.'; form.reportValidity(); return; }
    const fields = Object.fromEntries(new FormData(form).entries());
    const message = `مرحبًا Ninja Store، أريد الاستفسار عن صيانة جهاز.\n\nنوع الجهاز: ${fields.brand}\nالموديل: ${fields.model}\nنوع العطل: ${fields.issue}\nوصف المشكلة: ${fields.description}\nرقم التواصل: ${fields.phone}`;
    formError.textContent = '';
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  });

  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in-view'); }), { threshold: 0.12 });
  repairSection.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
})();
