const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

// Ambient starfield reacts subtly to the pointer.
const canvas=$('#stars'),ctx=canvas.getContext('2d');let stars=[],mx=0,my=0;
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);stars=Array.from({length:Math.min(170,Math.floor(innerWidth/7))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.2+.2,a:Math.random()*.65+.15,s:Math.random()*.09+.015}))}
function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){s.y+=s.s;if(s.y>innerHeight)s.y=0;ctx.beginPath();ctx.arc(s.x+mx*.008,s.y+my*.008,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(220,245,245,${s.a})`;ctx.fill()}requestAnimationFrame(draw)}
addEventListener('resize',resize);addEventListener('pointermove',e=>{mx=e.clientX-innerWidth/2;my=e.clientY-innerHeight/2});resize();draw();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible','in-view')}),{threshold:.18});$$('.reveal,.skill-card').forEach(el=>observer.observe(el));

function updateTrajectoryState(){
  const max=document.documentElement.scrollHeight-innerHeight;
  $('.progress span').style.width=(scrollY/max*100)+'%';
  const log=$('.flight-log'),line=$('.timeline-line span'),entries=$$('.log-entry');
  if(!log)return;
  const r=log.getBoundingClientRect(),focus=innerHeight*.44,p=Math.max(0,Math.min(1,(focus-r.top)/r.height));
  line.style.height=(p*100)+'%';
  let nearest=null,distance=Infinity;
  entries.forEach(entry=>{const box=entry.getBoundingClientRect(),d=Math.abs(box.top+Math.min(box.height*.38,180)-focus);if(d<distance){distance=d;nearest=entry}});
  if(nearest&&r.top<innerHeight*.82&&r.bottom>innerHeight*.18)entries.forEach(entry=>entry.classList.toggle('active',entry===nearest));
}
addEventListener('scroll',updateTrajectoryState,{passive:true});
addEventListener('resize',updateTrajectoryState);

$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const f=btn.dataset.filter;
  $$('.cap-node').forEach(node=>node.classList.toggle('hide',f!=='all'&&node.dataset.category!==f));
  $('#node-code').textContent=f==='all'?'SYSTEM MAP':f.toUpperCase()+' / NETWORK';
  $('#node-title').textContent=f==='all'?`${$$('.cap-node').length} connected capabilities`:`${$$('.cap-node').filter(n=>n.dataset.category===f).length} ${f} capabilities`;
  $('#node-detail').textContent='Select any visible node to inspect how it contributes to César\'s operating system.';
}));

$$('.cap-node').forEach(node=>node.addEventListener('click',()=>{
  $$('.cap-node').forEach(n=>n.classList.remove('selected'));node.classList.add('selected');
  $('#node-code').textContent=node.dataset.code;
  $('#node-title').textContent=node.querySelector('strong').textContent;
  $('#node-detail').textContent=node.dataset.detail;
}));

// Keep company tenure and role progression readable without inventing hidden LinkedIn dates.
const tenureLabels=[
  ['APR 2024 — PRESENT · 2 YRS 4 MOS','AIRBUS · ROLE 03/03 · GETAFE'],
  ['MAY 2023 — APR 2024 · 1 YR','AIRBUS · ROLE 02/03 · EURODRONE'],
  ['OCT 2022 — MAY 2023 · 8 MOS','AIRBUS · ROLE 01/03 · PROCUREMENT'],
  ['MAY 2022 — OCT 2022 · 6 MOS','DELOITTE · STELLANTIS C1ST'],
  ['NOV 2021 — APR 2022 · 6 MOS','EY · MULTI-INDUSTRY R&D']
];
$$('.log-entry').forEach((entry,index)=>{
  const meta=entry.querySelector('.log-meta');
  if(meta&&tenureLabels[index]) meta.innerHTML=`<span>${tenureLabels[index][0]}</span><small>${tenureLabels[index][1]}</small>`;
});

const experienceContent=[
  {title:'Programme Management Office – Military Aircraft Strategic Programmes',company:'AIRBUS · TANKER, TRANSPORT & MISSION AIRCRAFT',description:'Programme and Project Management across MRTT and derivative-aircraft campaigns, offers and strategic programmes. PMO Manager for the UAE MRTT fleet; responsible for business development, internal developments, product policy, R&D portfolio management, Integrated Product Roadmap and Integrated Business Planning activities.'},
  {title:'Systems Engineer (V&V and Testing) – Eurodrone Powerplant',company:'AIRBUS · EURODRONE POWERPLANT',description:'Designed testing plans and processes for the Eurodrone powerplant, coordinated suppliers for test benches and nacelle equipment, supported SRR and PDR development phases, managed V&V documentation and aircraft requirements for nacelle, engine, control and monitoring, performance and certification.'},
  {title:'BI, SAP BW & HANA Technical Expert',company:'AIRBUS · PROCUREMENT & SUPPLY CHAIN',description:'Designed Business Intelligence solutions with SAP Analytics Cloud and Analysis for Office, modelled data structures in SAP BW and HANA Studio, and delivered supply-chain and procurement analytics in close collaboration with internal clients.'},
  {title:'Salesforce Analyst',company:'DELOITTE · STELLANTIS C1ST',description:'Certified Salesforce CRM administrator and functional developer for Stellantis’ C1ST sales platform, translating commercial processes and user needs into reliable platform configuration.'},
  {title:'Research and Development Consultant',company:'EY · R&D AND TECHNOLOGICAL INNOVATION',description:'Certified deductions, bonuses and public-aid eligibility for R&D and technological-innovation projects across defence, AI, manufacturing, energy and chemistry.'}
];
$$('.log-entry').forEach((entry,index)=>{
  const item=experienceContent[index]; if(!item)return;
  entry.querySelector('h3').textContent=item.title;
  entry.querySelector('.role-description').textContent=item.description;
});

// Build a seamless full-width index from every capability and role skill already on the page.
const marqueeSkills=[...new Set([
  ...$$('.cap-node strong').map(node=>node.textContent.trim()),
  ...$$('.log-content li').map(item=>item.textContent.trim())
])];
const marqueeText=marqueeSkills.join('  ·  ')+'  ·  ';
const marqueeTrack=$('.tool-marquee-track');
if(marqueeTrack){
  const first=document.createElement('span'),second=document.createElement('span');
  first.textContent=marqueeText;
  second.textContent=marqueeText;
  second.setAttribute('aria-hidden','true');
  marqueeTrack.append(first,second);
}
updateTrajectoryState();

const capabilityContext={
  'PM.01':'Budgeting, cost control and business-case development used in Airbus aerospace projects to connect scope, resources and financial impact.',
  'PM.02':'Risk identification, assessment, mitigation and senior communication applied across R&D, testing, obsolescence and strategic Airbus initiatives.',
  'PM.03':'Integrated planning from offer phase through execution, using Microsoft Project, BigPicture and comparable planning environments.',
  'PM.04':'Stakeholder management and negotiation with clients, suppliers, cross-functional engineering teams and senior management in defence programmes.',
  'PM.05':'RFI, RFP and PTS analysis plus bidding and contract support, developed in programme-management and consulting environments.',
  'PM.06':'Technical and executive reporting used to turn complex programme status, plans and risks into clear management decisions.',
  'PM.07':'Lifecycle thinking from concept and certification to market introduction, applied across aerospace systems and product strategy work.',
  'SE.01':'Requirements definition, traceability and management with Excel, DOORS and CAMEO during Airbus powerplant systems engineering.',
  'SE.02':'Validation and Verification of Eurodrone certification requirements, ensuring every requirement connects to defensible evidence.',
  'SE.03':'ARP4754A and ISO 15288 systems-engineering principles applied to complex aerospace development, reviews and verification activity.',
  'SE.04':'Certification compliance involving CS-23, DO-160, safety, fire protection, electrical, avionics and structural domains.',
  'SE.05':'Definition and execution of nacelle integration, bird-strike, icing and equipment test plans for Eurodrone propulsion systems.',
  'SE.06':'Participation in SRR, PDR and CDR design reviews, together with quality and programme maturity gates at Airbus.',
  'SE.07':'Technical selection and coordination of equipment and test-bench suppliers, bridging engineering requirements and external delivery.',
  'DT.01':'SAP BW modelling with transformations, ADSOs, DataSources, DTPs and process chains for Airbus procurement and supply-chain reporting.',
  'DT.02':'KPI storytelling with SAP Analytics Cloud, Analysis for Office, Tableau and Qlik Sense for operational and executive audiences.',
  'DT.03':'Python, C, VBA and Google Apps Script used to process data, automate repetitive work and improve reporting efficiency.',
  'DT.04':'Salesforce administration and functional development on Stellantis’ C1ST platform at Deloitte, translating user needs into configuration.',
  'DT.05':'Agile delivery with JIRA and Scrum at Deloitte, combined with structured Waterfall governance in complex aerospace programmes.',
  'DT.06':'Advanced Microsoft Office and Google Workspace usage for analysis, plans, reporting, collaboration and automation across roles.'
};
$$('.cap-node').forEach(node=>{if(capabilityContext[node.dataset.code]) node.dataset.detail=capabilityContext[node.dataset.code]});

// Magnetic call-to-action movement, intentionally restrained.
$$('.button').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.12}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});
