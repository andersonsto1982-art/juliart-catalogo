// Default Database structure for Gráfica Juliart
const defaultServices = [
    { id: 1, name: "Cópias / Xerox (P&B / Colorida)", category: "Impressões & Cópias", price: "P&B: R$ 0,50 | Color: R$ 1,50", desc: "Cópias nítidas em alta velocidade." },
    { id: 2, name: "Currículo (Edição ou Criação)", category: "Impressões & Cópias", price: "R$ 15,00", desc: "Formatação profissional voltada para o mercado." },
    { id: 3, name: "Cópias de CDs & DVDs", category: "Impressões & Cópias", price: "R$ 10,00", desc: "Gravação e backup de mídias." },
    { id: 4, name: "Conversão de Documentos para PDF", category: "Impressões & Cópias", price: "R$ 3,00", desc: "Digitalização e conversão rápida." },
    { id: 5, name: "Impressões de Faturas e Boletos", category: "Impressões & Cópias", price: "R$ 2,00", desc: "Impressão imediata de contas e boletos." },
    { id: 6, name: "Impressão de Fotos com Qualidade Profissional", category: "Fotografia & Restauração", price: "A partir de R$ 5,00", desc: "Papel fotográfico de alta durabilidade." },
    { id: 7, name: "Restauração de Fotos", category: "Fotografia & Restauração", price: "A partir de R$ 25,00", desc: "Recuperação de fotos antigas, rasgadas ou manchadas." },
    { id: 8, name: "Impressão de Fotos Tipo Polaroid", category: "Fotografia & Restauração", price: "R$ 3,50 un. / Kit com 10 por R$ 30", desc: "Estilo retrô ideal para recordações." },
    { id: 9, name: "Canecas Personalizadas", category: "Brindes & Personalizados", price: "R$ 35,00", desc: "Sublimação de alta qualidade em cerâmica ou polímero." },
    { id: 10, name: "Camisas Personalizadas", category: "Brindes & Personalizados", price: "A partir de R$ 45,00", desc: "Estampas exclusivas para eventos ou uso diário." },
    { id: 11, name: "Personalizados para Aniversários e Eventos", category: "Brindes & Personalizados", price: "Sob Consulta", desc: "Topos de bolo, lembrancinhas, tags e adesivos temáticos." },
    { id: 12, name: "Criação de Menus (Físico ou Digital)", category: "Design & Web", price: "A partir de R$ 50,00", desc: "Cardápios interativos para WhatsApp ou impressos." },
    { id: 13, name: "Criação de Logomarca (Logo)", category: "Design & Web", price: "A partir de R$ 120,00", desc: "Identidade visual profissional para sua marca." },
    { id: 14, name: "Identidade Digital Completa", category: "Design & Web", price: "Sob Consulta", desc: "Paleta de cores, tipografia e artes para redes sociais." },
    { id: 15, name: "Criação de Sites (Comercial, Blogs, etc.)", category: "Design & Web", price: "Sob Consulta", desc: "Websites modernos, responsivos e otimizados." }
];

// Initialize LocalStorage Database if empty
function getDatabase() {
    const data = localStorage.getItem('grafica_juliart_db');
    if (!data) {
        localStorage.setItem('grafica_juliart_db', JSON.stringify(defaultServices));
        return defaultServices;
    }
    return JSON.parse(data);
}

function saveDatabase(data) {
    localStorage.setItem('grafica_juliart_db', JSON.stringify(data));
}

