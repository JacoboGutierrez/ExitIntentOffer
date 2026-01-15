(function () {
    'use strict';

    console.log('ExitIntentOffer JS LOADED ✅ v2026-01-12');

    var SESSION_KEY = 'viridianExitIntentShown';          // 1 vez por pestaña
    var SUBMIT_KEY  = 'viridianExitIntentSubmitSeen';     // submit gate
    var SNOOZE_COOKIE = 'viridian_exit_intent_offer_snooze';

    // Possible Origins
    var ALLOWED_ORIGINS = [
        'https://e.viridianweapontech.com',
        'https://r2.dotmailer-surveys.com',
        'https://r1.dotmailer-surveys.com'
    ];

    var MSG_SUBMIT  = 'VIRIDIAN_EXIT_INTENT_SUBMIT';
    var MSG_SUCCESS = 'VIRIDIAN_EXIT_INTENT_SUCCESS';

    function qs(sel, root) { return (root || document).querySelector(sel); }
    function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function getCookie(name) {
        var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
        return m ? decodeURIComponent(m[1]) : null;
    }

    function isSnoozed() {
        return getCookie(SNOOZE_COOKIE) === '1';
    }

    function setSnooze30Days() {
        var maxAge = 30 * 24 * 60 * 60; // 2592000
        var cookie = SNOOZE_COOKIE + "=1; Max-Age=" + maxAge + "; Path=/; SameSite=Lax";
        if (location.protocol === 'https:') cookie += "; Secure";
        document.cookie = cookie;
        console.log('✅ Snooze cookie set (30d)');
    }

    function removeOverlay(overlay) {
        if (!overlay) return;
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        try { overlay.remove(); }
        catch (e) { overlay.parentNode && overlay.parentNode.removeChild(overlay); }
    }

    function hardRemoveOverlayIfSnoozed() {
        var overlay = qs('#exitIntentOverlay');
        if (!overlay) return false;

        if (isSnoozed()) {
            try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
            removeOverlay(overlay);
            return true;
        }
        return false;
    }

    function show(overlay) {
        if (isSnoozed()) return;
        if (sessionStorage.getItem(SESSION_KEY) === '1') return;

        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
        sessionStorage.setItem(SESSION_KEY, '1');
    }

    function hide(overlay) {
        if (!overlay) return;
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
    }

    function init() {
        if (hardRemoveOverlayIfSnoozed()) return;

        var overlay = qs('#exitIntentOverlay');
        if (!overlay) return;

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) hide(overlay);
        });

        qsa('[data-exit-close]', overlay).forEach(function (btn) {
            btn.addEventListener('click', function () { hide(overlay); });
        });

        document.addEventListener('mouseout', function (e) {
            if (isSnoozed()) return;
            if (sessionStorage.getItem(SESSION_KEY) === '1') return;
            if (!e.toElement && !e.relatedTarget) show(overlay);
        });
    }

    // Listener For Dotdigital
    window.addEventListener('message', function (e) {
        console.log('MSG → origin:', e.origin, 'data:', e.data);

        if (ALLOWED_ORIGINS.indexOf(e.origin) === -1) return;

        // supports string or object {type: ...}
        var msg = e.data;
        var msgType = (typeof msg === 'string') ? msg : (msg && msg.type);

        var PENDING_KEY = 'viridianExitIntentPendingSuccessAt';
        var PENDING_TTL_MS = 2 * 60 * 1000; // 2 minutes

        function markSubmitSeen() {
            try { sessionStorage.setItem(SUBMIT_KEY, '1'); } catch (err) {}
        }

        function submitSeen() {
            try { return sessionStorage.getItem(SUBMIT_KEY) === '1'; } catch (err) { return false; }
        }

        function markSuccessPending() {
            try { sessionStorage.setItem(PENDING_KEY, String(Date.now())); } catch (err) {}
        }

        function hasRecentPendingSuccess() {
            var t = 0;
            try { t = parseInt(sessionStorage.getItem(PENDING_KEY) || '0', 10); } catch (err) {}
            return t && (Date.now() - t <= PENDING_TTL_MS);
        }

        function clearPendingSuccess() {
            try { sessionStorage.removeItem(PENDING_KEY); } catch (err) {}
        }

        function finalize() {
            console.log('✅ Finalizing snooze (30d) + removing overlay');
            setSnooze30Days();
            clearPendingSuccess();
            var overlay = qs('#exitIntentOverlay');
            removeOverlay(overlay);
        }

        // SUBMIT
        if (msgType === MSG_SUBMIT) {
            console.log('✅ SUBMIT received');
            markSubmitSeen();

            // If success arrived before, complete now
            if (hasRecentPendingSuccess()) {
                console.log('✅ SUCCESS was pending → finalize now');
                finalize();
            }
            return;
        }

        // SUCCESS
        if (msgType === MSG_SUCCESS) {
            console.log('✅ SUCCESS received');

            // if submit is done, finish
            if (submitSeen()) {
                finalize();
                return;
            }

            // if submit hasn't arrived, leave success pending for a while
            console.log('ℹ️ Success pending (waiting for submit)');
            markSuccessPending();
            return;
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('pageshow', function () {
        hardRemoveOverlayIfSnoozed();
    });

    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) hardRemoveOverlayIfSnoozed();
    });

})();
