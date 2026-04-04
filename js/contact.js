document.addEventListener('DOMContentLoaded', () => {
  const getStorage = () => {
    try {
      const testKey = '__booking_name_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return localStorage;
    } catch (error) {
      return null;
    }
  };

  const storage = getStorage();

  const saveBookingName = (value) => {
    if (!storage) {
      return;
    }

    const name = (value || '').trim();

    if (name) {
      storage.setItem('bookingName', name);
    } else {
      storage.removeItem('bookingName');
    }
  };

  const nameInput = document.querySelector('input#name[name="name"]');

  if (nameInput) {
    const saveFromField = () => saveBookingName(nameInput.value);

    nameInput.addEventListener('input', saveFromField);
    nameInput.addEventListener('change', saveFromField);

    document.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', saveFromField);
    });

    window.addEventListener('beforeunload', saveFromField);
    saveFromField();
  }

  const contactMethodInputs = document.querySelectorAll('input[name="contactMethod"]');

  if (contactMethodInputs.length > 0 && storage) {
    const contactFieldMap = {
      call: document.querySelector('#call-number'),
      whatsapp: document.querySelector('#whatsapp-number'),
      sms: document.querySelector('#sms-number'),
      email: document.querySelector('#email-address'),
    };

    const saveContactDetails = () => {
      const selectedMethod =
        document.querySelector('input[name="contactMethod"]:checked')?.value || '';
      const selectedField = selectedMethod ? contactFieldMap[selectedMethod] : null;
      const selectedValue = (selectedField?.value || '').trim();

      storage.setItem(
        'bookingContact',
        JSON.stringify({
          method: selectedMethod,
          value: selectedValue,
        })
      );
    };

    contactMethodInputs.forEach((input) => {
      input.addEventListener('change', saveContactDetails);
    });

    Object.values(contactFieldMap)
      .filter(Boolean)
      .forEach((input) => {
        input.addEventListener('input', saveContactDetails);
        input.addEventListener('change', saveContactDetails);
      });

    window.addEventListener('beforeunload', saveContactDetails);
    saveContactDetails();
  }

  const bookingNameTargets = document.querySelectorAll('[data-booking-name]');

  if (bookingNameTargets.length > 0 && storage) {
    const savedName = (storage.getItem('bookingName') || '').trim();

    bookingNameTargets.forEach((element) => {
      element.textContent = savedName || 'there';
    });
  }

  const weddingFields = {
    form: document.querySelector('form[data-wedding-form]'),
    eventLocation: document.querySelector('#event-location'),
    notDecidedLocation: document.querySelector('#notDecidedLocation'),
    notes: document.querySelector('#anything-else'),
    groomCount: document.querySelector('#groom-count'),
    groomMakeup: document.querySelector('#groom-makeup'),
    groomHairstyle: document.querySelector('#groom-hairstyle'),
    bridesmaidCount: document.querySelector('#bridesmaid-count'),
    bridesmaidMakeup: document.querySelector('#bridesmaid-makeup'),
    bridesmaidHairstyle: document.querySelector('#bridesmaid-hairstyle'),
    flowerGirlCount: document.querySelector('#flower-girl-count'),
    flowerGirlMakeup: document.querySelector('#flower-girl-makeup'),
    flowerGirlHairstyle: document.querySelector('#flower-girl-hairstyle'),
  };

  const premiumServiceIds = [
    'deep-skin-cleansing',
    'eyelash-extension',
    'hydromassage',
    'waxing',
    'relaxing-massage',
    'bleach-body-hair',
    'hair-moisture',
    'foot-and-hand-spa',
    'gommage',
  ];

  const premiumServiceInputs = premiumServiceIds
    .map((id) => document.querySelector(`#${id}`))
    .filter(Boolean);

  const weddingInputs = [...Object.values(weddingFields), ...premiumServiceInputs].filter(Boolean);

  if (weddingInputs.length > 0 && storage) {
    const getCount = (input) => {
      const parsed = Number.parseInt(input?.value || '0', 10);
      return Number.isNaN(parsed) ? 0 : Math.max(parsed, 0);
    };

    const saveWeddingAttendees = () => {
      const premiumServices = Array.from(
        document.querySelectorAll('input[type="checkbox"][id]:checked')
      )
        .filter((checkbox) => premiumServiceIds.includes(checkbox.id))
        .map((checkbox) => {
          const label = document.querySelector(`label[for="${checkbox.id}"]`);
          return (label?.textContent || '').trim();
        })
        .filter(Boolean);

      const payload = {
        eventLocation: (weddingFields.eventLocation?.value || '').trim(),
        locationUndecided: Boolean(weddingFields.notDecidedLocation?.checked),
        notes: (weddingFields.notes?.value || '').trim(),
        premiumServices,
        groom: {
          count: getCount(weddingFields.groomCount),
          makeup: Boolean(weddingFields.groomMakeup?.checked),
          hairstyle: Boolean(weddingFields.groomHairstyle?.checked),
        },
        bridesmaid: {
          count: getCount(weddingFields.bridesmaidCount),
          makeup: Boolean(weddingFields.bridesmaidMakeup?.checked),
          hairstyle: Boolean(weddingFields.bridesmaidHairstyle?.checked),
        },
        flowerGirl: {
          count: getCount(weddingFields.flowerGirlCount),
          makeup: Boolean(weddingFields.flowerGirlMakeup?.checked),
          hairstyle: Boolean(weddingFields.flowerGirlHairstyle?.checked),
        },
      };

      storage.setItem('weddingAttendees', JSON.stringify(payload));
    };

    weddingInputs.forEach((input) => {
      input.addEventListener('input', saveWeddingAttendees);
      input.addEventListener('change', saveWeddingAttendees);
    });

    if (weddingFields.form) {
      weddingFields.form.addEventListener('submit', saveWeddingAttendees);
    }

    window.addEventListener('beforeunload', saveWeddingAttendees);
    saveWeddingAttendees();
  }

  const attendeesList = document.querySelector('[data-additional-attendees-list]');
  const premiumList = document.querySelector('[data-premium-services-list]');
  const locationLine = document.querySelector('[data-booking-location-line]');
  const contactLine = document.querySelector('[data-booking-contact-line]');

  if ((attendeesList || premiumList || locationLine) && storage) {
    const toServicesLabel = (makeup, hairstyle) => {
      const services = [];

      if (makeup) {
        services.push('makeup');
      }
      if (hairstyle) {
        services.push('hairstyle');
      }

      return services.join('+');
    };

    let saved = null;
    try {
      saved = JSON.parse(storage.getItem('weddingAttendees') || 'null');
    } catch (error) {
      saved = null;
    }

    const lines = [];

    const groomServices = toServicesLabel(saved?.groom?.makeup, saved?.groom?.hairstyle);
    const groomCount = Number.parseInt(saved?.groom?.count || '0', 10);
    if (groomServices && groomCount >= 1) {
      lines.push(`Groom*${groomCount} (${groomServices})`);
    }

    const bridesmaidServices = toServicesLabel(
      saved?.bridesmaid?.makeup,
      saved?.bridesmaid?.hairstyle
    );
    const bridesmaidCount = Number.parseInt(saved?.bridesmaid?.count || '0', 10);
    if (bridesmaidServices && bridesmaidCount >= 1) {
      lines.push(`Bridesmaid*${bridesmaidCount} (${bridesmaidServices})`);
    }

    const flowerGirlServices = toServicesLabel(
      saved?.flowerGirl?.makeup,
      saved?.flowerGirl?.hairstyle
    );
    const flowerGirlCount = Number.parseInt(saved?.flowerGirl?.count || '0', 10);
    if (flowerGirlServices && flowerGirlCount >= 1) {
      lines.push(`Flower Girl*${flowerGirlCount} (${flowerGirlServices})`);
    }

    if (lines.length > 0) {
      attendeesList.innerHTML = lines.map((line) => `<li>${line}</li>`).join('');
    }

    if (premiumList) {
      const premiumServices = Array.isArray(saved?.premiumServices)
        ? saved.premiumServices.filter(Boolean)
        : [];

      premiumList.innerHTML =
        premiumServices.length > 0
          ? premiumServices.map((service) => `<li>${service}</li>`).join('')
          : '<li>None selected</li>';
    }

    if (locationLine) {
      if (saved?.locationUndecided) {
        locationLine.textContent = 'Location: Not decided yet.';
      } else if (saved?.eventLocation) {
        locationLine.textContent = `Location: ${saved.eventLocation}`;
      } else {
        locationLine.textContent = 'Location: Not provided.';
      }
    }
  }

  if (contactLine && storage) {
    let savedContact = null;
    try {
      savedContact = JSON.parse(storage.getItem('bookingContact') || 'null');
    } catch (error) {
      savedContact = null;
    }

    const method = savedContact?.method;
    const value = (savedContact?.value || '').trim();

    if (method && value) {
      const verbByMethod = {
        call: 'call',
        whatsapp: 'message',
        sms: 'text',
        email: 'email',
      };

      const verb = verbByMethod[method] || 'contact';
      contactLine.textContent = `We will ${verb} ${value} to confirm the appointment details with you.`;
    }
  }
});

document.addEventListener('click', (event) => {
  const incrementBtn = event.target.closest('.input-number-increment');
  const decrementBtn = event.target.closest('.input-number-decrement');

  if (!incrementBtn && !decrementBtn) {
    return;
  }

  const group = event.target.closest('.input-number-group');
  const input = group?.querySelector('.input-number');

  if (!input) {
    return;
  }

  const currentValue = Number.parseInt(input.value || '0', 10);
  const safeValue = Number.isNaN(currentValue) ? 0 : currentValue;
  const min = Number.parseInt(input.min || '0', 10);
  const max = Number.parseInt(input.max || '20', 10);
  const minValue = Number.isNaN(min) ? 0 : min;
  const maxValue = Number.isNaN(max) ? 20 : max;

  if (incrementBtn) {
    input.value = String(Math.min(safeValue + 1, maxValue));
  }

  if (decrementBtn) {
    input.value = String(Math.max(safeValue - 1, minValue));
  }

  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
});
