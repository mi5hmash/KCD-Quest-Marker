(() => {
    'use strict'

    // #region SETUP

    const KEY = 'KeyGoesHere';
    const APP_ID = 'KCD01';

    // #endregion

    // #region ENCRYPTION AND COMPRESSION

    // Function that compresses data using Gzip
    async function gzipCompress(data) {
        if (!(data instanceof Uint8Array)) {
            data = new TextEncoder().encode(data);
        }
        const cs = new CompressionStream("gzip");
        const writer = cs.writable.getWriter();
        writer.write(data);
        writer.close();
        const arrayBuffer = await new Response(cs.readable).arrayBuffer();
        return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    }
    
    // Function that decompresses data using Gzip
    async function gzipDecompress(data) {
        if (!(data instanceof Uint8Array)) {
            data = Uint8Array.from(atob(data), char => char.charCodeAt(0));
        }
        const cs = new DecompressionStream("gzip");
        const writer = cs.writable.getWriter();
        writer.write(data);
        writer.close();
        const arrayBuffer = await new Response(cs.readable).arrayBuffer();
        return new Uint8Array(arrayBuffer);
    }

    async function aesDeencryptor(data, iv, salt, isEncrypt = false) {
        let encoder = new TextEncoder();
        let keyMaterial = await crypto.subtle.importKey(
            "raw", encoder.encode(KEY), "PBKDF2", false, ["deriveKey"]
        );
        let derivedKey = await crypto.subtle.deriveKey(
            {
                "name": "PBKDF2",
                "salt": salt,
                "iterations": 100000,
                "hash": "SHA-256"
            },
            keyMaterial,
            {"name": "AES-GCM", "length": 256},
            true,
            [(isEncrypt) ? "encrypt" : "decrypt"]
        );
        let result = '';
        if (isEncrypt) {
            result = await crypto.subtle.encrypt(
                {"name": "AES-GCM", iv},
                derivedKey,
                encoder.encode(data)
            );
        }
        else {
            result = await crypto.subtle.decrypt(
                {"name": "AES-GCM", iv},
                derivedKey,
                data
            );
            let decoder = new TextDecoder();
            result = decoder.decode(result);
        }
        return result;
    }
    
    async function encryptData(data) {
        let iv = crypto.getRandomValues(new Uint8Array(12));
        let salt = crypto.getRandomValues(new Uint8Array(16));
        let encrypted = await aesDeencryptor(data, iv, salt, true);
        let encryptedDataArray = new Uint8Array(encrypted);
        let encryptedData = new Uint8Array(iv.length + encryptedDataArray.length + salt.length);
        let position = 0;
        encryptedData.set(iv, position);
        position += iv.length;
        encryptedData.set(encryptedDataArray, position);
        position += encryptedDataArray.length;
        encryptedData.set(salt, position);
        return await gzipCompress(encryptedData);
    }
    
    async function decryptData(data) {
        data = await gzipDecompress(data);
        let iv = data.slice(0, 12);
        let salt = data.slice(data.length - 16, data.length);
        let encrypted = data.slice(12, data.length - 16);
        return await aesDeencryptor(encrypted, iv, salt, false);
    }

    // #endregion

    // #region STORAGE RW FUNCTIONS

    const getStorageKey = (k) => `${APP_ID}_${k}`;

    // Function that sets an item in the localStorage
    window.setLocalStorageItem = (k, v) => localStorage.setItem(getStorageKey(k), v)
    
    // Function that sets an encrypted item in the localStorage
    window.setEncryptedLocalStorageItem = async (k, v) => {
        const encryptedValue = await encryptData(v);
        localStorage.setItem(getStorageKey(k), encryptedValue);
    };
    
    // Function that gets an item from the localStorage
    window.getLocalStorageItem = k => localStorage.getItem(getStorageKey(k))

    // Function that gets an encrypted item from the localStorage
    window.getEncryptedLocalStorageItem = async (k) => {
        const encryptedValue = localStorage.getItem(getStorageKey(k));
        return encryptedValue ? await decryptData(encryptedValue) : null;
    };

    // Function that checks if an item exists in the localStorage
    window.localStorageItemExists = k => localStorage.getItem(getStorageKey(k)) !== null

    // Function that removes an item from the localStorage
    window.removeLocalStorageItem = k => localStorage.removeItem(getStorageKey(k))

    // Function that sets an item in the sessionStorage
    window.setSessionStorageItem = (k, v) => sessionStorage.setItem(getStorageKey(k), v)

    // Function that gets an item from the sessionStorage
    window.getSessionStorageItem = k => sessionStorage.getItem(getStorageKey(k));

    // Function that checks if an item exists in the sessionStorage
    window.sessionStorageItemExists = k => sessionStorage.getItem(getStorageKey(k)) !== null

    // Function that removes an item from the sessionStorage
    window.removeSessionStorageItem = k => sessionStorage.removeItem(getStorageKey(k))

    // Function that clears the localStorage
    window.clearLocalStorage = (r = false) => {
        localStorage.clear();
        if (r) { location.reload() }
    }

    // Function that clears this app entries from the localStorage
    window.clearAppLocalStorage = (r = false) => {
        let keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key.startsWith(`${APP_ID}_`)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        if (r) { location.reload(); }
    }

    // Function that clears the sessionStorage
    window.clearSessionStorage = (r = false) => {
        sessionStorage.clear();
        if (r) { location.reload(); }
    }

    // Function that clears this app entries from the sessionStorage
    window.clearAppSessionStorage = (r = false) => {
        let keysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            let key = sessionStorage.key(i);
            if (key.startsWith(`${APP_ID}_`)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        if (r) { location.reload() }
    }

    // Function that clears localStorage and sessionStorage
    window.clearStorages = (r = false) => {
        clearLocalStorage()
        clearSessionStorage(r)
    }

    // Function that clears this app entries from localStorage and sessionStorage
    window.clearAppStorages = (r = false) => {
        clearLocalAppStorage()
        clearSessionAppStorage(r)
    }

    // #endregion

})()