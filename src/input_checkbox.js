class InputCheckbox extends HTMLElement {
    constructor() {
        super();
        this.inputId = `checkbox-input-${Math.random().toString(36).substr(2, 9)}`;
        this.label = this.getAttribute("label") || "";
        this._checked = this.hasAttribute("checked");
        this._disabled = this.hasAttribute("disabled");

        // Define o HTML do componente
        this.innerHTML = `
            <div class="checkbox mb-1">
                <div class="custom-control custom-checkbox custom-control-inline">
                    <input type="checkbox" class="custom-control-input" id="${this.inputId}"  data-type-check
                        ${this._checked ? "checked" : ""}
                        ${this._disabled ? "disabled" : ""}>
                    <label class="custom-control-label" for="${this.inputId}">
                        ${this.label}
                    </label>
                </div>
            </div>
        `;

        // Referência ao input interno
        this.inputElement = this.querySelector('input');
    }

    connectedCallback() {
        // Sincroniza atributos iniciais
        this.syncAttributes();

        // Dispara evento ao mudar o estado de "checked"
        this.inputElement.addEventListener('change', () => {
            this._checked = this.inputElement.checked;
            this._dispatchCheckedChanged(this._checked);
        });

        // Observa mudanças nas classes do host
        this.initialClasses = [...this.classList]; // Armazena as classes iniciais
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.syncClassChanges(mutation);
                }
            }
        });

        observer.observe(this, { attributes: true, attributeOldValue: true });
        this.observer = observer;
    }

    disconnectedCallback() {
        if (this.observer) this.observer.disconnect();
    }

    static get observedAttributes() {
        return ['checked', 'disabled'];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === 'checked') {
            this.checked = newValue !== null;
        } else if (attrName === 'disabled') {
            this.disabled = newValue !== null;
        }
    }

    syncAttributes() {
        this.inputElement.checked = this._checked;
        this.inputElement.disabled = this._disabled;
    }

    syncClassChanges(mutation) {
        const oldClasses = mutation.oldValue ? mutation.oldValue.split(/\s+/) : [];
        const newClasses = this.className.split(/\s+/);

        const addedClasses = newClasses.filter((cls) => !oldClasses.includes(cls));
        const removedClasses = oldClasses.filter((cls) => !newClasses.includes(cls));

        addedClasses.forEach((cls) => this.inputElement.classList.add(cls));
        removedClasses.forEach((cls) => {
            if (!this.initialClasses.includes(cls)) {
                this.inputElement.classList.remove(cls);
            }
        });
    }

    // Getter e Setter para "checked"
    get checked() {
        return this.inputElement.checked;
    }

    set checked(val) {
        const isChecked = Boolean(val);
        if (this._checked !== isChecked) {
            this._checked = isChecked;
            this.inputElement.checked = isChecked;

            if (isChecked) {
                this.setAttribute('checked', '');
            } else {
                this.removeAttribute('checked');
            }
        }
    }

    // Getter e Setter para "disabled"
    get disabled() {
        return this.inputElement.disabled;
    }

    set disabled(val) {
        const isDisabled = Boolean(val);
        if (this._disabled !== isDisabled) {
            this._disabled = isDisabled;
            this.inputElement.disabled = isDisabled;

            if (isDisabled) {
                this.setAttribute('disabled', '');
            } else {
                this.removeAttribute('disabled');
            }
        }
    }

    // Dispara evento customizado 'checkedChanged'
    _dispatchCheckedChanged(newValue) {
        const event = new CustomEvent('checkedChanged', {
            detail: { checked: newValue },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
}

customElements.define('input-checkbox', InputCheckbox);
