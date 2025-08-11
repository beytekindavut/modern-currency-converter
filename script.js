




class Currency {
    constructor() {
        this.url = "https://api.freecurrencyapi.com/v1/latest?apikey=DwubsVWBQzrAI1rY529XjbZy1rny84BA3XaIujP0&base_currency=";
    }


    async exchange(amount, firstCurrency, secondCurrency) {

        const response = await fetch(`${this.url}${firstCurrency}`);

        if (!response.ok) throw new Error("API yanıt vermiyor");

        const result = await response.json();

        return {
            value: amount * result.data[secondCurrency],
            date: new Date().toLocaleTimeString()
        };

    }
}



const amountInput = document.querySelector("#amount");
const firstOption = document.querySelector("#firstCurrencyOption");
const secondOption = document.querySelector("#secondCurrencyOption");
const resultInput = document.querySelector("#result");
const swapBtn = document.querySelector("#swapBtn");
const statusText = document.querySelector("#status");

const currency = new Currency();
const currencyList = ["USD","EUR","JPY","GBP","TRY","AUD","CAD","CHF","CNY","NZD"];

// Para birimlerini doldur
currencyList.forEach(cur => {
    firstOption.innerHTML += `<option>${cur}</option>`;
    secondOption.innerHTML += `<option>${cur}</option>`;
});



// LocalStorage'dan son seçimleri yükle
firstOption.value = localStorage.getItem("firstCurrency") || "USD";
secondOption.value = localStorage.getItem("secondCurrency") || "TRY";

// Olaylar
amountInput.addEventListener("input", exchange);

firstOption.addEventListener("change", () => {
    localStorage.setItem("firstCurrency", firstOption.value);
    exchange();
});


secondOption.addEventListener("change", () => {
    localStorage.setItem("secondCurrency", secondOption.value);
    exchange();
});



swapBtn.addEventListener("click", () => {
    const temp = firstOption.value;
    firstOption.value = secondOption.value;
    secondOption.value = temp;
    localStorage.setItem("firstCurrency", firstOption.value);
    localStorage.setItem("secondCurrency", secondOption.value);
    exchange();
});




async function exchange() {
    const amount = Number(amountInput.value.trim());
    if (!amount) {
        resultInput.value = "";
        statusText.textContent = "Lütfen miktar girin";
        return;
    }

    statusText.textContent = "Hesaplanıyor...";
    statusText.classList.add("loading");

    try {
        const { value, date } = await currency.exchange(amount, firstOption.value, secondOption.value);
        resultInput.value = value.toFixed(3);
        statusText.textContent = `Son güncelleme: ${date}`;
    } 
    
    catch (err) {
        statusText.textContent = "Hata: " + err.message;
    }
    
    finally {
        statusText.classList.remove("loading");
    }

}

