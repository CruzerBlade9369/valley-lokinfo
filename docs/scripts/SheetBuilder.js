document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnExportSheet").addEventListener("click", buildSheet);

    let isHighlighting = false;
    async function highlightRequired () {
        if (isHighlighting) return;

        isHighlighting = true;

        const elements = document.querySelectorAll("[required-highlight]");

        try {
            for (let i = 0; i < 3; i++) {
                elements.forEach(element => {
                    element.classList.add("border-danger");
                });

                await new Promise(resolve => setTimeout(resolve, 300));

                elements.forEach(element => {
                    element.classList.remove("border-danger");
                });

                if (i < 2) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }
        } finally {
            isHighlighting = false;
        }
    }

    async function buildSheet() {
        const emptyFields = [...document.querySelectorAll('[required-field]')]
            .filter(element => element.value.trim() === "");

        if (emptyFields.length > 0) {
            alert("Please enter values in the required fields.");
            highlightRequired();
            return;
        }

        if (document.getElementById("countryOrigin").value == "Null") {
            alert("Please select a country of origin.");
            return;
        }

        if (document.getElementById("picPreview").style.display != "block") {
            alert("Please insert a 16:9 image.");
            return;
        }

        if (document.getElementById("powerSourceContainer").children.length <= 0 ||
            document.getElementById("transmContainer").children.length <= 0) {
            alert("Powertrain and transmission types must not be empty.");
            return;
        }

        if (document.getElementById("wheelArrBtnGrp").querySelector(":scope > .active").id == "steam") {
            if (document.getElementById("fieldWhyteNotation").value == "") {
                alert("Wheel arrangement must not be empty.");
                return;
            }
        } else {
            if (document.getElementById("fieldUic").value == "" ||
                document.getElementById("fieldPoweredAxles").value == "") {
                alert("Wheel arrangement and powered axles count must not be empty.");
                return;
            }
        }
        
        const templateUrl = "sheet-template/index.html";

        try {
            const response = await fetch(templateUrl);

            if (!response.ok) {
                throw new Error("Unable to load datasheet template");
            }

            const html = await response.text();

            const parser = new DOMParser();
            const templateDoc = parser.parseFromString(html, "text/html");

            //#region All conventional fields

            const sourceFields = {};
            document.querySelectorAll("[data-json]").forEach(element => {
                const key = element.dataset.json;

                if (element.type !== "checkbox") {
                    sourceFields[key] = element.value;
                }
            });

            templateDoc.querySelectorAll("[loco-data]").forEach(element => {
                const key = element.getAttribute("loco-data");
                if (!(key in sourceFields)) return;

                const parent = element.closest(".entry-parent");
                if (parent) {
                    if (sourceFields[key] === "") {
                        parent.classList.add("d-none");
                        parent.classList.remove("d-flex");
                    }
                }

                element.textContent = sourceFields[key];
            });

            //#endregion

            //#region Image

            const imgPreview = document.getElementById("imagePreview");
            const sheetImg = templateDoc.getElementById("locoImage");
            if (imgPreview && imgPreview.src) {
                sheetImg.src = imgPreview.src;
            }

            //#endregion

            //#region World origins

            const origin = document.getElementById("countryOrigin");
            const locale = document.getElementById("countryLocale");
            let originLocale = "";
            if (origin.value !== "Null") originLocale = origin.value;
            if (locale.value !== "Null") originLocale += "/" + locale.value;
            templateDoc.getElementById("originLocale").textContent = originLocale;

            //#endregion

            //#region Production period

            const start = document.getElementById("fieldYearStart");
            const end = document.getElementById("fieldYearEnd");
            const prodPeriod = templateDoc.getElementById("prodPeriod");
            prodPeriod.textContent = start.value + "-" + end.value;

            //#endregion

            //#region Name builder

            const powerSources = document.querySelectorAll(
                "#powerSourceContainer .power-source-select"
            );
            const transmissionTypes = document.querySelectorAll(
                "#transmContainer .transmission-select"
            )
            const arrangementMode = document.getElementById("wheelArrBtnGrp");
            const powerRating = document.getElementById("powerRating");
            const serial = document.getElementById("serialNumber");
            const capacity = document.getElementById("capacity");
            const isSlug = document.getElementById("isSlug");

            let locoName = ""

            powerSources.forEach(powerSource => {
                locoName += powerSource.value;
            })

            transmissionTypes.forEach(transm => {
                if (transm.value != "Null") locoName += transm.value;
            })

            const active = arrangementMode.querySelector(":scope > .active")
            if (active.id == "steam") {
                locoName += document.getElementById("fieldWhyteNotation").value.replace(/\D/g, "");
            } else {
                locoName += document.getElementById("fieldPoweredAxles").value;
            }
            locoName += "-"
            locoName += powerRating.value;
            locoName += Math.floor((Math.min(Math.max(start.value, 1900), 1999) - 1900) / 10);
            locoName += serial.value;
            if (capacity.value != "Null") locoName += capacity.value;
            if (isSlug.checked) locoName += "S";

            templateDoc.getElementById("dvClassification").textContent = locoName;

            //#endregion

            //#region Wheel arrangement
            
            const fieldWhyteNotation = document.getElementById("fieldWhyteNotation");
            const fieldUic = document.getElementById("fieldUic");
            templateDoc.getElementById("wheelArrangement").textContent = active.id == "steam" ? fieldWhyteNotation.value : fieldUic.value

            //#endregion

            //#region Transmission type

            const transType = templateDoc.getElementById("transmissionType");
            let transTypeText = "";
            transmissionTypes.forEach(transm => {
                if (transTypeText != "") transTypeText += ", "
                transTypeText += transm.options[transm.selectedIndex].text;
            });
            transType.textContent = transTypeText;

            //#endregion

            //#region Checkboxes

            document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                if (!checkbox.checked) {
                    if (checkbox.id == "standardNameToggle") {
                        const parent = templateDoc.getElementById("standardNameField");
                        parent.classList.add("d-none");
                        parent.classList.remove("d-flex");
                    }

                    if (checkbox.id == "steamEngineToggle") templateDoc.getElementById("componentSteamEngine").style.display = 'none';

                    if (checkbox.id == "dieselEngineToggle") templateDoc.getElementById("componentDieselEngine").style.display = 'none';

                    if (checkbox.id == "batteryToggle") templateDoc.getElementById("componentBattery").style.display = 'none';

                    if (checkbox.id == "catenaryToggle") templateDoc.getElementById("componentCatenary").style.display = 'none';

                    if (checkbox.id == "electricToggle") templateDoc.getElementById("componentElectricTrans").style.display = 'none';

                    if (checkbox.id == "hydroMechToggle") templateDoc.getElementById("componentHydromechTrans").style.display = 'none';
                }
            });

            //#endregion

            //#region Move from staging to display

            const leftSide = templateDoc.getElementById("leftSide");
            const rightSide = templateDoc.getElementById("rightSide");

            templateDoc.querySelectorAll('.component-container').forEach((element, index) => {
                if (index % 2 == 0) leftSide.appendChild(element);
                else rightSide.appendChild(element);
            });

            //#endregion

            // Print document
            const printFrame = document.createElement("iframe");
            const printHTML =
                "<!DOCTYPE html>" + templateDoc.documentElement.outerHTML;
            printFrame.srcdoc = printHTML;

            printFrame.addEventListener("load", async function () {
                const printWindow = printFrame.contentWindow;

                // Clean up after printing
                printWindow.addEventListener("afterprint", function () {
                    printFrame.remove();
                }, { once: true });

                printWindow.focus();
                printWindow.print();
            });

            document.body.appendChild(printFrame);

        } catch (error) {
            outputWindow.close();
            console.log(error);
            alert("Sheet generation failed.");
        }
    }
});