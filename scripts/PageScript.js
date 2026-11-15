document.addEventListener("DOMContentLoaded", () => {

    //#region New sheet

    document.getElementById("btnNewSheet").addEventListener("click", function () {
        document.querySelectorAll("[data-json]").forEach(element => {
            if (element.type === "checkbox") {
                element.checked = false;
            } else if (element instanceof HTMLSelectElement) {
                element.selectedIndex = 0;
            }
            else {
                element.value = "";
            }

            document.getElementById("powerSourceContainer").innerHTML = "";
            document.getElementById("transmContainer").innerHTML = "";

            element.dispatchEvent(new Event("change", {
                bubbles: true
            }));
        });
    })

    //#endregion
    
    //#region Wheel arr radio listener

    $(document).ready(function () {
        $('input[name="options"]').on('change', function () {
            if ($('#steamEngineArr').is(':checked')) {
                $('#wheelArrSteamContainer').show();
                $('#wheelArrNonSteamContainer').hide();
            }
            else if ($('#nonSteamEngineArr').is(':checked')) {
                $('#wheelArrSteamContainer').hide();
                $('#wheelArrNonSteamContainer').show();
            }
        });
    })

    //#endregion

    //#region Power source builder

    const template = document.getElementById("powerSourceTempl");
    const container = document.getElementById("powerSourceContainer");
    const addButton = document.getElementById("btnAddPwrSource");

    addButton.addEventListener("click", function () {
        const entryId = Math.random().toString(36);

        const entry = template.cloneNode(true);
        entry.id = `powerSource-${entryId}`;

        const dropdown = entry.querySelector("#powerSourceSelector");
        dropdown.id = `powerSourceSelector-${entryId}`;

        const del = entry.querySelector("#powerSourceRemove");
        del.id = `powerSourceRemove-${entryId}`;

        del.addEventListener("click", function () {
            entry.remove();
        });

        container.appendChild(entry);
    })

    //#endregion

    //#region Transmission type builer

    const transTemplate = document.getElementById("transTempl");
    const transContainer = document.getElementById("transmContainer");
    const transAddButton = document.getElementById("btnAddTransm");

    transAddButton.addEventListener("click", function () {
        const entryId = Math.random().toString(36);

        const entry = transTemplate.cloneNode(true);
        entry.id = `transmissionType-${entryId}`;

        const dropdown = entry.querySelector("#transSelector");
        dropdown.id = `transSelector-${entryId}`;

        const del = entry.querySelector("#transRemove");
        del.id = `transRemove-${entryId}`;

        del.addEventListener("click", function () {
            entry.remove();
        });

        transContainer.appendChild(entry);
    })

    //#endregion

    //#region Standard name field

    const standardNameToggle = document.getElementById("standardNameToggle");
    const fieldStandardName = document.getElementById("fieldStandardName");
    const standardNameFieldCont = document.getElementById("standardNameFieldCont");

    standardNameToggle.addEventListener("change", () => {
        if (standardNameToggle.checked) standardNameFieldCont.style.display = "block";
        else standardNameFieldCont.style.display = "none"
    })

    //#endregion

    //#region Steam engine field

    const steamEngineToggle = document.getElementById("steamEngineToggle");
    const steamEngineSpecs = document.getElementById("steamEngineSpecs");

    steamEngineToggle.addEventListener("change", () => {
        if (steamEngineToggle.checked) steamEngineSpecs.style.display = "block";
        else steamEngineSpecs.style.display = "none"
    })

    //#endregion

    //#region Diesel engine field

    const dieselEngineToggle = document.getElementById("dieselEngineToggle");
    const dieselEngineSpecs = document.getElementById("dieselEngineSpecs");

    dieselEngineToggle.addEventListener("change", () => {
        if (dieselEngineToggle.checked) dieselEngineSpecs.style.display = "block";
        else dieselEngineSpecs.style.display = "none"
    })

    //#endregion

    //#region Battery field

    const batteryToggle = document.getElementById("batteryToggle");
    const batterySpecs = document.getElementById("batterySpecs");

    batteryToggle.addEventListener("change", () => {
        if (batteryToggle.checked) batterySpecs.style.display = "block";
        else batterySpecs.style.display = "none"
    })

    //#endregion

    //#region Catenary field

    const catenaryToggle = document.getElementById("catenaryToggle");
    const catenarySpecs = document.getElementById("catenarySpecs");

    catenaryToggle.addEventListener("change", () => {
        if (catenaryToggle.checked) catenarySpecs.style.display = "block";
        else catenarySpecs.style.display = "none"
    })

    //#endregion

    //#region Electric T field

    const electricToggle = document.getElementById("electricToggle");
    const electricTransSpecs = document.getElementById("electricTransSpecs");

    electricToggle.addEventListener("change", () => {
        if (electricToggle.checked) electricTransSpecs.style.display = "block";
        else electricTransSpecs.style.display = "none"
    })

    //#endregion

    //#region HydroMech T field

    const hydroMechToggle = document.getElementById("hydroMechToggle");
    const hydroMechTransSpecs = document.getElementById("hydroMechTransSpecs");

    hydroMechToggle.addEventListener("change", () => {
        if (hydroMechToggle.checked) hydroMechTransSpecs.style.display = "block";
        else hydroMechTransSpecs.style.display = "none"
    })

    //#endregion

    //#region Image handler

    const imgInput = document.getElementById("locoImageInput");
    const imgPreview = document.getElementById("imagePreview");
    const previewContainer = document.getElementById("picPreview");

    let currentURL = null;

    imgInput.addEventListener("change", () => {
        const file = imgInput.files[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

        if (!allowedTypes.includes(file.type)) {
            alert("Only PNG and JPEG images are allowed.");
            imgInput.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("Maximum image size is 10 MB.");
            imgInput.value = "";
            return;
        }

        const testUrl = URL.createObjectURL(file);
        const testImg = new Image();

        testImg.onload = () => {
            const w = testImg.naturalWidth;
            const h = testImg.naturalHeight;

            const ratio = w / h;
            const targetRatio = 16 / 9;

            if (Math.abs(ratio - targetRatio) > 0.01) {
                alert(
                    "Invalid image dimensions. Please upload a 16:9 image file."
                )

                URL.revokeObjectURL(testUrl);
                imgInput.value = "";
                return;
            }

            if (currentURL) URL.revokeObjectURL(currentURL);

            currentURL = testUrl;
            imgPreview.src = currentURL;

            previewContainer.style.display = "block";
        }

        testImg.onerror = () => {
            URL.revokeObjectURL(testUrl);
            fileInput.value = "";
            alert("Unable to read this image.");
        }

        testImg.src = testUrl;
    });

    //#endregion

    //#region Country list

    const countryURL =
        "https://raw.githubusercontent.com/stefangabos/world_countries/master/data/countries/en/world.json";

    fetch(countryURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load countries");
            }
            return response.json();
        })
        .then(countries => {
            const countryOrigin = document.getElementById("countryOrigin");
            const countryLocale = document.getElementById("countryLocale");

            countries.forEach(country => {
                const alpha2 = country.alpha2.toUpperCase();
                const label = `${country.name} (${alpha2})`;

                const originOption = document.createElement("option");
                originOption.value = alpha2;
                originOption.textContent = label;
                countryOrigin.appendChild(originOption);

                const localeOption = document.createElement("option");
                localeOption.value = alpha2;
                localeOption.textContent = label;
                countryLocale.appendChild(localeOption);
            });
        })
        .catch(error => {
            console.error("Country loading error:", error);
        });
    
    //#endregion

    //#region Header

    const header = document.getElementById("mainHeader");

    let lastScrollPosition = 0;

    window.addEventListener("scroll", function () {
        const currentScrollPosition = window.pageYOffset;

        if (currentScrollPosition < 80) {
            // Always show header near the top
            header.classList.remove("hide-header");
        } else if (currentScrollPosition > lastScrollPosition) {
            // Scrolling down
            header.classList.add("hide-header");
        } else {
            // Scrolling up
            header.classList.remove("hide-header");
        }

        lastScrollPosition = currentScrollPosition;
    });

    //#endregion
});