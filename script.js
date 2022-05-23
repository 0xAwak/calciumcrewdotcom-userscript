// ==UserScript==
// @name         Calcium Crew Rarities
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display rank, traits occurence and rarity data on https://calciumcrew.com/
// @author       0xAwak
// @match        https://calciumcrew.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=calciumcrew.com
// @grant        none
// ==/UserScript==

(function() {
    let ranks = {}
    fetch("https://raw.githubusercontent.com/0xAwak/calciumcrewdotcom-userscript/main/collection.json").then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    }).then(json => {ranks = json;})


    function displayRarityData() {
        let title = document.querySelector('[id^="headlessui-dialog-title-"]');
        let index = title.innerHTML.split("#")[1];

        let traits_grid = document.querySelector("p.opacity-70").previousSibling;

        let rank_h3 = document.querySelector("#rarity_title");
        if (rank_h3 == null) {
            rank_h3 = document.createElement("h3");
            rank_h3.id = "rarity_title";
            rank_h3.innerHTML = "";
            traits_grid.parentNode.appendChild(rank_h3);

            document.querySelectorAll("#headlessui-portal-root button").forEach(function(elem) {
                elem.addEventListener("click", function() {
                    setTimeout(function() {
                        displayRarityData();
                    }, 1000);
                });
            });
        }
        rank_h3.innerHTML = "Rank #" + ranks[index].rank + " (rarity score: " + ranks[index].total_rarity_score + ")";


        Array.from(traits_grid.children).forEach(function(elem) {
            const trait_type = elem.children[0].innerHTML;
            let trait_value = elem.children[1];
            trait_value.innerHTML = trait_value.innerHTML + " (" + ranks[index].attributes[trait_type].occurences + "/300, " + ranks[index].attributes[trait_type].rarity_score + ")";
        });
    }

    if (ranks !== {}) {
        Array.from(document.querySelector(".grid").children).forEach(function(elem) {
            elem.addEventListener("click", function() {
                setTimeout(function() {
                    displayRarityData()
                }, 1000);
            })
        });
    }
})();
