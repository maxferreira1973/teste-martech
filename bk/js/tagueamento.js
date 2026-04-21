// 1. INICIALIZAÇÃO DO GOOGLE ANALYTICS (Gtag.js)
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

const GA_ID = 'G-096NHNN8Q2';

// Carregamento dinâmico do script do GA4
(() => {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
})();

gtag('config', GA_ID, { 'send_page_view': true });

// 2. MONITORAMENTO DE EVENTOS (DOM Ready)
document.addEventListener('DOMContentLoaded', () => {
    const pageLoc = window.location.href;

    // --- EVENTOS DE MENU ---
    const menuContato = document.querySelector('.menu-lista-contato');
    if (menuContato) {
        menuContato.addEventListener('click', () => {
            gtag('event', 'click', { 
                'page_location': pageLoc, 
                'element_name': 'entre_em_contato', 
                'element_group': 'menu' 
            });
        });
    }

    const menuDownload = document.querySelector('.menu-lista-download');
    if (menuDownload) {
        menuDownload.addEventListener('click', () => {
            gtag('event', 'file_download', { 
                'page_location': pageLoc, 
                'element_name': 'download_pdf', 
                'element_group': 'menu' 
            });
        });
    }

    // --- PÁGINA ANÁLISE (Cards de Montadoras) ---
    document.querySelectorAll('.card-montadoras').forEach(card => {
        card.addEventListener('click', function() {
            const nome = this.getAttribute('data-name') ? this.getAttribute('data-name').toLowerCase() : 'desconhecido';
            gtag('event', 'view_card', {
                'page_location': pageLoc,
                'element_name': nome,
                'element_group': 'ver_mais'
            });
        });
    });

    // --- FORMULÁRIO DE CONTATO (Lógica Avançada) ---
    const form = document.querySelector('form.contato');
    
    if (form) {
        let formStarted = false;

        // Evento: form_start (dispara no primeiro caractere digitado)
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                if (!formStarted) {
                    gtag('event', 'form_start', {
                        'page_location': pageLoc,
                        'form_id': form.id || 'contato',
                        'form_name': form.getAttribute('name') || 'contato'
                    });
                    formStarted = true;
                }
            });
        });

        // Evento: form_submit (com trava de segurança para o Payload)
        form.addEventListener('submit', (event) => {
            // Impedimos o envio imediato para dar tempo ao Google Analytics
            event.preventDefault(); 

            const submitBtn = form.querySelector('button[type="submit"]');
            
            gtag('event', 'form_submit', {
                'page_location': pageLoc,
                'form_id': form.id || 'contato',
                'form_name': form.getAttribute('name') || 'contato',
                'form_destination': form.getAttribute('action') || pageLoc,
                'form_submit_text': submitBtn ? submitBtn.innerText.trim() : 'enviar'
            });

            console.log("Evento form_submit disparado. Enviando dados...");

            // Aguarda 500ms para garantir que o 'collect' do GA4 saia antes da página mudar
            setTimeout(() => {
                form.submit(); 
            }, 500);
        });

        // Evento: view_form_success (Observador de mudanças no DOM)
        const successObserver = new MutationObserver(() => {
            const lightbox = document.querySelector('.lightbox');
            
            // Verifica se o elemento existe e se está visível (via texto ou classe)
            if (lightbox && lightbox.innerText.toLowerCase().includes('obrigado')) {
                gtag('event', 'view_form_success', {
                    'page_location': pageLoc,
                    'form_id': form.id || 'contato',
                    'form_name': form.getAttribute('name') || 'contato'
                });
                
                console.log("Sucesso detectado: Evento view_form_success enviado.");
                successObserver.disconnect(); // Para de observar para evitar disparos duplos
            }
        });

        // Inicia a observação no body para capturar o aparecimento do lightbox
        successObserver.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true 
        });
    }
});