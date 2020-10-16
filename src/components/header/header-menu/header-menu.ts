import { Component, OnInit } from '@angular/core';
import { Menu } from '../../../interfaces/menu';

declare var $: any;
declare var jQuery: any;

@Component({
    selector: 'header-menu',
    templateUrl: './header-menu.html',
    styleUrls: ['./header-menu.scss']
})
export class MenuComponent implements OnInit {

    public menuItems: Array<Menu> = [];

    ngOnInit() {
        this.menuItems = [
            {
                name: 'Home',
                url: '/'
            },
            {
                name: 'Empresa',
                url: '',
                submenus: [
                    { name: 'Quem Somos', url: '/quem-somos' },
                    // { name: 'Nossos Serviços', url: '/nossos-servicos' },
                    { name: 'Trabalhe Conosco', url: '/trabalhe-conosco' },
                    { name: 'Parceiros', url: '/parceiros' },
                ]
            },
            {
                name: 'Imóveis',
                url: '/buscar',
                submenus: [
                    { name: 'Venda', url: '/buscar', queryParams: { 'cursor': '', 'availability': 'buy' } },
                    { name: 'Locação', url: '/buscar', queryParams: { 'cursor': '', 'availability': 'rent' } },
                    { name: 'Lançamento', url: '/buscar', queryParams: { 'cursor': '', 'stage': 'launch' } },
                    { name: 'Temporada', url: '/buscar', queryParams: { 'cursor': '', 'availability': 'vacation_rental' } },
                    { name: 'Condomínios', url: '/buscar', queryParams: {
                        'property_type': [
                            'Apartamento', 'Apartamento Duplex/Cobertura',
                            'Apartamento Cobertura Linear', 'Apartamento Duplex'
                        ]
                    } },
                ]
            },
            {
                name: 'Serviços',
                url: '',
                submenus: [
                    { name: 'Financiamento', url: '/financiamento' },
                    { name: 'Documentação', url: '/documentacao' },
                    { name: 'Peça seu imóvel', url: '/peca-seu-imovel' },
                    { name: 'Anuncie seu imóvel', url: '/cadastre-seu-imovel' },
                    // { name: 'Área do cliente', url: '/' },
                ]
            },
            {
                name: 'Contato',
                url: '/contato'
            }
        ];
    }

    onMenuItemClicked(menuItem: Menu) {
        if (menuItem.name === 'Área do cliente') {
            window.open('', '_blank');
        } else if (menuItem.url) {
            this.showMobileMenu();
        }
        if (menuItem.url === '/buscar') {
            localStorage.removeItem('search_params');
        }
    }

    showMobileMenu() {
        $('.menu-toggle[aria-controls="main-menu"]').toggleClass('toggled');
        $('.main-navigation').toggleClass('toggled');
    }

    submenuToggle(menuId: string) {
        $('#' + menuId + ' .mobile-sublink').toggleClass('active');
        $('#' + menuId + ' .sub-menu').toggleClass('active');
    }

}
