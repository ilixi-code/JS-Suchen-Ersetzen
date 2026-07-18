(function() {
    'use strict';

    // Konfiguration direkt im Script
    const affiliateMap = {
        "iPhone 15": "https://dein-link.com/iphone15",
        "Gaming Laptop": "https://dein-link.com/laptop",
        "Programmierung": "https://dein-link.com/kaffee"
    };

    function replaceTextWithLinks() {
        const article = document.querySelector('article');
        if (!article) return;

        const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const nodesToProcess = [];

        // 1. Alle Textknoten sammeln, die eines der Wörter enthalten
        while (node = walker.nextNode()) {
            if (node.parentNode.tagName !== 'A') { // Ignoriere bestehende Links
                for (const word in affiliateMap) {
                    if (node.nodeValue.includes(word)) {
                        nodesToProcess.push(node);
                        break; 
                    }
                }
            }
        }

        // 2. Ersetzung durchführen
        nodesToProcess.forEach(node => {
            const parent = node.parentNode;
            let text = node.nodeValue;
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            // Suche alle Begriffe im Text
            // Erstellt eine Regex, die alle Begriffe gleichzeitig findet
            const pattern = new RegExp(`\\b(${Object.keys(affiliateMap).join('|')})\\b`, 'gi');
            
            let match;
            while ((match = pattern.exec(text)) !== null) {
                // Text vor dem Treffer hinzufügen
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                
                // Den Link erstellen
                const linkElem = document.createElement('a');
                linkElem.href = affiliateMap[match[0]];
                linkElem.target = "_blank";
                linkElem.rel = "sponsored";
                linkElem.textContent = match[0];
                fragment.appendChild(linkElem);
                
                lastIndex = pattern.lastIndex;
            }
            
            // Restlichen Text nach dem letzten Treffer hinzufügen
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            parent.replaceChild(fragment, node);
        });
    }

    // Sicherer Aufruf nach dem Laden der Seite
    window.addEventListener('DOMContentLoaded', replaceTextWithLinks);
})();
