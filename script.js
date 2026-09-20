let page=1, answers={name:"",songs:{},favourite:"",feedback:""};
const $=s=>document.querySelector(s);
function fmt(x){if(!isFinite(x))return"0:00";x=Math.floor(x);return Math.floor(x/60)+":"+String(x%60).padStart(2,"0")}

function show(n) {
  // Stop any video that is currently playing
  document.querySelectorAll("video").forEach(video => {
    video.pause();
  });

  document.querySelectorAll(".page").forEach(x =>
    x.classList.toggle("active", x.dataset.page == n)
  );

  page = n;
  $("#bar").style.width = (n / 6 * 100) + "%";
  scrollTo({ top: 0, behavior: "smooth" });
}

function scale(i,type,text){let d=document.createElement("div");d.innerHTML=`<label>${text} <b>*</b></label><div class="scale">${[1,2,3,4,5,6,7,8,9,10].map(n=>`<label><input type="radio" name="${type}-${i}" value="${n}">${n}</label>`).join("")}</div><p class="error" id="${type}e${i}"></p>`;return d}
function player(song){
 let w=document.createElement("div");w.className="player";
 let v=document.createElement("video");v.preload="metadata";v.playsInline=true;
 v.innerHTML=`<source src="${song.videoUrl}" type="video/mp4">`;
 let t=null;
 if(song.subtitleUrl&&!song.subtitleUrl.startsWith("PASTE_")){
   t=document.createElement("track");t.kind="subtitles";t.src=song.subtitleUrl;t.srclang="en";t.label="English";t.default=true;v.appendChild(t);
 }
 let c=document.createElement("div");c.className="controls";
 let seek=document.createElement("input");seek.type="range";seek.className="seek";seek.min=0;seek.max=100;seek.value=0;
 let r=document.createElement("div");r.className="row";
 let play=document.createElement("button");play.className="ctl";play.textContent="▶";play.title="Play";
 let time=document.createElement("span");time.className="time";time.textContent="0:00 / 0:00";
 let mute=document.createElement("button");mute.className="ctl";mute.textContent="🔊";
 let vol=document.createElement("input");vol.className="volume";vol.type="range";vol.min=0;vol.max=1;vol.step=.05;vol.value=1;
 let grow=document.createElement("span");grow.className="grow";
 let cc=document.createElement("button");cc.className="ctl cc";cc.textContent="CC";cc.title="English subtitles";if(!t)cc.style.display="none";
 let speed=document.createElement("select");speed.className="speed";["0.75","1","1.25","1.5","2"].forEach(x=>{let o=new Option(x+"×",x);if(x==="1")o.selected=true;speed.add(o)});
 let fs=document.createElement("button");fs.className="ctl";fs.textContent="⛶";fs.title="Fullscreen";
 r.append(play,time,mute,vol,grow,cc,speed,fs);c.append(seek,r);w.append(v,c);
 const sync=()=>{play.textContent=v.paused?"▶":"❚❚";time.textContent=`${fmt(v.currentTime)} / ${fmt(v.duration)}`;seek.value=v.duration?(v.currentTime/v.duration*100):0};
 play.onclick=()=>v.paused?v.play():v.pause();v.onclick=()=>v.paused?v.play():v.pause();v.ontimeupdate=sync;v.onloadedmetadata=sync;
 seek.oninput=()=>v.duration&&(v.currentTime=seek.value/100*v.duration);
 mute.onclick=()=>{v.muted=!v.muted;mute.textContent=v.muted?"🔇":"🔊"};
 vol.oninput=()=>{v.volume=+vol.value;v.muted=v.volume===0;mute.textContent=v.muted?"🔇":"🔊"};
 speed.onchange=()=>v.playbackRate=+speed.value;
 fs.onclick=()=>document.fullscreenElement?document.exitFullscreen():w.requestFullscreen();
 if(t){const on=()=>{if(v.textTracks[0]){v.textTracks[0].mode="showing";cc.classList.add("on")}};v.onloadedmetadata=()=>{sync();setTimeout(on,50)};cc.onclick=()=>{let x=v.textTracks[0];if(!x)return;x.mode=x.mode==="showing"?"disabled":"showing";cc.classList.toggle("on",x.mode==="showing")}}
 return w;
}
SURVEY_CONFIG.songs.forEach((s,i)=>{let p=document.createElement("section");p.className="page";p.dataset.page=i+2;p.innerHTML=`<h2>${s.title}</h2>`;p.append(player(s),scale(i,"rating","1. Rate the song from 1 to 10"),scale(i,"comp","2. Rate the competitiveness from 1 to 10"));let nav=document.createElement("div");nav.className="nav";nav.innerHTML=`<button class="secondary">← Back</button><button class="primary">Next →</button>`;nav.children[0].onclick=()=>show(page-1);nav.children[1].onclick=()=>{let a=document.querySelector(`input[name=rating-${i}]:checked`),b=document.querySelector(`input[name=comp-${i}]:checked`);$(`#ratinge${i}`).textContent=a?"":"Please select a rating.";$(`#compe${i}`).textContent=b?"":"Please select a rating.";if(a&&b){answers.songs[s.id]={title:s.title,rating:+a.value,competitiveness:+b.value};show(page+1)}};p.append(nav);$("#songPages").append(p)});
SURVEY_CONFIG.songs.forEach(s=>{let l=document.createElement("label");l.className="option";l.innerHTML=`<input type="radio" name="fav" value="${s.id}">${s.title}`;$("#favourites").append(l)});
$("#start").onclick=()=>{let x=$("#name").value.trim();$("#nameError").textContent=x?"":"Please enter your name.";if(x){answers.name=x;show(2)}};
$("#backFinal").onclick=()=>show(5);
$("#submit").onclick=async()=>{let f=$('input[name="fav"]:checked'),fb=$("#feedback").value.trim();$("#favError").textContent=f?"":"Please select your favourite.";$("#feedbackError").textContent=fb?"":"Please enter your feedback.";if(!f||!fb)return;answers.favourite=f.value;answers.feedback=fb;let st=$("#status"),btn=$("#submit");if(SURVEY_CONFIG.googleAppsScriptUrl.startsWith("PASTE_")){st.textContent="Backend not configured yet.";return}btn.disabled=true;st.textContent="Submitting…";try{await fetch(SURVEY_CONFIG.googleAppsScriptUrl,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(answers)});show(7)}catch(e){st.textContent="Submission failed. Please try again.";btn.disabled=false}};
