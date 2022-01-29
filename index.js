// const axios = require("axios").default;

const makeOptions = function (term) {
    return {
        method: 'GET',
        url: 'https://www.air-port-codes.com/api/v1/autocomplete',
        headers: {
            'APC-Auth': '43fe8f3302',
            'APC-Auth-Secret': 'fb0903ef7610ed6'
        },
        params: {
            term: term,
            limit: 5
        }
    }
}

async function findByTerm(term) {
    if (term.length > 20) {
        return []
    }
    const response = await axios.request(makeOptions(term))
    return response.data['airports'] || []
}

function debounce(callee, timeoutMs) {
    return function perform(...args) {
        let previousCall = this.lastCall;
        this.lastCall = Date.now();
        if (previousCall && this.lastCall - previousCall <= timeoutMs) {
            clearTimeout(this.lastCallTimer);
        }

        this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
    };
}

async function onInputChanged() {
    console.log('changed ' + document.getElementById('airport').value)
    const airports = await findByTerm(document.getElementById('airport').value)
    const datalist = document.getElementById('airports');
    while (datalist.firstChild) {
        datalist.removeChild(datalist.firstChild)
    }
    airports.forEach(airport => {
        const newOptionElement = document.createElement("option");
        newOptionElement.textContent = `${airport.name}, ${airport.city}, ${airport.iata}`;
        datalist.appendChild(newOptionElement);
    })
    datalist.focus()
}

const debouncedInputChange = debounce(onInputChanged, 1000)
