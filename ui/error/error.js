/**
 * <ui-error></ui-error>
 * Сообщение об ошибке под полем. Выезжает, когда задан message, и прячется при пустой строке.
 * Используется внутри других компонентов: field.error = 'Текст'.
 */
class UiError extends HTMLElement {
  connectedCallback() {
    if (this.text) return;

    this.setAttribute('aria-live', 'polite');

    const clip = document.createElement('span');
    clip.className = 'ui-error__clip';

    this.text = document.createElement('span');
    this.text.className = 'ui-error__text';

    clip.append(this.text);
    this.append(clip);
  }

  get message() {
    return this.classList.contains('is-shown') ? this.text.textContent : '';
  }

  set message(message) {
    // При скрытии текст оставляем, чтобы блок схлопывался вместе с ним
    if (message) this.text.textContent = message;
    this.classList.toggle('is-shown', Boolean(message));
  }
}

customElements.define('ui-error', UiError);
