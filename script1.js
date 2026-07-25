// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 8s linear infinite',
            }
        }
    }
};

// Initialize Lucide Icons
lucide.createIcons();

// Utility to re-trigger animations
function retriggerAnimation(elementId) {
    const el = document.getElementById(elementId);
    if(el) {
        el.classList.remove('animate-fade-in');
        void el.offsetWidth; // force reflow
        el.classList.add('animate-fade-in');
    }
}

// ------------------ GLOBAL STATE ------------------
let isAdmin = false;
const ADMIN_PIN = "7319";
let activeMediaCategory = 'img';
let pendingMediaAction = null; 

// ------------------ HARDCODED EMBEDDED DATA ------------------
let mediaData = [
    { id: 'm1', type: 'img', title: 'Plastic pollution', src: '1.jpg', locked: true },
    { id: 'm15', type: 'img', title: 'Plastic pollution', src: '11.jpg', locked: true },
    { id: 'm16', type: 'img', title: 'Plastic pollution', src: '12.jpg', locked: true },
    { id: 'm17', type: 'img', title: 'Plastic pollution', src: '13.jpg', locked: true },
    { id: 'm18', type: 'img', title: 'Plastic pollution', src: '14.jpg', locked: true },
    { id: 'm2', type: 'img', title: 'Plastic pollution', src: '9.jpg', locked: true },
    { id: 'm3', type: 'img', title: 'Plastic pollution ', src: '2.jpg', locked: true },
    { id: 'm5', type: 'img', title: 'Plastic pollution ', src: '10.jpg', locked: true },
    { id: 'm7', type: 'img', title: 'Plastic pollution', src: '3.jpg', locked: true },
    { id: 'm8', type: 'img', title: 'Plastic pollution ', src: '4.jpg', locked: true },
    { id: 'm10', type: 'img', title: 'Plastic pollution ', src: '5.jpg', locked: true },
    { id: 'm11', type: 'img', title: 'Plastic pollution ', src: '6.jpg', locked: true },
    { id: 'm12', type: 'img', title: 'Plastic pollution ', src: '7.jpg', locked: true },
    { id: 'm13', type: 'img', title: 'Plastic pollution ', src: '8.jpg', locked: true },
    { id: 'm9', type: 'oth', title: 'Format ', src: 'NOC Format.docx', locked: true },
    { id: 'm14', type: 'vid', title: 'Plastic pollution ', src: '2.mp4', locked: true },
    { id: 'm6', type: 'oth', title: 'Plastic pollution', src: 'Previous.html', locked: true },
    { id: 'm20', type: 'oth', title: 'Vos ', src: 'Vos.PDF', locked: true },
    { id: 'm21', type: 'oth', title: 'NET', src: 'Idea.PDF', locked: true },
    { id: 'm19', type: 'oth', title: 'NOC', src: 'NOC.PDF', locked: true }
  
];

let teamData = [
    { id: 1, name: "Muhammed", institution: "TTVHSS", age: 17, role: "Founder,all in all" },
    { id: 2, name: "Sinan", institution: "TTVHSS", age: 14, role: "Founder,all in all" }
];

let relayEmail = "patron@hotmail.com";

// ------------------ UI NAVIGATION ------------------
function toggleCurtain(slideUp) {
    const curtain = document.getElementById('homeCurtain');
    const nav = document.getElementById('appNavBar');
    const header = document.getElementById('appHeader');
    const viewport = document.getElementById('coreViewport');

    if(slideUp) {
        curtain.classList.add('curtain-up');
        setTimeout(() => {
            nav.classList.remove('hidden');
            header.classList.remove('hidden');
            viewport.classList.remove('hidden');
            
            nav.classList.add('animate-fade-in');
            header.classList.add('animate-fade-in');
            
            switchMainView('report');
        }, 400); 
    } else {
        curtain.classList.remove('curtain-up');
        nav.classList.add('hidden');
        header.classList.add('hidden');
        viewport.classList.add('hidden');
    }
}

function switchMainView(viewId) {
    ['report', 'media', 'about'].forEach(v => {
        const viewContainer = document.getElementById(`view-${v}`);
        const btn = document.getElementById(`nav-${v}`);
        
        if(v === viewId) {
            viewContainer.classList.remove('hidden');
            retriggerAnimation(`view-${v}`);
            
            btn.classList.add('text-green-600', 'scale-110');
            btn.classList.remove('text-gray-500');
            btn.children[0].classList.add('drop-shadow-sm');
        } else {
            viewContainer.classList.add('hidden');
            btn.classList.remove('text-green-600', 'scale-110');
            btn.classList.add('text-gray-500');
            btn.children[0].classList.remove('drop-shadow-sm');
        }
    });
    document.getElementById('coreViewport').scrollTop = 0;
    
    if(viewId === 'media') renderMediaGrid();
    if(viewId === 'about') renderTeamData();
}

