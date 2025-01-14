import '../src/input_text'; // Ajuste o caminho conforme necessário

describe('InputText', () => {
    let component;

    beforeEach(() => {
        document.body.innerHTML = '<input-text label="Nome" value="John Doe"></input-text>';
        component = document.querySelector('input-text');
    });

    it('deve renderizar corretamente o input e o label', () => {
        const label = component.querySelector('label');
        const input = component.querySelector('input');

        expect(label).toBeInTheDocument();
        expect(input).toBeInTheDocument();
        expect(label.textContent).toBe('Nome');
    });

    it('deve inicializar o valor do input corretamente', () => {
        const input = component.querySelector('input');
        expect(input.value).toBe('John Doe');
    });

    it('deve refletir as mudanças de valor no input', () => {
        const input = component.querySelector('input');
        component.value = 'Jane Doe';
        expect(input.value).toBe('Jane Doe');
    });

    it('deve aplicar maxlength e disabled corretamente', () => {
        component.setAttribute('maxlength', '10');
        component.setAttribute('disabled', '');

        const input = component.querySelector('input');
        expect(input).toHaveAttribute('maxlength', '10');
        expect(input).toBeDisabled();
    });

    test('deve refletir as classes do host no input', () => {
        // Adiciona uma nova classe ao componente
        component.classList.add('new-class');
        
        // Obtém o input interno
        const input = component.querySelector('input');
        
        // Aguarde o MutationObserver processar as mudanças
        setTimeout(() => {
            // Verifica se a nova classe foi adicionada ao input
            expect(input).toHaveClass('new-class');
        }, 0);
    });

    it('deve emitir o evento valueChanged quando o valor mudar', () => {
        const input = component.querySelector('input');
        const newValue = 'Alice Doe';

        // Cria um espião para o evento valueChanged
        const valueChangedSpy = jest.fn();
        component.addEventListener('valueChanged', valueChangedSpy);

        // Altera o valor programaticamente
        component.value = newValue;

        // Verifica se o evento foi disparado
        expect(valueChangedSpy).toHaveBeenCalledTimes(1);
        
        // Verifica se o evento contém o novo valor
        expect(valueChangedSpy).toHaveBeenCalledWith(expect.objectContaining({
            detail: { value: newValue }
        }));

        // Verifica se o valor foi alterado no input
        expect(input.value).toBe(newValue);
    });

    it('deve disparar valueChanged quando o usuário digitar no input', () => {
        const input = component.querySelector('input');
        const newValue = 'Bob Doe';

        // Cria um espião para o evento valueChanged
        const valueChangedSpy = jest.fn();
        component.addEventListener('valueChanged', valueChangedSpy);

        // Simula uma digitação no input
        input.value = newValue;
        input.dispatchEvent(new Event('input')); // Dispara o evento de input

        // Verifica se o evento foi disparado
        expect(valueChangedSpy).toHaveBeenCalledTimes(1);
        
        // Verifica se o evento contém o novo valor
        expect(valueChangedSpy).toHaveBeenCalledWith(expect.objectContaining({
            detail: { value: newValue }
        }));

        // Verifica se o valor foi alterado no input
        expect(input.value).toBe(newValue);
    });
});
