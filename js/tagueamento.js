document.addEventListener('DOMContentLoaded', () => {
    const pageLoc = window.location.href;

    // --- EVENTS MENU ---
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

    // --- ANALISE PAGE (Montadoras Cards) ---
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

    // --- CONTACT FORM ---
    const form = document.querySelector('form.contato');
    
    if (form) {
        let formStarted = false;

        // Event: form_start 
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

        // Event: form_submit 
        form.addEventListener('submit', (event) => {
            
            event.preventDefault(); 

            const submitBtn = form.querySelector('button[type="submit"]');
            
            gtag('event', 'form_submit', {
                'page_location': pageLoc,
                'form_id': form.id || 'contato',
                'form_name': form.getAttribute('name'),
                'form_destination': form.getAttribute('action') || pageLoc,
                'form_submit_text': submitBtn ? submitBtn.innerText.trim() : 'enviar'
            });

            console.log("Evento form_submit disparado. Enviando dados...");

            // Waiting 500ms to garantee that 'collect' from GA4 'get out' before the page changes
            setTimeout(() => {
                form.submit(); 
            }, 500);
        });

        // Event: view_form_success 
        const successObserver = new MutationObserver(() => {
            const lightbox = document.querySelector('.lightbox');
            
            // Check if the element exists and visible
            if (lightbox && lightbox.innerText.toLowerCase().includes('obrigado')) {
                gtag('event', 'view_form_success', {
                    'page_location': pageLoc,
                    'form_id': form.id || 'contato',
                    'form_name': form.getAttribute('name') || 'contato'
                });
                
                console.log("Sucesso detectado: Evento view_form_success enviado.");
                successObserver.disconnect(); // Stop the observation to avaid double triggers
            }
        });

        // Beginning the observation on body to pick the lightbox
        successObserver.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true 
        });
    }
});