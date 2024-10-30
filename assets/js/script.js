// API Key para acessar os dados do OpenWeatherMap
const apiKey = 'f9e8304606e371241a3c49206648d556';

// Seletores DOM 
const cityInput = document.querySelector('#city-input'); // Campo de entrada da cidade
const searchBtn = document.querySelector('#search'); // Botão para buscar o clima

const cityElement = document.querySelector('#city'); // Elemento que exibe o nome da cidade
const tempeElement = document.querySelector('#temperature span'); // Elemento para a temperatura
const descElement = document.querySelector('#description'); // Elemento para a descrição do clima
const weatherIconElement = document.querySelector('#weather-icon'); // Elemento para o ícone do clima
const humidityElement = document.querySelector('#humidity span'); // Elemento para a umidade
const windElement = document.querySelector('#wind span'); // Elemento para a velocidade do vento

const weatherContainer = document.querySelector('#weather-data'); // Container para os dados do clima

const errorMessageContainer = document.querySelector("#error-message"); // Container para mensagens de erro
const loader = document.querySelector("#loader"); // Loader durante a requisição

const suggestionContainer = document.querySelector("#suggestions"); // Container para sugestões de cidades
const suggestionButtons = document.querySelectorAll("#suggestions button"); // Botões de sugestões

// Seletor do botão "Voltar"
const backBtn = document.querySelector('#backBtn'); // Botão para voltar à tela principal

// Função para alternar a visibilidade do loader
const toggleLoader = () => {
    loader.classList.toggle("hide"); // Mostra ou esconde o loader
};

// Função assíncrona para obter os dados do clima
const getWeatherData = async (city) => {
    toggleLoader(); // Mostra o loader antes da requisição

    // URL da API com os parâmetros necessários
    const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;
    
    const res = await fetch(apiWeatherURL); // Faz a requisição à API
    const data = await res.json(); // Converte a resposta em JSON

    toggleLoader(); // Esconde o loader após a requisição

    return data; // Retorna os dados obtidos
}

// Função para mostrar mensagens de erro
const showErrorMessage = () => {
    errorMessageContainer.classList.remove("hide"); // Exibe o container de erro
};

// Função para esconder informações anteriores
const hideInformation = () => {
    errorMessageContainer.classList.add("hide"); // Esconde mensagens de erro
    weatherContainer.classList.add("hide"); // Esconde dados do clima
    suggestionContainer.classList.add("hide"); // Esconde sugestões de cidades
};

// Função para mostrar os dados do clima na tela
const showWeatherData = async (city) => {
    hideInformation(); // Esconde informações anteriores

    const dataShow = await getWeatherData(city); // Obtém os dados do clima

    // Se a cidade não for encontrada, mostra a mensagem de erro
    if (dataShow.cod === "404") {
        showErrorMessage();
        return;
    }

    // Atualiza os elementos da página com os dados do clima
    cityElement.innerHTML = dataShow.name; // Nome da cidade
    tempeElement.innerHTML = parseInt(dataShow.main.temp); // Temperatura em Celsius
    descElement.innerHTML = dataShow.weather[0].description; // Descrição do clima
    weatherIconElement.setAttribute(
        'src',
        `https://openweathermap.org/img/wn/${dataShow.weather[0].icon}.png` // URL do ícone do clima
    );
    humidityElement.innerHTML = `${dataShow.main.humidity}%`; // Umidade
    windElement.innerHTML = `${dataShow.wind.speed}km/h`; // Velocidade do vento

    weatherContainer.classList.remove('hide'); // Exibe os dados do clima
    backBtn.classList.remove('hide'); // Exibe o botão "Voltar"
};

// Função para mostrar a tela principal
const showMainScreen = () => {
    hideInformation(); // Esconde informações anteriores
    cityInput.value = ''; // Limpa o campo de entrada
    suggestionContainer.classList.remove("hide"); // Exibe sugestões de cidades
};

// Adiciona evento ao botão "Voltar"
backBtn.addEventListener('click', () => {
    showMainScreen(); // Volta à tela principal
});

// Eventos e input
searchBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Previna o comportamento padrão do botão

    const city = cityInput.value; // Obtém o valor da cidade
    showWeatherData(city); // Mostra os dados do clima
});

// Evento para capturar a tecla "Enter" no campo de entrada
cityInput.addEventListener('keyup', (e) => {
    if (e.code === "Enter") { // Se a tecla pressionada for "Enter"
        const city = e.target.value; // Obtém o valor da cidade
        showWeatherData(city); // Mostra os dados do clima
    }
});

// Adiciona eventos aos botões de sugestões
suggestionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const city = btn.getAttribute("id"); // Obtém o ID do botão
        showWeatherData(city); // Mostra os dados do clima para a cidade selecionada
    });
});
