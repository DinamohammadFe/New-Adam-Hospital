// Chatbot Widget Logic (Client-side only)
// Requirements: Bootstrap CSS/JS loaded on the page

(function() {
  const state = {
    lang: 'en',
    open: false,
  };

  const strings = {
    en: {
      title: "Adam International Hospital",
      subtitle: "How can we help you today?",
      toggleLabel: "AR",
      inputPlaceholder: "Type a question...",
      send: "Send",
      actionsTitle: "Quick Actions",
      actions: {
        location: "Location",
        contact: "Contact",
        treatments: "Treatments",
        services: "Services",
        hours: "Opening Hours",
        appointment: "Book Appointment",
      },
      fallback: "I'm sorry, I don't have an answer for that. Please contact our staff directly for more help.",
      contactSuggestion: "You can contact us using the button below.",
      formTitle: "Book Appointment",
      formName: "Full Name",
      formPhone: "Phone",
      formDate: "Preferred Date",
      formSubmit: "Submit",
      submitted: "Thank you! We will contact you soon.",
    },
    ar: {
      title: "مستشفى آدم الدولي",
      subtitle: "كيف يمكننا مساعدتك اليوم؟",
      toggleLabel: "EN",
      inputPlaceholder: "اكتب سؤالاً...",
      send: "إرسال",
      actionsTitle: "خيارات سريعة",
      actions: {
        location: "الموقع",
        contact: "التواصل",
        treatments: "العلاجات",
        services: "الخدمات",
        hours: "مواعيد العمل",
        appointment: "حجز موعد",
      },
      fallback: "عذرًا، لا أملك إجابة على هذا السؤال. يرجى التواصل مع طاقم المستشفى لمزيد من المساعدة.",
      contactSuggestion: "يمكنك التواصل معنا باستخدام الزر أدناه.",
      formTitle: "حجز موعد",
      formName: "الاسم الكامل",
      formPhone: "رقم الهاتف",
      formDate: "التاريخ المفضل",
      formSubmit: "إرسال",
      submitted: "شكرًا لك! سنتواصل معك قريبًا.",
    }
  };

  const responses = {
    en: {
      location: `Find us here: <a href="https://maps.google.com/?q=Adam+International+Hospital" target="_blank" rel="noopener">Google Maps</a>`,
      contact: `Call us: <a href="tel:19662">19662</a><br/>WhatsApp: <a href="https://wa.me/201234567890" target="_blank" rel="noopener">+20 123 456 7890</a><br/>Map: <a href="https://maps.google.com/?q=Adam+International+Hospital" target="_blank" rel="noopener">Google Maps</a>`,
      treatments: `We offer: IVF/ICSI, IUI, Egg Freezing, Sperm Freezing, Embryo Freezing, Genetic Testing, Laparoscopy, Hysteroscopy, Tubal Surgery, PCOS & Endometriosis care.`,
      services: `Our services include: Fertility Consultations, Diagnostics, Advanced Laboratory, Reproductive Immunology, Psychological Support, Family Balancing.`,
      hours: `Opening hours: Saturday–Thursday 9:00–21:00. Friday closed.`,
      appointment: `Please fill the appointment form.`,
    },
    ar: {
      location: `تجدنا هنا: <a href="https://maps.google.com/?q=Adam+International+Hospital" target="_blank" rel="noopener">خرائط جوجل</a>`,
      contact: `اتصل بنا: <a href="tel:19662">19662</a><br/>واتساب: <a href="https://wa.me/201234567890" target="_blank" rel="noopener">+20 123 456 7890</a><br/>الموقع: <a href="https://maps.google.com/?q=Adam+International+Hospital" target="_blank" rel="noopener">خرائط جوجل</a>`,
      treatments: `نقدم: أطفال الأنابيب/الحقن المجهري، التلقيح داخل الرحم، تجميد البويضات، تجميد الحيوانات المنوية، تجميد الأجنة، الفحوصات الجينية، المنظار البطني، المنظار الرحمي، جراحات الأنابيب، العناية بمتلازمة تكيس المبايض والانتباذ البطاني الرحمي.`,
      services: `خدماتنا تشمل: استشارات الخصوبة، التشخيصات، المختبرات المتقدمة، علم المناعة التناسلي، الدعم النفسي، موازنة الأسرة.`,
      hours: `مواعيد العمل: السبت–الخميس 9:00–21:00. الجمعة إجازة.`,
      appointment: `يرجى تعبئة نموذج الحجز.`,
    }
  };

  // Utility
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }
  function escapeHTML(s) { const div = document.createElement('div'); div.textContent = s; return div.innerHTML; }

  function setLang(lang) {
    state.lang = lang;
    const t = strings[lang];
    qs('#chatbot-window').setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    qs('#chatbot-title').textContent = t.title;
    qs('#chatbot-subtitle').textContent = t.subtitle;
    qs('#chatbot-lang-toggle').textContent = t.toggleLabel;
    qs('#chatbot-input').setAttribute('placeholder', t.inputPlaceholder);
    qs('#chatbot-send').textContent = t.send;
    qs('#chatbot-actions-title').textContent = t.actionsTitle;
    // Update buttons
    qs('#btn-location').textContent = t.actions.location;
    qs('#btn-contact').textContent = t.actions.contact;
    qs('#btn-treatments').textContent = t.actions.treatments;
    qs('#btn-services').textContent = t.actions.services;
    qs('#btn-hours').textContent = t.actions.hours;
    qs('#btn-appointment').textContent = t.actions.appointment;
    // Modal labels
    qs('#appointmentModalLabel').textContent = t.formTitle;
    qs('#labelName').textContent = t.formName;
    qs('#labelPhone').textContent = t.formPhone;
    qs('#labelDate').textContent = t.formDate;
    qs('#appointmentSubmit').textContent = t.formSubmit;
  }

  function addMessage(from, html) {
    const wrap = document.createElement('div');
    wrap.className = `msg ${from}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = html;
    wrap.appendChild(bubble);
    qs('#chatbot-messages').appendChild(wrap);
    qs('#chatbot-messages').scrollTop = qs('#chatbot-messages').scrollHeight;
  }

  function respond(key) {
    const t = responses[state.lang][key];
    addMessage('bot', t);
    if (key === 'appointment') {
      // Open Bootstrap modal
      const modalEl = qs('#appointmentModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  function recognize(text) {
    text = text.toLowerCase();
    // Simple keyword recognition
    const map = {
      location: ['location','map','address','place','where'],
      contact: ['contact','phone','call','whatsapp'],
      treatments: ['treatments','ivf','iui','freezing','genetic','laparoscopy','hysteroscopy','tubal'],
      services: ['services','support','lab','immunology','psychological'],
      hours: ['hours','open','opening','time','when'],
      appointment: ['book','appointment','reserve','schedule'],
    };
    for (const key of Object.keys(map)) {
      if (map[key].some(k => text.includes(k))) return key;
    }
    return null;
  }

  function init() {
    // Ensure markup exists even if not placed before </body>
    ensureMarkup();
    // FAB toggle
    qs('#chatbot-fab').addEventListener('click', () => {
      state.open = !state.open;
      qs('#chatbot-window').classList.toggle('open', state.open);
    });

    // Language toggle
    qs('#chatbot-lang-toggle').addEventListener('click', () => {
      setLang(state.lang === 'en' ? 'ar' : 'en');
      addMessage('bot', state.lang === 'en' ? 'Language set to English.' : 'تم ضبط اللغة إلى العربية.');
    });

    // Quick actions
    qs('#btn-location').addEventListener('click', () => respond('location'));
    qs('#btn-contact').addEventListener('click', () => respond('contact'));
    qs('#btn-treatments').addEventListener('click', () => respond('treatments'));
    qs('#btn-services').addEventListener('click', () => respond('services'));
    qs('#btn-hours').addEventListener('click', () => respond('hours'));
    qs('#btn-appointment').addEventListener('click', () => respond('appointment'));

    // Send input
    function handleSend() {
      const v = qs('#chatbot-input').value.trim();
      if (!v) return;
      addMessage('user', escapeHTML(v));
      qs('#chatbot-input').value = '';
      const key = recognize(v);
      if (key) {
        respond(key);
      } else {
        const t = strings[state.lang];
        addMessage('bot', t.fallback);
        addMessage('bot', `<em>${t.contactSuggestion}</em>`);
        // show contact suggestion button prominently
        qs('#btn-contact').focus();
      }
    }

    qs('#chatbot-send').addEventListener('click', handleSend);
    qs('#chatbot-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });

    // Modal submit
    qs('#appointmentForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const t = strings[state.lang];
      addMessage('bot', t.submitted);
      // Close modal
      bootstrap.Modal.getInstance(qs('#appointmentModal'))?.hide();
    });

    // Initial language
    setLang(state.lang);
    // Warm greeting
    addMessage('bot', strings[state.lang].subtitle);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Inject widget markup if it's missing or was placed incorrectly
function ensureMarkup() {
  if (!document.querySelector('#chatbot-fab')) {
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = 'chatbot.css';
    document.head.appendChild(linkEl);

    const html = `
    <button id="chatbot-fab" class="chatbot-fab" aria-label="Open chat">
      <span class="fab-icon" aria-hidden="true">
        <img src="adam-logo.png" alt="" />
      </span>
      <span class="fab-text">
        <span class="fab-title">Let's Chat!</span>
        <span class="fab-subtitle">Adam International Hospital</span>
      </span>
    </button>

    <div id="chatbot-window" class="chatbot-window card">
      <div class="card-header chatbot-header">
        <h6 id="chatbot-title" class="chatbot-title">Adam International Hospital</h6>
        <button id="chatbot-lang-toggle" class="btn btn-sm btn-outline-secondary chatbot-lang-toggle" type="button" aria-label="Toggle language">AR</button>
      </div>
      <div id="chatbot-subtitle" class="px-3 pt-2 small text-muted">How can we help you today?</div>
      <div id="chatbot-messages" class="chatbot-messages" aria-live="polite" aria-label="Messages"></div>
      <div class="chatbot-actions">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <strong id="chatbot-actions-title">Quick Actions</strong>
        </div>
        <div class="d-flex flex-wrap">
          <button id="btn-location" class="btn btn-outline-primary btn-sm" type="button">Location</button>
          <button id="btn-contact" class="btn btn-outline-primary btn-sm" type="button">Contact</button>
          <button id="btn-treatments" class="btn btn-outline-primary btn-sm" type="button">Treatments</button>
          <button id="btn-services" class="btn btn-outline-primary btn-sm" type="button">Services</button>
          <button id="btn-hours" class="btn btn-outline-primary btn-sm" type="button">Opening Hours</button>
          <button id="btn-appointment" class="btn btn-success btn-sm" type="button">Book Appointment</button>
        </div>
      </div>
      <div class="chatbot-input p-2">
        <div class="input-group">
          <input id="chatbot-input" type="text" class="form-control" placeholder="Type a question..." aria-label="Type a question" />
          <button id="chatbot-send" class="btn btn-primary" type="button">Send</button>
        </div>
      </div>
    </div>

    <div class="modal fade" id="appointmentModal" tabindex="-1" aria-labelledby="appointmentModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="appointmentModalLabel">Book Appointment</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form id="appointmentForm">
            <div class="modal-body">
              <div class="mb-3">
                <label id="labelName" for="apptName" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="apptName" required />
              </div>
              <div class="mb-3">
                <label id="labelPhone" for="apptPhone" class="form-label">Phone</label>
                <input type="tel" class="form-control" id="apptPhone" required />
              </div>
              <div class="mb-3">
                <label id="labelDate" for="apptDate" class="form-label">Preferred Date</label>
                <input type="date" class="form-control" id="apptDate" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button id="appointmentSubmit" type="submit" class="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', html);
  }
}