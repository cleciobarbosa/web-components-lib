// InputText.test.js

// Importamos o Jest e jsdom para simular o ambiente de DOM
import '@testing-library/jest-dom'; // Adiciona matchers como toBeInTheDocument, etc.

// Definir o componente (pode ser feito via import se estiver em um arquivo separado)
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
