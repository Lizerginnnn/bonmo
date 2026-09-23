/**
 * <ui-checkbox name="meeting" value="20 сентября">20 сентября — «Джейн Эйр»</ui-checkbox>
 * Атрибуты: name, value, checked, required, disabled. Содержимое тега — текст подписи.
 * Свойства: checked, value, invalid — красная рамка.
 */
class UiCheckbox extends HTMLElement {
  connectedCallback() {
    if (this.input) return;

    this.label = document.createElement('label');
    this.label.className = 'ui-checkbox';

    this.input = document.createElement('input');
    this.input.className = 'ui-checkbox__control';
    this.input.type = 'checkbox';
    this.input.name = this.getAttribute('name') || '';
    if (this.hasAttribute('value')) this.input.value = this.getAttribute('value');
    this.input.checked = this.hasAttribute('checked');
    this.input.required = this.hasAttribute('required');
    this.input.disabled = this.hasAttribute('disabled');

    const caption = document.createElement('span');
    caption.className = 'ui-checkbox__label';
    caption.append(...this.childNodes);

    this.label.append(this.input, caption);
    this.append(this.label);
  }

  get checked() {
    return this.input.checked;
  }

  set checked(checked) {
    this.input.checked = checked;
  }

  get value() {
    return this.input.value;
  }

  get invalid() {
    return this.label.classList.contains('is-invalid');
  }

  set invalid(invalid) {
    this.label.classList.toggle('is-invalid', invalid);
    this.input.setAttribute('aria-invalid', invalid);
  }
}

customElements.define('ui-checkbox', UiCheckbox);
