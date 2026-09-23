/**
 * <ui-checkbox-group label="Выбери встречу" required>
 *   <ui-checkbox name="meeting" value="…">…</ui-checkbox>
 * </ui-checkbox-group>
 * Атрибуты: label, required. Внутри — ui-checkbox.
 * Свойства: values — значения отмеченных чекбоксов, error — текст ошибки, пустая строка прячет её.
 */
class UiCheckboxGroup extends HTMLElement {
  connectedCallback() {
    if (this.errorBox) return;

    const fieldset = document.createElement('fieldset');
    fieldset.className = 'ui-checkbox-group';

    const legend = document.createElement('legend');
    legend.className = 'ui-checkbox-group__label';
    legend.textContent = this.getAttribute('label') || '';
    if (this.hasAttribute('required')) {
      const mark = document.createElement('span');
      mark.className = 'ui-checkbox-group__required';
      mark.textContent = ' *';
      legend.append(mark);
    }

    const options = document.createElement('div');
    options.className = 'ui-checkbox-group__options';
    options.append(...this.childNodes);

    this.errorBox = document.createElement('ui-error');

    fieldset.append(legend, options, this.errorBox);
    this.append(fieldset);
  }

  get checkboxes() {
    return [...this.querySelectorAll('ui-checkbox')];
  }

  get values() {
    return this.checkboxes.filter((box) => box.checked).map((box) => box.value);
  }

  get error() {
    return this.errorBox.message;
  }

  set error(message) {
    this.errorBox.message = message;
    this.checkboxes.forEach((box) => {
      box.invalid = Boolean(message);
    });
  }
}

customElements.define('ui-checkbox-group', UiCheckboxGroup);
