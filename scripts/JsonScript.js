document.addEventListener("DOMContentLoaded", () => {

    function collectFormData() {
        const data = {};

        document.querySelectorAll("[data-json]").forEach(element => {
            const key = element.dataset.json;

            if (element.type === "checkbox") {
                data[key] = element.checked;
            }
            else {
                data[key] = element.value;
            }
        });

        data.powerSources = collectPowerSources();
        data.transmissionTypes = collectTransmissionTypes();

        return data;
    }

    function collectPowerSources() {
        const dropdowns = document.querySelectorAll(
            "#powerSourceContainer .power-source-select"
        );

        return Array.from(dropdowns)
            .map(dropdown => dropdown.value)
            .filter(value => value !== "");
    }

    function collectTransmissionTypes() {
        const dropdowns = document.querySelectorAll(
            "#transmContainer .transmission-select"
        );

        return Array.from(dropdowns)
            .map(dropdown => dropdown.value)
            .filter(value => value !== "");
    }

    function saveJson() {
        const locoName = document.getElementById("fieldLocoName").value;
        if (locoName == "") {
            alert("Locomotive name must not be empty.")
            return;
        }

        const data = collectFormData();

        const jsonString = JSON.stringify(data, null, 4);

        const blob = new Blob(
            [jsonString],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = locoName + ".json";

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    }

    document.getElementById("btnExportJson").addEventListener("click", saveJson);

    const loadJsonButton = document.getElementById("btnLoadJson");
    const jsonInput = document.getElementById("jsonFileInput");

    loadJsonButton.addEventListener("click", function () {
        jsonInput.click();
    });

    jsonInput.addEventListener("change", async function () {
        const file = this.files[0];

        if (!file) return;

        const jsonText = await file.text();
        const data = JSON.parse(jsonText);

        applyFormData(data);

        this.value = "";
    });

    function applyFormData(data) {
        document.querySelectorAll("[data-json]").forEach(element => {
            const key = element.dataset.json;

            if (!(key in data)) return;

            if (element.type === "checkbox") {
                element.checked = data[key];
            }
            else {
                element.value = data[key];
            }

            element.dispatchEvent(new Event("change", {
                bubbles: true
            }));
        });

        if (Object.hasOwn(data, 'powerSources')) loadPowerSources(data.powerSources || []);
        if (Object.hasOwn(data, 'transmissionTypes')) loadTransmissions(data.transmissionTypes || []);
    }

    function loadPowerSources(powerSources) {
        const template = document.getElementById("powerSourceTempl");
        const container = document.getElementById("powerSourceContainer");
        container.innerHTML = "";

        powerSources.forEach(value => {
            const entryId = Math.random().toString(36);

            const entry = template.cloneNode(true);
            entry.id = `powerSource-${entryId}`;

            const dropdown = entry.querySelector("#powerSourceSelector");
            dropdown.id = `powerSourceSelector-${entryId}`;

            const del = entry.querySelector("#powerSourceRemove");
            del.id = `powerSourceRemove-${entryId}`;

            dropdown.value = value;

            del.addEventListener("click", function () {
                entry.remove();
            });

            container.appendChild(entry);
        })
    }

    function loadTransmissions(transmissionTypes) {
        const transTemplate = document.getElementById("transTempl");
        const transContainer = document.getElementById("transmContainer");
        transContainer.innerHTML = "";

        transmissionTypes.forEach(value => {
            const entryId = Math.random().toString(36);

            const entry = transTemplate.cloneNode(true);
            entry.id = `transmissionType-${entryId}`;

            const dropdown = entry.querySelector("#transSelector");
            dropdown.id = `transSelector-${entryId}`;

            const del = entry.querySelector("#transRemove");
            del.id = `transRemove-${entryId}`;

            dropdown.value = value;

            del.addEventListener("click", function () {
                entry.remove();
            });

            transContainer.appendChild(entry);
        })
    }
});