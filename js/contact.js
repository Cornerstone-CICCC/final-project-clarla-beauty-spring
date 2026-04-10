document.addEventListener('DOMContentLoaded', () => {
  // Cache key DOM references and current-page flags used across the form flow.
  const eventTypeButtons = document.querySelectorAll('#eventType .event-type-btn');
  const serviceForm = document.querySelector('#service-form');
  const nextButton = serviceForm?.querySelector('button[type="submit"]');
  const isWeddingDetailsForm = Boolean(serviceForm?.matches('form[data-wedding-form]'));
  const currentPath = (window.location.pathname || '').toLowerCase();
  const isWeddingDetailsPage = currentPath.includes('contact_service-wedding.html');

  // On wedding details page, force submit to booked confirmation page.
  if (isWeddingDetailsForm && isWeddingDetailsPage && nextButton) {
    // Keep wedding details submit destination fixed regardless of bridal service toggles.
    nextButton.setAttribute('formaction', 'contact_service-wedding-booked.html');
  }

  // Update submit target based on selected event type on the main services form.
  const updateNextButtonAction = () => {
    if (!nextButton) {
      return;
    }

    const selectedValue = (
      document.querySelector('#eventType .event-type-btn.is-selected')?.value || ''
    ).toLowerCase();

    const target =
      selectedValue === 'wedding' ? 'contact_service-wedding.html' : 'contact_service-party.html';

    nextButton.setAttribute('formaction', target);
  };

  // Handle service-type button behavior for both single-select and multi-select groups.
  if (eventTypeButtons.length > 0) {
    const eventValues = Array.from(eventTypeButtons).map((button) =>
      (button.value || '').trim().toLowerCase()
    );

    const isMainServicePicker =
      eventValues.includes('wedding') &&
      eventValues.includes('party') &&
      eventValues.includes('photoshoot');

    let hasSelectedButton = false;

    eventTypeButtons.forEach((button, index) => {
      // Ensure at least one button starts selected in single-select groups.
      const shouldSelect =
        button.classList.contains('is-selected') || (!hasSelectedButton && index === 0);

      if (shouldSelect) {
        button.classList.add('is-selected');
        hasSelectedButton = true;
      }

      button.addEventListener('click', () => {
        if (isMainServicePicker) {
          // Main picker behaves like tabs: keep only one option selected.
          eventTypeButtons.forEach((item) => item.classList.remove('is-selected'));
          button.classList.add('is-selected');
          updateNextButtonAction();
          return;
        }

        // Bridal service buttons on wedding page support independent multi-select.
        button.classList.toggle('is-selected');
      });
    });

    if (isMainServicePicker) {
      updateNextButtonAction();
    }
  }

  // Guard localStorage access (can fail in private mode or strict browser settings).
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

  // Persist/remove visitor name used later on confirmation pages.
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

  // Save the name during input, navigation, submit, and unload to avoid data loss.
  if (nameInput) {
    const saveFromField = () => saveBookingName(nameInput.value);

    nameInput.addEventListener('input', saveFromField);
    nameInput.addEventListener('change', saveFromField);

    document.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', saveFromField);
    });

    if (serviceForm) {
      serviceForm.addEventListener('submit', saveFromField);
    }

    window.addEventListener('beforeunload', saveFromField);
    saveFromField();
  }

  // Track selected contact method and corresponding entered value.
  const contactMethodInputs = document.querySelectorAll('input[name="contactMethod"]');

  if (contactMethodInputs.length > 0 && storage) {
    const contactFieldMap = {
      call: document.querySelector('#call-number'),
      whatsapp: document.querySelector('#whatsapp-number'),
      sms: document.querySelector('#sms-number'),
      email: document.querySelector('#email-address'),
    };

    // Save contact payload as JSON so booked pages can render a single summary line.
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

    if (serviceForm) {
      serviceForm.addEventListener('submit', saveContactDetails);
    }

    window.addEventListener('beforeunload', saveContactDetails);
    saveContactDetails();
  }

  // Inject visitor name into any placeholder element marked with data-booking-name.
  const bookingNameTargets = document.querySelectorAll('[data-booking-name]');

  if (bookingNameTargets.length > 0 && storage) {
    const savedName = (storage.getItem('bookingName') || '').trim();

    bookingNameTargets.forEach((element) => {
      element.textContent = savedName || 'there';
    });
  }

  // Collect wedding-details fields used to build attendee and service summaries.
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

  // Resolve premium checkbox inputs by id and combine with all wedding form inputs.
  const premiumServiceInputs = premiumServiceIds
    .map((id) => document.querySelector(`#${id}`))
    .filter(Boolean);

  const weddingInputs = [...Object.values(weddingFields), ...premiumServiceInputs].filter(Boolean);

  if (weddingInputs.length > 0 && storage) {
    // Normalize count inputs to non-negative integers.
    const getCount = (input) => {
      const parsed = Number.parseInt(input?.value || '0', 10);
      return Number.isNaN(parsed) ? 0 : Math.max(parsed, 0);
    };

    // Save all wedding detail selections so booked pages can render complete recap.
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

  // Read stored recap data and render attendee/services/location on booked pages.
  const attendeesList = document.querySelector('[data-additional-attendees-list]');
  const premiumList = document.querySelector('[data-premium-services-list]');
  const locationLine = document.querySelector('[data-booking-location-line]');
  const contactLine = document.querySelector('[data-booking-contact-line]');
  const currentPage = (window.location.pathname || '').toLowerCase();
  const isPartyBookedPage = currentPage.includes('contact_service-party-booked.html');

  if ((attendeesList || premiumList || locationLine) && storage) {
    // Build compact service labels like "makeup+hairstyle".
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
      // Parse persisted attendee payload; gracefully ignore malformed data.
      saved = JSON.parse(storage.getItem('weddingAttendees') || 'null');
    } catch (error) {
      saved = null;
    }

    const lines = [];
    const primaryLabel = isPartyBookedPage ? 'Woman' : 'Groom';
    const secondaryLabel = isPartyBookedPage ? 'Man' : 'Bridesmaid';

    const groomServices = toServicesLabel(saved?.groom?.makeup, saved?.groom?.hairstyle);
    const groomCount = Number.parseInt(saved?.groom?.count || '0', 10);
    if (groomServices && groomCount >= 1) {
      lines.push(`${primaryLabel}*${groomCount} (${groomServices})`);
    }

    const bridesmaidServices = toServicesLabel(
      saved?.bridesmaid?.makeup,
      saved?.bridesmaid?.hairstyle
    );
    const bridesmaidCount = Number.parseInt(saved?.bridesmaid?.count || '0', 10);
    if (bridesmaidServices && bridesmaidCount >= 1) {
      lines.push(`${secondaryLabel}*${bridesmaidCount} (${bridesmaidServices})`);
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
      // Render attendee summary rows.
      attendeesList.innerHTML = lines.map((line) => `<li>${line}</li>`).join('');
    }

    if (premiumList) {
      const premiumServices = Array.isArray(saved?.premiumServices)
        ? saved.premiumServices.filter(Boolean)
        : [];

      premiumList.innerHTML =
        premiumServices.length > 0
          ? premiumServices.map((service) => `<li>${service}</li>`).join('')
          : // Keep UI explicit when no add-ons were selected.
            '<li>None selected</li>';
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

  // Render preferred confirmation channel on booked pages.
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

// Shared click handler for +/- controls used by numeric attendee counters.
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
  const max = Number.parseInt(input.max || '5', 10);
  const minValue = Number.isNaN(min) ? 0 : min;
  const maxValue = Number.isNaN(max) ? 5 : max;

  // Increase/decrease within input min/max constraints.
  if (incrementBtn) {
    input.value = String(Math.min(safeValue + 1, maxValue));
  }

  if (decrementBtn) {
    input.value = String(Math.max(safeValue - 1, minValue));
  }

  // Trigger listeners that persist form state after value changes.
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
});
