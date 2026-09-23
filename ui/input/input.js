/**
 * <ui-input label="Имя" name="name" hint="(необходим для связи)" required></ui-input>
 * Атрибуты: label, name, type (по умолчанию text), value, placeholder, autocomplete, hint, required, disabled.
 * Свойства: value, error — текст ошибки, пустая строка прячет её.
 */
class UiInput extends HTMLElement {
  connectedCallback() {
    if (this.input) return;

    const name = this.getAttribute('name') || '';

    const label = document.createElement('label');
    label.className = 'ui-input';

    const caption = document.createElement('span');
    caption.className = 'ui-input__label';
    caption.textContent = this.getAttribute('label') || '';
    if (this.hasAttribute('required')) {
      const mark = document.createElement('span');
      mark.className = 'ui-input__required';
      mark.textContent = ' *';
      caption.append(mark);
    }

    this.input = document.createElement('input');
    this.input.className = 'ui-input__control';
    this.input.type = this.getAttribute('type') || 'text';
    this.input.name = name;
    this.input.value = this.getAttribute('value') || '';
    this.input.placeholder = this.getAttribute('placeholder') || '';
    this.input.required = this.hasAttribute('required');
    this.input.disabled = this.hasAttribute('disabled');
    if (this.hasAttribute('autocomplete')) this.input.autocomplete = this.getAttribute('autocomplete');

    label.append(caption, this.input);
    this.append(label);

    const described = [];

    if (this.hasAttribute('hint')) {
      const hint = document.createElement('p');
      hint.className = 'ui-input__hint';
      hint.id = `${name}-hint`;
      hint.textContent = this.getAttribute('hint');
      described.push(hint.id);
      this.append(hint);
    }

    this.errorBox = document.createElement('ui-error');
    this.errorBox.id = `${name}-error`;
    described.push(this.errorBox.id);
    this.append(this.errorBox);

    this.input.setAttribute('aria-describedby', described.join(' '));
  }

  get value() {
    return this.input.value;
  }

  set value(value) {
    this.input.value = value;
  }

  get error() {
    return this.errorBox.message;
  }

  set error(message) {
    this.errorBox.message = message;
    this.input.classList.toggle('is-invalid', Boolean(message));
    this.input.setAttribute('aria-invalid', Boolean(message));
  }
}

customElements.define('ui-input', UiInput);
