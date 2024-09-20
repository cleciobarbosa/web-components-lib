class InputText extends HTMLElement {
    constructor() {
        super();
        this.inputId = `bohm-input-${Math.random().toString(36).substr(2, 9)}`;
        this.label = this.getAttribute("label") || "";
        this.maxlength = this.getAttribute("maxlength");
        this._disabled = this.hasAttribute("disabled");  // Armazena o valor de 'disabled'
        this._required = this.hasAttribute("required");  // Armazena o valor de 'required'

        this.innerHTML = `
            <div class="form-group">
                <label class="text-muted mb-0" for="${this.inputId}">${this.label}</label>
                <input type="text" class="form-control" id="${this.inputId}" data-type-text 
                        ${this.maxlength ? `maxlength="${this.maxlength}"` : ""}
                        ${this._disabled ? "disabled" : ""}
                        ${this._required ? "required" : ""}/>
            </div>
        `;
    }

    connectedCallback() {
        // Referência ao input interno (só aqui garantimos que o input existe)
        this.inputElement = this.querySelector('input');
        this.inputElement.value = this.getAttribute("value") || "";

        // Sincronizar maxlength, disabled e required no momento da conexão
        if (this.maxlength) {
            this.inputElement.setAttribute('maxlength', this.maxlength);
        }
        this.inputElement.disabled = this._disabled;
        this.inputElement.required = this._required;

        // Armazena as classes iniciais do input
        this.initialClasses = [...this.inputElement.classList];

        // Observa mudanças na classe do componente
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.onClassChange(mutation);
                }
            }
        });

        observer.observe(this, { attributes: true, attributeOldValue: true });
        this.observer = observer;

        this._isInputRequired();
    }

    // Método chamado quando a classe do host é alterada
    onClassChange(mutation) {
        const oldClassList = mutation.oldValue ? mutation.oldValue.split(/\s+/) : [];
        const newClassList = this.className.split(/\s+/);

        // Classes adicionadas
        const addedClasses = newClassList.filter(className => !oldClassList.includes(className));

        // Classes removidas
        const removedClasses = oldClassList.filter(className => !newClassList.includes(className));

        // Adiciona as classes novas ao input interno
        addedClasses.forEach(className => {
            if (typeof className === 'string' && className.trim() !== '') {
                this.inputElement.classList.add(className);
            }
        });

        // Remove as classes que foram removidas do host, exceto as classes iniciais
        removedClasses.forEach(className => {
            if (typeof className === 'string' && className.trim() !== '' && !this.initialClasses.includes(className)) {
                this.inputElement.classList.remove(className);
            }
        });
    }

    // Getter e setter para o atributo 'disabled'
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        const isDisabled = Boolean(value);

        if (this._disabled !== isDisabled) {
            this._disabled = isDisabled;

            if (this.inputElement) {
                this.inputElement.disabled = this._disabled;
            }

            if (this._disabled) {
                this.setAttribute('disabled', '');  // Adiciona o atributo 'disabled' no host
            } else {
                this.removeAttribute('disabled');   // Remove o atributo 'disabled' do host
            }
        }
    }

    // Getter e setter para o atributo 'required'
    get required() {
        return this._required;
    }

    set required(value) {
        const isRequired = Boolean(value);

        if (this._required !== isRequired) {
            this._required = isRequired;

            if (this.inputElement) {
                this.inputElement.required = this._required;
            }

            if (this._required) {
                this.setAttribute('required', '');  // Adiciona o atributo 'required' no host
            } else {
                this.removeAttribute('required');   // Remove o atributo 'required' do host
            }
        }
    }

    // Desconectar o observer quando o elemento é removido do DOM, se necessário
    disconnectedCallback() {
        this.observer.disconnect();
    }

    _isInputRequired() {
        if (this.hasAttribute('required')) {
            this.inputElement.setAttribute('required', '');
        }
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        // Verifica se o inputElement já foi inicializado
        if (!this.inputElement) {
            return;
        }

        if (attrName === 'required') {
            if (newValue === null && this.required) {
                this.required = false;
            } else if (newValue !== null && !this.required) {
                this.required = true;
            }
        } else if (attrName === 'disabled') {
            if (newValue === null && this.disabled) {
                this.disabled = false;
            } else if (newValue !== null && !this.disabled) {
                this.disabled = true;
            }
        } else if (attrName === 'maxlength') {
            if (newValue === null) {
                this.inputElement.removeAttribute('maxlength');
            } else {
                this.inputElement.setAttribute('maxlength', newValue);
            }
        }
    }

    static get observedAttributes() {
        return ['required', 'disabled', 'maxlength'];
    }

    get value() {
        return this.inputElement ? this.inputElement.value : '';
    }

    set value(val) {
        if (this.inputElement) {
            this.inputElement.value = val;
            this.inputElement.dispatchEvent(new Event('input')); // Disparar evento de input
        }
    }
}

customElements.define('input-text', InputText);
