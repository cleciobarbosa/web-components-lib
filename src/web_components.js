class InputText extends HTMLElement {
    constructor() {
        super();
        this.inputId = `bohm-input-${Math.random().toString(36).substr(2, 9)}`;
        this.label = this.getAttribute("label") || "";
        this.maxlength = this.getAttribute("maxlength");
        this.disabled = this.hasAttribute("disabled");

        this.innerHTML = `
            <div class="form-group">
                <label class="text-muted mb-0" for="${this.inputId}">${this.label}</label>
                <input type="text" class="form-control" id="${this.inputId}" data-type-text 
                        ${this.maxlength ? `maxlength="${this.maxlength}"` : ""}
                        ${this.disabled ? "disabled" : ""}/>
            </div>
        `;


        // Referência ao input interno
        this.inputElement = this.querySelector('input');
        this.inputElement.value = this.getAttribute("value") || "";
        // Armazena as classes iniciais do input
        this.initialClasses = [...this.inputElement.classList];
        // Cria um observer para monitorar mudanças no atributo "class" do host
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    this.onClassChange(mutation);
                }
            }
        });

        // Observa o elemento atual (this) para mudanças no atributo "class"
        observer.observe(this, { attributes: true, attributeOldValue: true });

        // Adiciona o observer à instância do componente para que ele possa ser limpo mais tarde, se necessário
        this.observer = observer;

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

    // Desconectar o observer quando o elemento é removido do DOM, se necessário
    disconnectedCallback() {
        this.observer.disconnect();
    }
    _isInputRequired() {
        if (this.hasAttribute('required')) {
            this.inputElement.setAttribute('required', '');
        }
    }

    connectedCallback() {
        this._isInputRequired();

        // Sincronizar valor inicial
        if (this.hasAttribute('value')) {
            this.value = this.getAttribute('value');
        }

        // Sincronizar maxlength e disabled no momento da conexão
        if (this.maxlength) {
            this.inputElement.setAttribute('maxlength', this.maxlength);
        }
        if (this.disabled) {
            this.inputElement.setAttribute('disabled', '');
        }
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === 'required') {
            if (newValue === null) {
                this.inputElement.removeAttribute('required');
            } else {
                this.inputElement.setAttribute('required', '');
            }
        } else if (attrName === 'disabled') {
            if (newValue === null) {
                this.inputElement.removeAttribute('disabled');
            } else {
                this.inputElement.setAttribute('disabled', '');
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
        return this.inputElement.value;
    }
    set value(val) {
        this.inputElement.value = val;
        this.inputElement.dispatchEvent(new Event('input')); // Disparar evento de input

    }
}

// Registrar o componente customizado
customElements.define('input-text', InputText);

class InputCep extends InputText {
    constructor() {
        super();
    }

    connectedCallback() {
        // Chama o connectedCallback do InputText para manter a funcionalidade original
        super.connectedCallback();

        // Adicionar o evento de input para aplicar a máscara de CEP
        this.inputElement.addEventListener('input', this.applyCepMask.bind(this));
    }

    applyCepMask(event) {
        let value = this.inputElement.value;

        // Remove qualquer caractere que não seja número
        value = value.replace(/\D/g, '');

        // Aplica o formato de máscara (12345-678)
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5, 8);
        }

        // Atualiza o valor do input com a máscara aplicada
        this.inputElement.value = value;
    }
}

// Registrar o novo componente customizado
customElements.define('input-cep', InputCep);

class InputCheckbox extends HTMLElement {
    constructor() {
        super();
        this.inputId = `checkbox-input-${Math.random().toString(36).substr(2, 9)}`;
        this.label = this.getAttribute("label") || "";
        this._checked = this.hasAttribute("checked");
        this._disabled = this.hasAttribute("disabled");

        // Define o HTML do componente
        this.innerHTML = `
            <div class="form-group form-check">
                <input type="checkbox" class="form-check-input" id="${this.inputId}"
                    ${this._checked ? "checked" : ""}
                    ${this._disabled ? "disabled" : ""}>
                <label class="form-check-label" for="${this.inputId}">${this.label}</label>
            </div>
        `;

        // Referência ao input interno
        this.inputElement = this.querySelector('input');
    }

    connectedCallback() {
        this.syncAttributes();
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
        if (this._checked) {
            this.inputElement.setAttribute('checked', '');
        }
        if (this._disabled) {
            this.inputElement.setAttribute('disabled', '');
        }
    }

    // Getter e Setter para a propriedade "checked"
    get checked() {
        return this.inputElement.checked;
    }

    set checked(val) {
        this.inputElement.checked = val;
        if (val) {
            this.setAttribute('checked', '');
        } else {
            this.removeAttribute('checked');
        }
    }

    // Getter e Setter para a propriedade "disabled"
    get disabled() {
        return this.inputElement.disabled;
    }

    set disabled(val) {
        this.inputElement.disabled = val;
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }
}

// Registrar o componente customizado
customElements.define('input-checkbox', InputCheckbox);

class InputDatepicker extends HTMLElement {
    constructor() {
        super();
        this.inputId = `datepicker-input-${Math.random().toString(36).substr(2, 9)}`;
        this.label = this.getAttribute("label") || "Select Date";
        this._value = this.getAttribute("value") || "";

        // Define o HTML do componente
        this.innerHTML = `
            <div class="form-group">
                <label class="form-label" for="${this.inputId}">${this.label}</label>
                <input type="text" class="form-control" id="${this.inputId}" placeholder="yyyy-mm-dd">
            </div>
        `;

        // Referência ao input interno
        this.inputElement = this.querySelector('input');
    }

    connectedCallback() {
        // Inicializar o jQuery UI Datepicker no input
        $(this.inputElement).datepicker({
            dateFormat: "yy-mm-dd",
            onSelect: this.handleDateSelect.bind(this)
        });

        // Define o valor inicial, se especificado
        if (this._value) {
            $(this.inputElement).datepicker('setDate', this._value);
        }
    }

    // Manipula a seleção de data
    handleDateSelect(dateText) {
        // Dispara o evento personalizado
        const event = new CustomEvent('date-change', {
            detail: {
                date: dateText
            }
        });
        this.dispatchEvent(event);
    }

    // Getter e Setter para o valor da data
    get value() {
        return this.inputElement.value;
    }

    set value(val) {
        $(this.inputElement).datepicker('setDate', val);
        this.inputElement.value = val;
    }
}

// Registrar o componente customizado
customElements.define('input-datepicker', InputDatepicker);