// ------------------ REPORT LOGIC ------------------
function switchReportTab(tabId) {
    ['overview', 'explanations', 'milestones'].forEach(t => {
        const tabEl = document.getElementById(`tab-${t}`);
        const btn = document.getElementById(`btn-report-${t}`);
        
        if(t === tabId) {
            tabEl.classList.remove('hidden');
            retriggerAnimation(`tab-${t}`);
            
            btn.className = "bg-white text-green-600 shadow-sm border border-gray-200/50 text-[11px] font-mono py-2 rounded-lg font-bold uppercase transition-all duration-300 transform scale-100";
        } else {
            tabEl.classList.add('hidden');
            btn.className = "text-gray-500 text-[11px] font-mono py-2 rounded-lg font-bold uppercase hover:text-green-600 hover:bg-white/50 transition-all duration-300";
        }
    });
}

function toggleSlab(el) {
    const content = el.querySelector('.slab-content');
    const indicator = el.querySelector('.slab-indicator');
    content.classList.toggle('expanded');
    if(content.classList.contains('expanded')) {
        indicator.innerText = "Tap to collapse ↑";
        indicator.classList.replace('bg-green-50/50', 'bg-gray-50/50');
    } else {
        indicator.innerText = "Tap to expand ↓";
        indicator.classList.replace('bg-gray-50/50', 'bg-green-50/50');
    }
}

// ------------------ MEDIA LOGIC ------------------
function switchMediaFilter(cat) {
    activeMediaCategory = cat;
    ['img', 'vid', 'oth'].forEach(t => {
        const btn = document.getElementById(`flt-media-${t}`);
        if(t === cat) {
            btn.className = "bg-white text-green-600 shadow-sm border border-gray-200/50 text-[11px] font-mono py-2 rounded-lg font-bold uppercase transition-all transform scale-100";
        } else {
            btn.className = "text-gray-500 text-[11px] font-mono py-2 rounded-lg font-bold uppercase hover:text-green-600 hover:bg-white/50 transition-all";
        }
    });
    renderMediaGrid();
}

