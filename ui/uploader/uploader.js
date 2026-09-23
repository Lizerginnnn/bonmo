const UPLOAD_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3M7 8l5-5 5 5M4 14v5a2 2 0 002 2h12a2 2 0 002-2v-5"/></svg>';

/**
 * <ui-uploader label="Прикрепите чек" name="file" accept="image/*,.pdf" hint="1 файл до 20 МБ." required></ui-uploader>
 * Атрибуты: label, name, accept, multiple, hint, button (текст кнопки, по умолчанию «Загрузить»), required, disabled.
 * Свойства: files, error — текст ошибки, пустая строка прячет её.
 * Пока файл не выбран, рядом с кнопкой виден hint, после выбора — имя файла.
 */
class UiUploader extends HTMLElement {
  connectedCallback() {
    if (this.input) return;

    const name = this.getAttribute('name') || '';

    const caption = document.createElement('p');
    caption.className = 'ui-uploader__label';
    caption.textContent = this.getAttribute('label') || '';
    if (this.hasAttribute('required')) {
      const mark = document.createElement('span');
      mark.className = 'ui-uploader__required';
      mark.textContent = ' *';
      caption.append(mark);
    }

    this.button = document.createElement('label');
    this.button.className = 'ui-uploader__button';
    this.button.innerHTML = UPLOAD_ICON;

    const buttonText = document.createElement('span');
    buttonText.textContent = this.getAttribute('button') || 'Загрузить';

    this.input = document.createElement('input');
    this.input.className = 'ui-uploader__control';
    this.input.type = 'file';
    this.input.name = name;
    if (this.hasAttribute('accept')) this.input.accept = this.getAttribute('accept');
    this.input.multiple = this.hasAttribute('multiple');
    this.input.required = this.hasAttribute('required');
    this.input.disabled = this.hasAttribute('disabled');
    this.input.setAttribute('aria-label', caption.textContent);

    this.button.append(buttonText, this.input);

    this.hint = this.getAttribute('hint') || '';
    this.fileName = document.createElement('span');
    this.fileName.className = 'ui-uploader__name';
    this.fileName.id = `${name}-hint`;
    this.fileName.textContent = this.hint;

    const row = document.createElement('div');
    row.className = 'ui-uploader__row';
    row.append(this.button, this.fileName);

    this.errorBox = document.createElement('ui-error');
    this.errorBox.id = `${name}-error`;

    this.input.setAttribute('aria-describedby', `${this.fileName.id} ${this.errorBox.id}`);
    this.input.addEventListener('change', () => {
      const names = [...this.input.files].map((file) => file.name);
      this.fileName.textContent = names.length ? names.join(', ') : this.hint;
    });

    this.append(caption, row, this.errorBox);
  }

  get files() {
    return this.input.files;
  }

  get error() {
    return this.errorBox.message;
  }

  set error(message) {
    this.errorBox.message = message;
    this.button.classList.toggle('is-invalid', Boolean(message));
    this.input.setAttribute('aria-invalid', Boolean(message));
  }
}

customElements.define('ui-uploader', UiUploader);
