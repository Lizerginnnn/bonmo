/**
 * <ui-button type="submit" loading-text="Отправляем…">Отправить</ui-button>
 * Атрибуты: type (button | submit | reset, по умолчанию button), disabled, loading-text.
 * Свойства: disabled, loading — показывает спиннер и блокирует кнопку.
 */
class UiButton extends HTMLElement {
  connectedCallback() {
    if (this.button) return;

    this.button = document.createElement('button');
    this.button.className = 'ui-button';
    this.button.type = this.getAttribute('type') || 'button';
    this.button.disabled = this.hasAttribute('disabled');

    this.spinner = document.createElement('span');
    this.spinner.className = 'ui-button__spinner';
    this.spinner.hidden = true;

    this.text = document.createElement('span');
    this.text.className = 'ui-button__text';
    this.text.append(...this.childNodes);
    this.label = this.text.textContent;

    this.button.append(this.spinner, this.text);
    this.append(this.button);
  }

  get disabled() {
    return this.button.disabled;
  }

  set disabled(disabled) {
    this.button.disabled = disabled;
  }

  get loading() {
    return !this.spinner.hidden;
  }

  set loading(loading) {
    this.button.disabled = loading;
    this.spinner.hidden = !loading;
    this.text.textContent = loading ? this.getAttribute('loading-text') || this.label : this.label;
  }
}

customElements.define('ui-button', UiButton);