function renderMediaGrid() {
    const grid = document.getElementById('mediaGrid');
    grid.innerHTML = '';
    
    const filtered = mediaData.filter(m => m.type === activeMediaCategory);
    
    if(filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-2 text-center py-12 font-mono text-xs text-gray-400 uppercase tracking-widest border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 backdrop-blur">No Database Records Found</div>`;
        return;
    }

    filtered.forEach(asset => {
        const card = document.createElement('div');
        card.className = "relative bg-gray-100 rounded-xl overflow-hidden aspect-square border border-gray-200/80 shadow-sm group select-none flex flex-col justify-end transform hover:-translate-y-1 hover:shadow-md transition-all duration-300";
        
        let visualContent = '';
        let overlayControls = '';

        if(asset.locked) {
            visualContent = `
                <div class="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-red-500 z-10 transition-colors group-hover:bg-red-50/95">
                    <i data-lucide="lock" class="w-7 h-7 mb-2 opacity-80"></i>
                    <span class="text-[9px] font-mono tracking-widest uppercase opacity-80">Admin Lock</span>
                </div>`;
            
            overlayControls = `
                <div class="absolute bottom-2 right-2 z-20">
                    <button onclick="handleMediaAction('${asset.id}', 'unlock')" class="bg-white/80 backdrop-blur border border-red-200 text-red-500 p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all shadow-sm active:scale-95 hover:scale-105"><i data-lucide="unlock" class="w-4 h-4"></i></button>
                </div>`;
        } else {
            if(asset.type === 'vid') {
                visualContent = `<video src="${asset.src}" class="absolute inset-0 w-full h-full object-cover" muted loop autoplay></video>`;
            } else if(asset.type === 'img') {
                visualContent = `<img src="${asset.src}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">`;
            } else {
                visualContent = `<div class="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 group-hover:scale-110 transition-transform duration-500"><i data-lucide="file-box" class="w-10 h-10"></i></div>`;
            }

            const openTrigger = `onclick="openLightbox('${asset.src}', '${asset.type}', '${asset.title.replace(/'/g,"\\'")}')"`;

            overlayControls = `
                <div class="absolute inset-0 z-10 cursor-pointer" ${openTrigger}></div>
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-80 pointer-events-none z-10"></div>
                
                <div class="absolute top-2 right-2 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button onclick="handleMediaAction('${asset.id}', 'lock')" class="bg-white/90 border border-gray-200 text-gray-600 hover:text-red-500 p-1.5 rounded shadow-sm backdrop-blur-sm hover:scale-110 transition-all"><i data-lucide="lock" class="w-3.5 h-3.5"></i></button>
                    <button onclick="handleMediaAction('${asset.id}', 'delete')" class="bg-white/90 border border-gray-200 text-gray-600 hover:text-red-500 p-1.5 rounded shadow-sm backdrop-blur-sm hover:scale-110 transition-all"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                    <button ${openTrigger} class="bg-white/90 border border-gray-200 text-gray-600 hover:text-green-600 p-1.5 rounded shadow-sm backdrop-blur-sm hover:scale-110 transition-all"><i data-lucide="download" class="w-3.5 h-3.5"></i></button>
                </div>
            `;
        }

        card.innerHTML = `
            ${visualContent}
            ${overlayControls}
            <div class="relative z-10 p-2.5 pointer-events-none w-full transform transition-transform group-hover:translate-y-[-2px]">
                <p class="text-[9px] font-mono text-white truncate w-[85%] drop-shadow-md tracking-wider">${asset.title}</p>
            </div>
        `;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

function handleMediaAction(id, action) {
    if(!isAdmin) {
        pendingMediaAction = { id, action };
        triggerAdminLogin();
        return;
    }
    executeMediaAction(id, action);
}

function executeMediaAction(id, action) {
    const index = mediaData.findIndex(m => m.id === id);
    if(index === -1) return;

    if(action === 'lock') {
        mediaData[index].locked = true;
    } else if(action === 'unlock') {
        mediaData[index].locked = false;
    } else if(action === 'delete') {
        if(confirm("Confirm asset purge from system?")) {
            mediaData.splice(index, 1);
        }
    }
    renderMediaGrid();
}

function openLightbox(src, type, title) {
    const lb = document.getElementById('lightbox');
    const content = document.getElementById('lightboxContent');
    const titleEl = document.getElementById('lightboxTitle');
    const dlBtn = document.getElementById('lightboxDownloadBtn');
    
    lb.classList.remove('hidden');
    lb.classList.add('flex');
    setTimeout(() => {
        lb.classList.remove('opacity-0');
    }, 10);
    
    titleEl.innerText = title;
    dlBtn.href = src;

    if(type === 'vid') {
        content.innerHTML = `<video src="${src}" class="max-w-full max-h-full rounded-xl shadow-2xl bg-black border border-gray-800" controls autoplay></video>`;
    } else if (type === 'img') {
        content.innerHTML = `<img src="${src}" class="max-w-full max-h-full rounded-xl shadow-2xl object-contain border border-white/10">`;
    } else {
        content.innerHTML = `<div class="bg-white border border-gray-200 p-12 rounded-xl text-center shadow-2xl"><i data-lucide="file-box" class="w-16 h-16 text-green-600 mx-auto mb-4 animate-bounce"></i><p class="text-xs font-mono text-gray-500 uppercase tracking-widest">Secure Document Package</p></div>`;
    }
    lucide.createIcons();
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.add('hidden');
    document.getElementById('lightboxContent').innerHTML = '';
}

// ------------------ ABOUT/TEAM LOGIC ------------------
function renderTeamData() {
    const container = document.getElementById('teamContainer');
    container.innerHTML = '';

    teamData.forEach(member => {
        const card = document.createElement('div');
        card.className = "info-card p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1";
        card.innerHTML = `
            <div class="flex-1 min-w-0 pr-2 relative z-10">
                <div class="flex items-center gap-2 mb-1">
                    <h4 class="text-xs font-bold text-gray-800 truncate">${member.name}</h4>
                    <span class="text-[9px] font-mono bg-green-100/50 border border-green-200/80 text-green-700 px-1.5 py-0.5 rounded-sm">Age ${member.age}</span>
                </div>
                <p class="text-[10px] font-mono text-green-600 tracking-wider uppercase font-bold truncate mb-0.5">${member.role}</p>
                <p class="text-[9px] font-mono text-gray-500 truncate flex items-center gap-1"><i data-lucide="building" class="w-3 h-3 text-gray-400"></i>${member.institution}</p>
            </div>
            ${isAdmin ? `
                <div class="flex flex-col space-y-1.5 shrink-0 border-l border-gray-200/80 pl-2.5 relative z-10">
                    <button onclick="editTeamMember(${member.id})" class="text-gray-400 hover:text-green-600 bg-gray-50/50 p-1.5 rounded-lg border border-gray-200/80 hover:bg-white hover:shadow-sm transition-all"><i data-lucide="edit" class="w-3.5 h-3.5"></i></button>
                    <button onclick="deleteTeamMember(${member.id})" class="text-gray-400 hover:text-red-500 bg-gray-50/50 p-1.5 rounded-lg border border-gray-200/80 hover:bg-white hover:shadow-sm transition-all"><i data-lucide="trash" class="w-3.5 h-3.5"></i></button>
                </div>
            ` : ''}
        `;
        container.appendChild(card);
    });
    lucide.createIcons();
}

function addTeamMember() {
    if(!isAdmin) return;
    const name = prompt("Enter Member Name:");
    if(!name) return;
    const age = prompt("Enter Age Metric:");
    const role = prompt("Enter Role Title:");
    const institution = prompt("Enter Academic/Professional Institution:");
    
    teamData.push({ id: Date.now(), name, age, role, institution });
    renderTeamData();
}

function editTeamMember(id) {
    if(!isAdmin) return;
    const m = teamData.find(x => x.id === id);
    if(!m) return;
    const n = prompt("Edit Name:", m.name);
    if(n) { m.name = n; renderTeamData(); }
}

function deleteTeamMember(id) {
    if(!isAdmin) return;
    if(confirm("Remove this operational node?")) {
        teamData = teamData.filter(x => x.id !== id);
        renderTeamData();
    }
}

function changeRelayEmail() {
    if(!isAdmin) return;
    const e = prompt("Set new Admin routing email address:", relayEmail);
    if(e) {
        relayEmail = e;
        document.getElementById('targetEmailDisplay').value = relayEmail;
    }
}

function sendComms(e) {
    e.preventDefault();
    const msg = document.getElementById('commsMsg').value;
    const mailto = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(relayEmail)}&body=${encodeURIComponent(msg)}&su=Message for Patron`;
    window.open(mailto, '_blank');
    e.target.reset();
}

// ------------------ ADMIN SECURITY SYSTEM ------------------
function triggerAdminLogin() {
    if(isAdmin) {
        isAdmin = false;
        pendingMediaAction = null;
        updateAdminUI();
    } else {
        document.getElementById('securityModal').classList.remove('opacity-0', 'pointer-events-none');
        document.getElementById('securityBox').classList.remove('scale-95');
        document.getElementById('adminPinInput').focus();
    }
}

function closeSecurityModal() {
    document.getElementById('securityModal').classList.add('opacity-0', 'pointer-events-none');
    document.getElementById('securityBox').classList.add('scale-95');
    document.getElementById('adminPinInput').value = '';
    pendingMediaAction = null;
}

function verifyPin() {
    const input = document.getElementById('adminPinInput').value;
    if(input === ADMIN_PIN) {
        isAdmin = true;
        closeSecurityModal();
        updateAdminUI();
        
        if(pendingMediaAction) {
            executeMediaAction(pendingMediaAction.id, pendingMediaAction.action);
            pendingMediaAction = null;
        }
    } else {
        // Shake effect
        const box = document.getElementById('securityBox');
        box.classList.add('translate-x-1', 'border-red-500');
        setTimeout(() => box.classList.replace('translate-x-1', '-translate-x-1'), 100);
        setTimeout(() => box.classList.replace('-translate-x-1', 'translate-x-1'), 200);
        setTimeout(() => {
            box.classList.remove('translate-x-1', 'border-red-500');
            alert("ACCESS DENIED: Pattern Mismatch.");
            closeSecurityModal();
        }, 300);
    }
}

document.getElementById('adminPinInput').addEventListener('input', (e) => {
    if(e.target.value.length === 4) verifyPin();
});

function updateAdminUI() {
    const badgeText = document.getElementById('adminText');
    const badgeIndicator = document.getElementById('adminIndicator');
    const badgeOuter = document.getElementById('adminBadge');
    
    const addMemBtn = document.getElementById('addMemberBtn');
    const editRlyBtn = document.getElementById('editRelayBtn');

    if(isAdmin) {
        badgeText.innerText = "ADMIN ACTIVE";
        badgeIndicator.className = "w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)] animate-pulse";
        badgeOuter.className = "flex items-center space-x-1.5 bg-green-50/90 backdrop-blur border border-green-300 rounded-full px-3 py-1 text-[10px] font-mono tracking-wider text-green-700 cursor-pointer shadow-sm hover:shadow-md transition-all";
        
        addMemBtn.classList.remove('hidden');
        editRlyBtn.classList.remove('hidden');
    } else {
        badgeText.innerText = "USER";
        badgeIndicator.className = "w-1.5 h-1.5 rounded-full bg-gray-400 shadow-[0_0_5px_rgba(156,163,175,0.8)]";
        badgeOuter.className = "flex items-center space-x-1.5 bg-gray-50/80 backdrop-blur border border-gray-200 rounded-full px-3 py-1 text-[10px] font-mono tracking-wider text-gray-500 transition-all hover:bg-gray-100 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm";
        
        addMemBtn.classList.add('hidden');
        editRlyBtn.classList.add('hidden');
    }

    renderMediaGrid();
    renderTeamData();
}

