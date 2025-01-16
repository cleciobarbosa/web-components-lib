class BohmBadge extends HTMLElement {
    constructor() {
        super();
        this.text = this.getAttribute('text') || '';
        this.variant = this.getAttribute('variant') || 'primary'; // Classe Bootstrap (primary, success, danger, etc.)
        this.pill = this.hasAttribute('pill'); // Se o badge será em formato "pill"

        // Define o HTML do componente
        this.innerHTML = `
            <span class="badge ${this._getBadgeClasses()}">${this.text}</span>
        `;

        // Referência ao badge interno
        this.badgeElement = this.querySelector('.badge');
    }

    connectedCallback() {
        // Sincronizar atributos iniciais
        this.syncAttributes();

        // Observa mudanças nas classes do host
        this.initialClasses = [...this.classList];
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
        return ['text', 'variant', 'pill'];
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === 'text') {
            this.text = newValue || '';
            this.badgeElement.textContent = this.text;
        } else if (attrName === 'variant') {
            this.variant = newValue || 'primary';
            this.updateBadgeClasses();
        } else if (attrName === 'pill') {
            this.pill = newValue !== null;
            this.updateBadgeClasses();
        }
    }

    syncAttributes() {
        this.badgeElement.textContent = this.text;
        this.updateBadgeClasses();
    }

    updateBadgeClasses() {
        this.badgeElement.className = `badge ${this._getBadgeClasses()}`;
    }

    syncClassChanges(mutation) {
        const oldClasses = mutation.oldValue ? mutation.oldValue.split(/\s+/) : [];
        const newClasses = this.className.split(/\s+/);

        const addedClasses = newClasses.filter((cls) => !oldClasses.includes(cls));
        const removedClasses = oldClasses.filter((cls) => !newClasses.includes(cls));

        addedClasses.forEach((cls) => this.badgeElement.classList.add(cls));
        removedClasses.forEach((cls) => {
            if (!this.initialClasses.includes(cls)) {
                this.badgeElement.classList.remove(cls);
            }
        });
    }

    _getBadgeClasses() {
        const classes = [`badge-${this.variant}`];
        if (this.pill) classes.push('rounded-pill');
        return classes.join(' ');
    }

    // Getter e Setter para "text"
    get text() {
        return this._text || '';
    }

    set text(val) {
        this._text = val;
        if (this.badgeElement) {
            this.badgeElement.textContent = val;
        }
    }

    // Getter e Setter para "variant"
    get variant() {
        return this._variant || 'primary';
    }

    set variant(val) {
        this._variant = val;
        if (this.badgeElement) {
            this.updateBadgeClasses();
        }
    }

    // Getter e Setter para "pill"
    get pill() {
        return this._pill || false;
    }

    set pill(val) {
        this._pill = Boolean(val);
        if (this.badgeElement) {
            this.updateBadgeClasses();
        }
    }
}

customElements.define('bohm-badge', BohmBadge);
