

// class InputCep extends InputText {
//     constructor() {
//         super();
//     }

//     connectedCallback() {
//         // Chama o connectedCallback do InputText para manter a funcionalidade original
//         super.connectedCallback();

//         // Adicionar o evento de input para aplicar a máscara de CEP
//         this.inputElement.addEventListener('input', this.applyCepMask.bind(this));
//     }

//     applyCepMask(event) {
//         let value = this.inputElement.value;

//         // Remove qualquer caractere que não seja número
//         value = value.replace(/\D/g, '');

//         // Aplica o formato de máscara (12345-678)
//         if (value.length > 5) {
//             value = value.slice(0, 5) + '-' + value.slice(5, 8);
//         }

//         // Atualiza o valor do input com a máscara aplicada
//         this.inputElement.value = value;
//     }
// }

// // Registrar o novo componente customizado
// customElements.define('input-cep', InputCep);

// class InputCheckbox extends HTMLElement {
//     constructor() {
//         super();
//         this.inputId = `checkbox-input-${Math.random().toString(36).substr(2, 9)}`;
//         this.label = this.getAttribute("label") || "";
//         this._checked = this.hasAttribute("checked");
//         this._disabled = this.hasAttribute("disabled");

//         // Define o HTML do componente
//         this.innerHTML = `
//             <div class="form-group form-check">
//                 <input type="checkbox" class="form-check-input" id="${this.inputId}"
//                     ${this._checked ? "checked" : ""}
//                     ${this._disabled ? "disabled" : ""}>
//                 <label class="form-check-label" for="${this.inputId}">${this.label}</label>
//             </div>
//         `;

//         // Referência ao input interno
//         this.inputElement = this.querySelector('input');
//     }

//     connectedCallback() {
//         this.syncAttributes();
//     }

//     static get observedAttributes() {
//         return ['checked', 'disabled'];
//     }

//     attributeChangedCallback(attrName, oldValue, newValue) {
//         if (attrName === 'checked') {
//             this.checked = newValue !== null;
//         } else if (attrName === 'disabled') {
//             this.disabled = newValue !== null;
//         }
//     }

//     syncAttributes() {
//         if (this._checked) {
//             this.inputElement.setAttribute('checked', '');
//         }
//         if (this._disabled) {
//             this.inputElement.setAttribute('disabled', '');
//         }
//     }

//     // Getter e Setter para a propriedade "checked"
//     get checked() {
//         return this.inputElement.checked;
//     }

//     set checked(val) {
//         this.inputElement.checked = val;
//         if (val) {
//             this.setAttribute('checked', '');
//         } else {
//             this.removeAttribute('checked');
//         }
//     }

//     // Getter e Setter para a propriedade "disabled"
//     get disabled() {
//         return this.inputElement.disabled;
//     }

//     set disabled(val) {
//         this.inputElement.disabled = val;
//         if (val) {
//             this.setAttribute('disabled', '');
//         } else {
//             this.removeAttribute('disabled');
//         }
//     }
// }

// // Registrar o componente customizado
// customElements.define('input-checkbox', InputCheckbox);

// class InputDatepicker extends HTMLElement {
//     constructor() {
//         super();
//         this.inputId = `datepicker-input-${Math.random().toString(36).substr(2, 9)}`;
//         this.label = this.getAttribute("label") || "Select Date";
//         this._value = this.getAttribute("value") || "";

//         // Define o HTML do componente
//         this.innerHTML = `
//             <div class="form-group">
//                 <label class="form-label" for="${this.inputId}">${this.label}</label>
//                 <input type="text" class="form-control" id="${this.inputId}" placeholder="yyyy-mm-dd">
//             </div>
//         `;

//         // Referência ao input interno
//         this.inputElement = this.querySelector('input');
//     }

//     connectedCallback() {
//         // Inicializar o jQuery UI Datepicker no input
//         $(this.inputElement).datepicker({
//             dateFormat: "yy-mm-dd",
//             onSelect: this.handleDateSelect.bind(this)
//         });

//         // Define o valor inicial, se especificado
//         if (this._value) {
//             $(this.inputElement).datepicker('setDate', this._value);
//         }
//     }

//     // Manipula a seleção de data
//     handleDateSelect(dateText) {
//         // Dispara o evento personalizado
//         const event = new CustomEvent('date-change', {
//             detail: {
//                 date: dateText
//             }
//         });
//         this.dispatchEvent(event);
//     }

//     // Getter e Setter para o valor da data
//     get value() {
//         return this.inputElement.value;
//     }

//     set value(val) {
//         $(this.inputElement).datepicker('setDate', val);
//         this.inputElement.value = val;
//     }
// }

// // Registrar o componente customizado
// customElements.define('input-datepicker', InputDatepicker);


