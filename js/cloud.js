(() => {
  const TE=window.TE5=window.TE5||{};
  const SDK_VERSION='12.18.0';
  const CONFIG_KEY='te:firebase:config:v1';
  const CLOUD_USER_KEY='te:firebase:last-user:v1';
  const CLOUD_BOUND_PREFIX='te:firebase:bound:';
  const LOCAL_PREFIX='te:';
  const DEFAULT_CONFIG={
    apiKey:'AIzaSyBHyS3QJz4MfDFyKeA1UuU9tANyBqYOAbY',
    authDomain:'top-eleven-tool.firebaseapp.com',
    projectId:'top-eleven-tool',
    storageBucket:'top-eleven-tool.firebasestorage.app',
    messagingSenderId:'300113114934',
    appId:'1:300113114934:web:86d5988d00eb351338e597'
  };
  const SYNC_PREFIXES=['player:','squad:','training:normal-drills:','training:master-stock:','training:session:','teamplan:','mentor:'];
  const LOCAL_ONLY_PREFIXES=['scanner:queue:','migration:','schema:','squad:recovery:'];
  const state={status:'idle',config:null,app:null,auth:null,db:null,user:null,error:null,mods:null,unsub:null,pendingMfa:null,pendingTotp:null,initialAuthResolved:false,syncCount:0,lastSyncAt:0};

  function qs(sel){return document.querySelector(sel)}
  function qsa(sel){return [...document.querySelectorAll(sel)]}
  function text(el,v){if(el)el.textContent=v??''}
  function show(el,on=true){if(el)el.hidden=!on}
  function cleanConfig(raw){
    if(!raw)return null;
    if(typeof raw==='object')return raw;
    const s=String(raw).trim();
    try{return JSON.parse(s)}catch(_){/* loose Firebase snippet */}
    const fields=['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId','measurementId'];
    const out={};
    for(const f of fields){const m=s.match(new RegExp(`${f}\\s*:\\s*["']([^"']+)["']`));if(m)out[f]=m[1];}
    return out.apiKey&&out.authDomain&&out.projectId&&out.appId?out:null;
  }
  function loadConfig(){try{return cleanConfig(localStorage.getItem(CONFIG_KEY))||DEFAULT_CONFIG}catch(_){return DEFAULT_CONFIG}}
  function saveConfig(raw){const cfg=cleanConfig(raw);if(!cfg)throw new Error('Could not read that Firebase config. Paste the full firebaseConfig object from Firebase Console.');localStorage.setItem(CONFIG_KEY,JSON.stringify(cfg));return cfg}
  function clearConfig(){localStorage.removeItem(CONFIG_KEY)}
  function shouldSyncKey(key){const k=String(key||'');if(!k||LOCAL_ONLY_PREFIXES.some(p=>k.startsWith(p)))return false;return SYNC_PREFIXES.some(p=>k.startsWith(p));}
  function encodeKey(key){const bytes=new TextEncoder().encode(String(key));let binary='';bytes.forEach(b=>binary+=String.fromCharCode(b));return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  function decodeKey(id){let s=String(id).replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const bin=atob(s),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
  function localSetRaw(key,value){try{localStorage.setItem(LOCAL_PREFIX+key,String(value))}catch(_){}}
  function localDelRaw(key){try{localStorage.removeItem(LOCAL_PREFIX+key)}catch(_){}}
  function localSyncedKeys(){const out=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith(LOCAL_PREFIX)){const bare=k.slice(LOCAL_PREFIX.length);if(shouldSyncKey(bare))out.push(bare)}}}catch(_){}return out}

  async function loadSdk(){
    if(state.mods)return state.mods;
    const base=`https://www.gstatic.com/firebasejs/${SDK_VERSION}`;
    const [appMod,authMod,fsMod]=await Promise.all([
      import(`${base}/firebase-app.js`),
      import(`${base}/firebase-auth.js`),
      import(`${base}/firebase-firestore.js`)
    ]);
    state.mods={...appMod,...authMod,...fsMod};return state.mods;
  }
  function providerIds(user=state.user){return [...new Set((user?.providerData||[]).map(x=>x.providerId).filter(Boolean))]}
  function friendlyAuthError(err){
    const code=String(err?.code||'');
    const map={
      'auth/invalid-credential':'Email or password is incorrect.',
      'auth/invalid-login-credentials':'Email or password is incorrect.',
      'auth/email-already-in-use':'That email is already registered.',
      'auth/weak-password':'Use a stronger password (at least 6 characters).',
      'auth/invalid-email':'Enter a valid email address.',
      'auth/popup-closed-by-user':'Sign-in window was closed.',
      'auth/popup-blocked':'Your browser blocked the sign-in window.',
      'auth/operation-not-allowed':'That sign-in method is not enabled in Firebase yet.',
      'auth/unauthorized-domain':'This website domain is not authorised in Firebase Authentication.',
      'auth/requires-recent-login':'For security, verify your identity again and retry.',
      'auth/too-many-requests':'Too many attempts. Try again later.',
      'auth/network-request-failed':'Network error. Check your connection and try again.',
      'auth/account-exists-with-different-credential':'An account already exists with this email using a different sign-in method.'
    };
    return map[code]||err?.message||'Authentication failed.';
  }
  function setAuthMessage(msg,type=''){const el=qs('#authMessage');if(!el)return;text(el,msg);el.className=`auth-message ${type}`.trim()}
  function gateMode(mode){
    qsa('[data-auth-panel]').forEach(el=>show(el,el.dataset.authPanel===mode));
    qsa('[data-auth-tab]').forEach(el=>el.classList.toggle('active',el.dataset.authTab===mode));
    if(mode!=='mfa')setAuthMessage('');
  }
  function showGate(mode){const gate=qs('#authGate');show(gate,true);document.body.classList.add('auth-locked');gateMode(mode||(!state.config?'setup':'signin'))}
  function hideGate(){show(qs('#authGate'),false);document.body.classList.remove('auth-locked')}
  function updateCloudChrome(){
    const status=qs('.top-status');
    if(status){status.innerHTML=`<i></i> ${state.user?'Cloud':'Offline'}`;status.classList.toggle('cloud',!!state.user)}
    const account=qs('#accountButton');
    if(account){account.hidden=!state.user;const initial=(state.user?.displayName||state.user?.email||'?').trim().slice(0,1).toUpperCase();text(account,initial)}
  }

  async function initFirebase(){
    state.config=loadConfig();
    if(!state.config){state.status='needs-config';showGate('setup');return false;}
    state.status='loading';
    try{
      const m=await loadSdk();
      state.app=m.initializeApp(state.config);
      state.auth=m.getAuth(state.app);
      await m.setPersistence(state.auth,m.browserLocalPersistence);
      state.db=m.initializeFirestore(state.app,{localCache:m.persistentLocalCache({tabManager:m.persistentMultipleTabManager()})});
      try{await m.getRedirectResult(state.auth)}catch(err){if(err?.code==='auth/multi-factor-auth-required')beginMfa(err);else console.warn('Redirect sign-in result',err)}
      await new Promise(resolve=>{
        let settled=false;
        m.onAuthStateChanged(state.auth,async user=>{
          state.user=user||null;state.initialAuthResolved=true;updateCloudChrome();
          if(user){
            try{localStorage.setItem(CLOUD_USER_KEY,user.uid)}catch(_){}
            await ensureUserProfile().catch(console.warn);
          }
          if(!settled){settled=true;resolve()}
        },err=>{state.error=err;if(!settled){settled=true;resolve()}})
      });
      if(!state.user){state.status='signed-out';showGate('signin');return false;}
      state.status='syncing';
      await syncDown();
      startLiveSync();
      state.status='ready';hideGate();updateCloudChrome();return true;
    }catch(err){state.error=err;state.status='error';showGate('setup');setAuthMessage(`Firebase setup error: ${friendlyAuthError(err)}`,'err');return false;}
  }
  let bootPromise=null;
  async function ensureReady(){if(!bootPromise)bootPromise=initFirebase();return bootPromise}

  function kvRef(key){const m=state.mods;return m.doc(state.db,'users',state.user.uid,'kv',encodeKey(key))}
  async function writeKey(key,value){if(!state.user||!state.db||!shouldSyncKey(key))return;const m=state.mods;await m.setDoc(kvRef(key),{key:String(key),value:String(value),deviceUpdatedAt:Date.now(),updatedAt:m.serverTimestamp()},{merge:true})}
  async function deleteKey(key){if(!state.user||!state.db||!shouldSyncKey(key))return;await state.mods.deleteDoc(kvRef(key))}
  async function syncDown(){
    if(!state.user)return;
    const m=state.mods,col=m.collection(state.db,'users',state.user.uid,'kv');
    const alreadyBound=!!localStorage.getItem(CLOUD_BOUND_PREFIX+state.user.uid);
    const snap=alreadyBound?await m.getDocs(col):await m.getDocsFromServer(col);
    const remote=new Map();snap.forEach(d=>{const x=d.data()||{},key=x.key||decodeKey(d.id);if(shouldSyncKey(key))remote.set(key,String(x.value??''))});
    // Cloud is authoritative. Local-only scanner keys remain untouched.
    for(const key of localSyncedKeys())if(!remote.has(key))localDelRaw(key);
    for(const [key,val] of remote)localSetRaw(key,val);
    state.syncCount=remote.size;state.lastSyncAt=Date.now();
    try{localStorage.setItem(CLOUD_BOUND_PREFIX+state.user.uid,new Date().toISOString())}catch(_){}
    window.dispatchEvent(new CustomEvent('te-cloud-synced',{detail:{count:remote.size}}));
  }
  function startLiveSync(){
    if(state.unsub)state.unsub();
    const m=state.mods,col=m.collection(state.db,'users',state.user.uid,'kv');
    state.unsub=m.onSnapshot(col,snap=>{
      let changed=false;
      snap.docChanges().forEach(c=>{const x=c.doc.data()||{},key=x.key||decodeKey(c.doc.id);if(!shouldSyncKey(key))return;if(c.type==='removed')localDelRaw(key);else localSetRaw(key,String(x.value??''));changed=true});
      if(changed){state.syncCount=snap.size;state.lastSyncAt=Date.now();window.dispatchEvent(new CustomEvent('te-cloud-data-changed'));renderAccountPage()}
    },err=>console.warn('Cloud sync listener',err));
  }
  async function ensureUserProfile(){
    if(!state.user)return;
    const m=state.mods,ref=m.doc(state.db,'users',state.user.uid);
    await m.setDoc(ref,{email:state.user.email||null,displayName:state.user.displayName||null,photoURL:state.user.photoURL||null,providers:providerIds(),lastSeenAt:m.serverTimestamp()},{merge:true});
  }

  async function handleMfaError(err){if(err?.code==='auth/multi-factor-auth-required'){beginMfa(err);return true}return false}
  function beginMfa(err){
    const resolver=state.mods.getMultiFactorResolver(state.auth,err);state.pendingMfa=resolver;
    const hint=resolver.hints.find(h=>h.factorId===state.mods.TotpMultiFactorGenerator.FACTOR_ID)||resolver.hints[0];
    const label=hint?.displayName||'Authenticator';text(qs('#mfaHint'),`Enter the 6-digit code from ${label}.`);showGate('mfa');
  }
  async function resolveMfa(code){
    const resolver=state.pendingMfa;if(!resolver)throw new Error('No two-step verification challenge is active.');
    const hint=resolver.hints.find(h=>h.factorId===state.mods.TotpMultiFactorGenerator.FACTOR_ID)||resolver.hints[0];
    if(!hint||hint.factorId!==state.mods.TotpMultiFactorGenerator.FACTOR_ID)throw new Error('This build currently supports authenticator-app MFA only.');
    const assertion=state.mods.TotpMultiFactorGenerator.assertionForSignIn(hint.uid,String(code).trim());
    await resolver.resolveSignIn(assertion);state.pendingMfa=null;window.location.reload();
  }

  async function signInEmail(email,password){
    try{await state.mods.signInWithEmailAndPassword(state.auth,String(email).trim(),String(password));window.location.reload()}
    catch(err){if(await handleMfaError(err))return;throw err}
  }
  async function createAccount(name,email,password){
    const cred=await state.mods.createUserWithEmailAndPassword(state.auth,String(email).trim(),String(password));
    if(name?.trim())await state.mods.updateProfile(cred.user,{displayName:name.trim()});
    try{await state.mods.sendEmailVerification(cred.user)}catch(_){}
    window.location.reload();
  }
  async function socialSignIn(){
    const provider=new state.mods.GoogleAuthProvider();
    try{await state.mods.signInWithPopup(state.auth,provider);window.location.reload()}
    catch(err){
      if(await handleMfaError(err))return;
      if(['auth/popup-blocked','auth/operation-not-supported-in-this-environment'].includes(err?.code)){await state.mods.signInWithRedirect(state.auth,provider);return;}
      throw err;
    }
  }
  async function sendPasswordReset(email){await state.mods.sendPasswordResetEmail(state.auth,String(email).trim())}
  async function signOut(){if(state.unsub){state.unsub();state.unsub=null}await state.mods.signOut(state.auth);window.location.reload()}

  async function reauthenticate(currentPassword=''){
    const user=state.auth.currentUser;if(!user)throw new Error('You are signed out.');
    const providers=providerIds(user);
    try{
      if(providers.includes('password')){
        if(!currentPassword)throw new Error('Enter your current password to continue.');
        const cred=state.mods.EmailAuthProvider.credential(user.email,currentPassword);
        return await state.mods.reauthenticateWithCredential(user,cred);
      }
      if(providers.includes('google.com'))return await state.mods.reauthenticateWithPopup(user,new state.mods.GoogleAuthProvider());
      throw new Error('No supported reauthentication method is linked to this account.');
    }catch(err){if(err?.code==='auth/multi-factor-auth-required'){beginMfa(err);throw new Error('Complete the two-step verification challenge, then retry this change.')}throw err}
  }
  async function updateDisplayName(name){const user=state.auth.currentUser;if(!user)throw new Error('Signed out');await state.mods.updateProfile(user,{displayName:String(name||'').trim()});await ensureUserProfile();updateCloudChrome();return user}
  function requireSecondFactorForSensitiveChange(){if(!factors().length)throw new Error('Enable two-step verification before changing your email or password.')}
  async function changeEmail(newEmail,currentPassword){const user=state.auth.currentUser;if(!user)throw new Error('Signed out');requireSecondFactorForSensitiveChange();await reauthenticate(currentPassword);await state.mods.verifyBeforeUpdateEmail(user,String(newEmail).trim());return true}
  async function changePassword(currentPassword,newPassword){const user=state.auth.currentUser;if(!user)throw new Error('Signed out');requireSecondFactorForSensitiveChange();await reauthenticate(currentPassword);await state.mods.updatePassword(user,String(newPassword));return true}
  async function resendVerification(){const user=state.auth.currentUser;if(!user)throw new Error('Signed out');await state.mods.sendEmailVerification(user)}
  async function linkGoogle(){const user=state.auth.currentUser;if(!user)throw new Error('Signed out');await state.mods.linkWithPopup(user,new state.mods.GoogleAuthProvider());await ensureUserProfile();return providerIds(user)}
  async function startTotp(currentPassword=''){
    const user=state.auth.currentUser;if(!user)throw new Error('Signed out');if(!user.emailVerified)throw new Error('Verify your email address before enabling two-step authentication.');
    await reauthenticate(currentPassword);
    const session=await state.mods.multiFactor(user).getSession();
    const secret=await state.mods.TotpMultiFactorGenerator.generateSecret(session);state.pendingTotp=secret;
    return {secretKey:secret.secretKey,uri:secret.generateQrCodeUrl(user.email||'Top Eleven Tool','Top Eleven Tool')};
  }
  async function confirmTotp(code,name='Authenticator app'){const user=state.auth.currentUser;if(!user||!state.pendingTotp)throw new Error('Start authenticator setup first.');const assertion=state.mods.TotpMultiFactorGenerator.assertionForEnrollment(state.pendingTotp,String(code).trim());await state.mods.multiFactor(user).enroll(assertion,String(name||'Authenticator app'));state.pendingTotp=null;return factors()}
  function factors(){const user=state.auth?.currentUser;if(!user)return[];const totpId=state.mods?.TotpMultiFactorGenerator?.FACTOR_ID;return state.mods.multiFactor(user).enrolledFactors.filter(f=>f.factorId===totpId).map(f=>({uid:f.uid,displayName:f.displayName||'Authenticator app',factorId:f.factorId}))}
  async function removeTotp(uid,currentPassword=''){const user=state.auth.currentUser;if(!user)throw new Error('Signed out');await reauthenticate(currentPassword);await state.mods.multiFactor(user).unenroll(uid);return factors()}

  function renderAccountPage(){
    const user=state.auth?.currentUser;if(!user)return;
    text(qs('#accountDisplayName'),user.displayName||'Top Eleven Manager');text(qs('#accountEmail'),user.email||'No email');const av=qs('#accountAvatar');if(av)text(av,(user.displayName||user.email||'?').trim().slice(0,1).toUpperCase());
    const verified=qs('#accountVerified');if(verified){text(verified,user.emailVerified?'Verified':'Not verified');verified.classList.toggle('ok',!!user.emailVerified)}
    const providerBox=qs('#accountProviders');if(providerBox)providerBox.innerHTML=providerIds(user).map(p=>`<span class="provider-pill">${p==='google.com'?'Google':p==='password'?'Email + password':p}</span>`).join('');
    const factorBox=qs('#accountMfaStatus');const fs=factors();if(factorBox)factorBox.innerHTML=fs.length?fs.map(f=>`<div class="account-factor"><span><b>Authenticator app</b><small>${f.displayName}</small></span><button class="btn ghost compact" data-remove-mfa="${f.uid}">Remove</button></div>`).join(''):'<span class="mini-note security-warning">No authenticator app is enrolled. Email and password changes are locked until two-step verification is enabled.</span>';
    const sync=qs('#accountSyncStatus');if(sync){sync.classList.toggle('ok',state.status==='ready');const label=sync.querySelector('span');text(label,state.status==='ready'?`Cloud synced · ${state.syncCount} records`:'Cloud sync connecting…')}
    const nameInput=qs('#accountNameInput');if(nameInput)nameInput.value=user.displayName||'';
    const emailInput=qs('#accountNewEmail');if(emailInput)emailInput.value=user.email||'';
    const linkGoogle=qs('#linkGoogleBtn');if(linkGoogle)linkGoogle.hidden=providerIds(user).includes('google.com');
    const resend=qs('#resendVerificationBtn');if(resend)resend.hidden=!!user.emailVerified;
  }
  function accountMsg(msg,type=''){const el=qs('#accountMessage');if(el){text(el,msg);el.className=`auth-message ${type}`.trim()}}

  function bindUi(){
    document.addEventListener('click',async e=>{
      const tab=e.target.closest('[data-auth-tab]');if(tab){gateMode(tab.dataset.authTab);return}
      if(e.target.closest('#saveFirebaseConfig')){try{saveConfig(qs('#firebaseConfigInput')?.value);setAuthMessage('Firebase configuration saved. Reloading…','ok');setTimeout(()=>location.reload(),350)}catch(err){setAuthMessage(err.message,'err')}return}
      if(e.target.closest('#clearFirebaseConfig')){clearConfig();location.reload();return}
      if(e.target.closest('#authGoogleBtn')){try{setAuthMessage('Opening Google sign-in…');await socialSignIn()}catch(err){setAuthMessage(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#authEmailChoiceBtn')){gateMode('email');return}
      const passwordToggle=e.target.closest('[data-password-toggle]');if(passwordToggle){const input=qs('#'+passwordToggle.dataset.passwordToggle);if(input){const reveal=input.type==='password';input.type=reveal?'text':'password';text(passwordToggle,reveal?'Hide':'Show');passwordToggle.setAttribute('aria-label',reveal?'Hide password':'Show password')}return}
      if(e.target.closest('#authEmailBtn')){try{setAuthMessage('Signing in…');await signInEmail(qs('#authEmail')?.value,qs('#authPassword')?.value)}catch(err){setAuthMessage(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#authCreateBtn')){const p=qs('#signupPassword')?.value||'',c=qs('#signupPasswordConfirm')?.value||'';if(p!==c){setAuthMessage('Passwords do not match.','err');return}try{setAuthMessage('Creating account…');await createAccount(qs('#signupName')?.value,qs('#signupEmail')?.value,p)}catch(err){setAuthMessage(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#authResetBtn')){const email=qs('#authEmail')?.value||qs('#signupEmail')?.value||'';if(!email){setAuthMessage('Enter your email address first.','err');return}try{await sendPasswordReset(email);setAuthMessage('Password reset email sent.','ok')}catch(err){setAuthMessage(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#mfaConfirmBtn')){try{await resolveMfa(qs('#mfaCode')?.value)}catch(err){setAuthMessage(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#accountButton')){window.TE5?.AppNav?.go?.('account');renderAccountPage();return}
      if(e.target.closest('#accountSaveName')){try{await updateDisplayName(qs('#accountNameInput')?.value);renderAccountPage();accountMsg('Profile name updated.','ok')}catch(err){accountMsg(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#accountChangeEmail')){try{await changeEmail(qs('#accountNewEmail')?.value,qs('#accountCurrentPassword')?.value);accountMsg('Verification sent to the new email. The address changes after you verify it.','ok')}catch(err){accountMsg(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#accountChangePassword')){const n=qs('#accountNewPassword')?.value||'',c=qs('#accountNewPasswordConfirm')?.value||'';if(n!==c){accountMsg('New passwords do not match.','err');return}try{await changePassword(qs('#accountCurrentPassword')?.value,n);accountMsg('Password changed.','ok');qs('#accountNewPassword').value='';qs('#accountNewPasswordConfirm').value=''}catch(err){accountMsg(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#resendVerificationBtn')){try{await resendVerification();accountMsg('Verification email sent.','ok')}catch(err){accountMsg(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#linkGoogleBtn')){try{await linkGoogle();renderAccountPage();accountMsg('Google sign-in linked.','ok')}catch(err){accountMsg(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#accountStartTotp')){try{const x=await startTotp(qs('#accountCurrentPassword')?.value);text(qs('#totpSecret'),x.secretKey);const uri=qs('#totpUri');if(uri){uri.value=x.uri;show(qs('#totpSetupBox'),true)}accountMsg('Add this secret to your authenticator app, then enter its 6-digit code below.','ok')}catch(err){accountMsg(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#accountConfirmTotp')){try{await confirmTotp(qs('#totpConfirmCode')?.value);show(qs('#totpSetupBox'),false);renderAccountPage();accountMsg('Two-step verification enabled. Sensitive account changes are now unlocked.','ok')}catch(err){accountMsg(friendlyAuthError(err),'err')}return}
      const rm=e.target.closest('[data-remove-mfa]');if(rm){try{await removeTotp(rm.dataset.removeMfa,qs('#accountCurrentPassword')?.value);renderAccountPage();accountMsg('Two-step verification removed. Sensitive account changes are locked until another factor is enrolled.','ok')}catch(err){accountMsg(friendlyAuthError(err),'err')}return}
      if(e.target.closest('#accountSignOut')){await signOut();return}
    });
  }

  document.addEventListener('DOMContentLoaded',()=>{bindUi();state.config=loadConfig();if(!state.config)showGate('setup')});
  TE.Cloud={SDK_VERSION,state,ensureReady,loadConfig,saveConfig,clearConfig,shouldSyncKey,writeKey,deleteKey,syncDown,signInEmail,createAccount,socialSignIn,sendPasswordReset,signOut,currentUser:()=>state.auth?.currentUser||null,providerIds,factors,renderAccountPage,friendlyAuthError};
})();
