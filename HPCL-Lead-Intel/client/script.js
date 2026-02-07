// HPCL B2B Lead Intelligence App - Logic Script

// ==================== DATA STORE (Hardcoded for Prototype) ====================
const leadsData = [
    {
        id: 1,
        company: "Apex Chemicals Pvt Ltd",
        location: "Navi Mumbai, MH",
        industry: "Chemical Manufacturing",
        product: "Furnace Oil (FO)",
        urgency: "High",
        confidence: 94,
        freshness: "Fresh",
        source: "Tender Scraper",
        sourceTimestamp: "2 hrs ago",
        turnover: "₹450 Cr",
        signal: "New boiler expansion tender detected (2000 KL capacity)",
        why: [
            "Recently floated tender for boiler fuel supply",
            "Expanding production capacity by 30% in Q2",
            "Historically uses FO for similar equipment"
        ],
        products: [
            { name: "Furnace Oil (FO)", fit: 98 },
            { name: "LSHS", fit: 75 }
        ],
        nextAction: "Schedule site visit for boiler inspection",
        status: "New"
    },
    {
        id: 2,
        company: "Coastal Logistics & Shipping",
        location: "JNPT Port Area",
        industry: "Logistics / Shipping",
        product: "Marine Bunker Fuel",
        urgency: "Medium",
        confidence: 82,
        freshness: "Warm",
        source: "News API",
        sourceTimestamp: "1 day ago",
        turnover: "₹1200 Cr",
        signal: "News: Added 3 new vessels to fleet for coastal transport",
        why: [
            "Fleet expansion news confirmed via maritime registry",
            "Vessels operate on IFO 380 (Bunker Fuel)",
            "Currently sourcing from competitor with expiring contract"
        ],
        products: [
            { name: "Marine Bunker Fuel", fit: 95 },
            { name: "Marine Lubricants", fit: 88 }
        ],
        nextAction: "Email introductory bulk fuel rates",
        status: "New"
    },
    {
        id: 3,
        company: "MahaInfra Road Projects",
        location: "Pune-Nashik Highway",
        industry: "Construction / Infrastructure",
        product: "Bitumen (VG-30)",
        urgency: "High",
        confidence: 89,
        freshness: "Fresh",
        source: "Govt Tender Portal",
        sourceTimestamp: "4 hrs ago",
        turnover: "₹850 Cr",
        signal: "Won NHAI contract for 45km highway widening",
        why: [
            "Awarded major highway project yesterday",
            "Project timeline requires immediate material mobilization",
            "Site location is 40km from our nearest depot"
        ],
        products: [
            { name: "Bitumen VG-30", fit: 92 },
            { name: "HSD (Bulk)", fit: 85 }
        ],
        nextAction: "Call procurement head immediately",
        status: "New"
    },
    {
        id: 4,
        company: "GreenValley Textiles",
        location: "Bhiwandi, MH",
        industry: "Textiles",
        product: "LDO (Light Diesel Oil)",
        urgency: "Low",
        confidence: 65,
        freshness: "Cold",
        source: "Website Crawler",
        sourceTimestamp: "3 days ago",
        turnover: "₹80 Cr",
        signal: "Website update mentions new dyeing unit",
        why: [
            "New unit likely requires thermic fluid heaters",
            "Competitor presence strong in this cluster",
            "Low urgent need based on project timeline"
        ],
        products: [
            { name: "LDO", fit: 70 },
            { name: "Process Oils", fit: 60 }
        ],
        nextAction: "Send brochure and follow up in 1 week",
        status: "New"
    }
];

// ==================== STATE MANAGEMENT ====================
let currentLeadId = null;
let isLowBandwidth = false;

// ==================== NAVIGATION ====================
function navigateTo(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(el => {
        el.classList.remove('active');
        // Reset scroll
        el.scrollTop = 0; 
    });
    
    // Show target screen
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    }
    
    // Specific logic for screens
    if (screenId === 'screen-leads') {
        renderLeads();
    }
}