// Render Cards
function renderServices(filter = '', category = '') {
    const services = getDatabase();
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = services.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(filter.toLowerCase()) || 
                              s.desc.toLowerCase().includes(filter.toLowerCase());
        const matchesCategory = category === '' || s.category === category;
        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5 text-muted"><h5>Nenhum serviço encontrado.</h5></div>`;
        return;
    }

    // Identifica se estamos na página admin ou index para mostrar os botões de ação
    const isAdminPage = window.location.pathname.includes('admin.html');

    filtered.forEach(service => {
        let actionButtons = '';
        if (isAdminPage) {
            actionButtons = `
                <div>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditModal(${service.id})" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteService(${service.id})" title="Excluir"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        }

        grid.innerHTML += `
            <div class="col-md-4 mb-3">
                <div class="card card-service h-100 shadow-sm">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-secondary badge-category">${service.category}</span>
                            ${actionButtons}
                        </div>
                        <h5 class="card-title text-dark fw-bold">${service.name}</h5>
                        <p class="card-text text-muted small flex-grow-1">${service.desc || 'Sem descrição adicional.'}</p>
                        <div class="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                            <span class="text-success fw-bold fs-5">${service.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// CRUD Actions
function openAddModal() {
    document.getElementById('modalTitle').innerText = 'Adicionar Novo Serviço';
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceForm').reset();
}

function openEditModal(id) {
    const services = getDatabase();
    const service = services.find(s => s.id === Number(id));
    if (!service) return;

    document.getElementById('modalTitle').innerText = 'Editar Serviço';
    document.getElementById('serviceId').value = service.id;
    document.getElementById('serviceName').value = service.name;
    document.getElementById('serviceCategory').value = service.category;
    document.getElementById('servicePrice').value = service.price;
    document.getElementById('serviceDesc').value = service.desc;

    const modalElement = document.getElementById('serviceModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

function saveService() {
    const id = document.getElementById('serviceId').value;
    const name = document.getElementById('serviceName').value;
    const category = document.getElementById('serviceCategory').value;
    const price = document.getElementById('servicePrice').value;
    const desc = document.getElementById('serviceDesc').value;

    if (!name || !price) {
        alert('Preencha os campos obrigatórios (Nome e Preço).');
        return;
    }

    let services = getDatabase();

    if (id) {
        // Update
        services = services.map(s => s.id == id ? { id: Number(id), name, category, price, desc } : s);
    } else {
        // Create
        const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
        services.push({ id: newId, name, category, price, desc });
    }

    saveDatabase(services);
    
    const modalElement = document.getElementById('serviceModal');
    if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
    }

    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    renderServices(searchInput ? searchInput.value : '', categoryFilter ? categoryFilter.value : '');
}

function deleteService(id) {
    if (confirm('Deseja realmente excluir este serviço do catálogo?')) {
        let services = getDatabase();
        services = services.filter(s => s.id !== Number(id));
        saveDatabase(services);
        
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        renderServices(searchInput ? searchInput.value : '', categoryFilter ? categoryFilter.value : '');
    }
}

// Generate WhatsApp Formatted Menu
function generateWhatsAppMenu() {
    const services = getDatabase();
    let text = "🎨 *GRÁFICA JULIART — MENU DE SERVIÇOS*\n";
    text += "_Sua solução completa em impressão, design e desenvolvimento web._\n\n";

    const categories = [...new Set(services.map(s => s.category))];

    categories.forEach(cat => {
        text += `📂 *${cat.toUpperCase()}*\n`;
        const catServices = services.filter(s => s.category === cat);
        catServices.forEach(s => {
            text += `▪️ ${s.name} — *${s.price}*\n`;
            if (s.desc) text += `   _${s.desc}_\n`;
        });
        text += "\n";
    });

    text += "📍 *Atendimento em Olinda (PE) e região*\n";
    text += "(Entregas em Sapucaia de Dentro, Sapucaia de Fora, Aguazinha e Xambá).\n\n";
    text += "📲 Faça já o seu orçamento conosco!";

    const outputElement = document.getElementById('whatsappOutput');
    if (outputElement) {
        outputElement.value = text;
        const modalElement = document.getElementById('whatsappModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }
}

function copyWhatsAppText() {
    const textarea = document.getElementById('whatsappOutput');
    if (!textarea) return;
    textarea.select();
    navigator.clipboard.writeText(textarea.value).then(() => {
        alert('Menu copiado para a área de transferência com sucesso!');
    });
}

// Event Listeners for Search & Filter
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const categoryFilter = document.getElementById('categoryFilter');
        renderServices(e.target.value, categoryFilter ? categoryFilter.value : '');
    });
}

const categoryFilter = document.getElementById('categoryFilter');
if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
        const searchInput = document.getElementById('searchInput');
        renderServices(searchInput ? searchInput.value : '', e.target.value);
    });
}

// Initial Load
renderServices();