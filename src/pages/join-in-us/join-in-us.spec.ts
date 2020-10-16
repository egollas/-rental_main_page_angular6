import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../mocks/componentsMock';
import { JoinInUsForm } from './join-in-us';
import { FormsModule, NgForm } from '@angular/forms';

fdescribe('Partner Option', () => {
    let component: JoinInUsForm;
    let fixture: ComponentFixture<JoinInUsForm>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                JoinInUsForm,
                MockComponent(
                    {
                        selector: 'imobzi-breadcrumb',
                        inputs: ['pageTitle']
                    },
                ),
                MockComponent(
                    {
                        selector: 'lazy-loading-image'
                    }
                )
            ],
            imports: [FormsModule ],
            providers: [ ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JoinInUsForm);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

    it('submit form', () => {
        fixture.detectChanges();
        let form: NgForm = <NgForm>{
            valid: true,
            resetForm() {}
        };
        component.submit(form);
        expect(component.messageSend).toBe('A sua mensagem foi enviada com sucesso!');
        form = <NgForm> {
            valid: false
        };
        component.submit(form);
        expect(component.messageSend).toBe('Erro ao enviar a mensagem.');
    });
});