// ==================== RENDERING ====================
function renderLeads() {
    const container = document.getElementById('leads-container');
    container.innerHTML = ''; // Clear current

    leadsData.forEach(lead => {
        // Skip rejected/converted for this list view in prototype
        if (lead.status !== 'New') return;

        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer';
        card.onclick = () => openDossier(lead.id);

        // Urgency Color Logic
        let urgencyColor = 'bg-gray-100 text-gray-600';
        if (lead.urgency === 'High') urgencyColor = 'bg-red-50 text-red-600 border border-red-100';
        if (lead.urgency === 'Medium') urgencyColor = 'bg-yellow-50 text-yellow-700 border border-yellow-100';

        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-bold uppercase tracking-wider ${urgencyColor} px-2 py-0.5 rounded-full">
                    ${lead.urgency} Urgency
                </span>
                <span class="text-xs font-semibold text-green-600 flex items-center gap-1">
                    ${lead.confidence}% Match <i class="ph-fill ph-check-circle"></i>
                </span>
            </div>
            <h3 class="font-bold text-gray-800 text-lg leading-tight mb-1">${lead.company}</h3>
            <p class="text-sm text-gray-500 mb-3 flex items-center gap-1">
                <i class="ph ph-factory"></i> ${lead.industry}
            </p>
            <div class="bg-blue-50 p-2 rounded-lg flex items-center gap-2">
                <div class="bg-blue-100 p-1.5 rounded-md text-hpcl-blue">
                    <i class="ph-fill ph-drop"></i>
                </div>
                <div>
                    <p class="text-[10px] text-gray-500 uppercase font-semibold">Recommended</p>
                    <p class="text-sm font-bold text-hpcl-blue leading-none">${lead.product}</p>
                </div>
            </div>
            <div class="mt-3 flex justify-between items-center border-t border-gray-50 pt-2">
                 <p class="text-xs text-gray-400">Signal: ${lead.sourceTimestamp}</p>
                 <i class="ph-bold ph-caret-right text-gray-300"></i>
            </div>
        `;
        container.appendChild(card);
    });
}

function openDossier(id) {
    currentLeadId = id;
    const lead = leadsData.find(l => l.id === id);
    if (!lead) return;

    const container = document.getElementById('dossier-content');
    
    // HTML Construction for Dossier
    container.innerHTML = `
        <!-- Banner / Overview -->
        <div class="p-6 bg-white border-b border-gray-100">
            <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 bg-blue-50 text-hpcl-blue text-xs font-bold rounded uppercase">${lead.freshness} Lead</span>
                <span class="text-xs text-gray-400">• ${lead.location}</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-1">${lead.company}</h1>
            <p class="text-gray-500 text-sm mb-4">${lead.industry} • Turnover ~${lead.turnover}</p>
            
            <!-- AI Confidence Badge -->
            <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                <div class="relative z-10 flex justify-between items-center mb-2">
                    <span class="text-xs font-semibold uppercase text-gray-300 tracking-wider flex items-center gap-1">
                        <i class="ph-fill ph-sparkle"></i> HPCL AI Score
                    </span>
                    <span class="text-2xl font-bold">${lead.confidence}%</span>
                </div>
                <div class="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div class="h-full confidence-bar-bg" style="width: ${lead.confidence}%"></div>
                </div>
                <p class="text-xs text-gray-300 mt-2">Very high likelihood of conversion based on signal strength.</p>
                
                <!-- Background decor -->
                <i class="ph ph-robot absolute -bottom-4 -right-2 text-6xl opacity-10 rotate-12"></i>
            </div>
        </div>

        <!-- "Why This Lead?" (Explainability) -->
        <div class="p-6 border-b border-gray-100">
            <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <i class="ph-fill ph-lightbulb text-yellow-500"></i> Why this lead?
            </h3>
            <ul class="space-y-3">
                ${lead.why.map(reason => `
                    <li class="flex gap-3 text-sm text-gray-600">
                        <i class="ph-bold ph-check text-green-500 mt-0.5"></i>
                        <span>${reason}</span>
                    </li>
                `).join('')}
            </ul>
        </div>

        <!-- Product Fit -->
        <div class="p-6 border-b border-gray-100 bg-gray-50">
            <h3 class="font-bold text-gray-800 mb-3">Recommended Products</h3>
            <div class="space-y-3">
                ${lead.products.map(prod => `
                    <div class="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center shadow-sm">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-hpcl-red">
                                <i class="ph-fill ph-drop text-xl"></i>
                            </div>
                            <div>
                                <p class="font-bold text-gray-800">${prod.name}</p>
                                <p class="text-xs text-gray-500">Fit Score: ${prod.fit}/100</p>
                            </div>
                        </div>
                        <i class="ph-bold ph-plus-circle text-gray-300 text-xl"></i>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Next Best Action -->
        <div class="p-6 mb-20">
            <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p class="text-xs font-bold text-hpcl-blue uppercase mb-1">Suggested Next Action</p>
                <p class="text-gray-800 font-medium flex gap-2 items-start">
                    <i class="ph-fill ph-arrow-fat-lines-right mt-1"></i>
                    ${lead.nextAction}
                </p>
            </div>
            
            <div class="mt-6">
                <p class="text-xs font-bold text-gray-400 uppercase mb-2">Source Signal</p>
                <div class="flex gap-2 text-xs text-gray-500 bg-gray-100 p-2 rounded inline-block">
                    <i class="ph-bold ph-link"></i> ${lead.source} • ${lead.sourceTimestamp}
                </div>
            </div>
        </div>
    `;

    navigateTo('screen-dossier');
}

// ==================== ACTIONS ====================
function toggleStatusModal() {
    const modal = document.getElementById('status-modal');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function updateLeadStatus(newStatus) {
    if (!currentLeadId) return;
    
    // Update local data
    const lead = leadsData.find(l => l.id === currentLeadId);
    if (lead) {
        lead.status = newStatus;
        
        // Show feedback toast (Simulated)
        showToast(`Lead marked as ${newStatus}`);
        
        // Close modal
        toggleStatusModal();
        
        // Return to list after short delay
        setTimeout(() => {
            navigateTo('screen-leads');
        }, 1000);
    }
}

function handleAction(type) {
    if (!currentLeadId) return;
    const lead = leadsData.find(l => l.id === currentLeadId);
    
    if (type === 'call') {
        showToast(`Calling ${lead.company}...`);
        // In real app: window.location.href = 'tel:...'
    } else if (type === 'email') {
        showToast(`Opening email draft for ${lead.company}...`);
        // In real app: window.location.href = 'mailto:...'
    }
}

// Low Bandwidth Toggle
function toggleBandwidthMode() {
    isLowBandwidth = !isLowBandwidth;
    document.body.classList.toggle('low-bandwidth');
    showToast(`Low Bandwidth Mode: ${isLowBandwidth ? 'ON' : 'OFF'}`);
    
    // In a real app, we would toggle image visibility classes here
}

// Simple Toast Notification
function showToast(message) {
    // Check if toast exists, else create
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-xl text-sm font-semibold z-50 transition-opacity opacity-0 pointer-events-none';
        document.body.appendChild(toast);
    }
    
    toast.innerText = message;
    toast.classList.remove('opacity-0');
    
    setTimeout(() => {
        toast.classList.add('opacity-0');
    }, 2500);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Start on dashboard
    navigateTo('screen-dashboard');
});