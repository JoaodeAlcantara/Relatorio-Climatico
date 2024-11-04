import { CreactTable, getCidade, getEstado, innerHTML, salvarPDF } from "./script.js"

const date = new Date()
const dateFormat = (date).toLocaleDateString("pt-BR")
document.querySelector('input').value = dateFormat
const hrAtual = (date).toLocaleTimeString('pt-br')
document.querySelector('#dt-hr').innerHTML = dateFormat + ' às ' + hrAtual.slice(0, 5)

window.addEventListener('load', () => {
    getEstado()
})

document.querySelector('#estado').addEventListener('change', function () {
    const estado = this.value
    document.querySelector('#estadoTable').innerHTML = ' - ' + estado;
    getCidade(estado)
})

document.querySelector('#cidade').addEventListener('change', async function () {
    const cidade = this.value
    const apiKey = `d5a9f2d2a7a9469d95e140826240211`;
    const divErro = document.querySelector('#erro')

    try {
        const resp = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cidade}&days=1&aqi=yes&alerts=yes&lang=pt`)

        if (!resp.ok) {
            throw new Error(`Erro: ${resp.status} - ${resp.statusText}`)
        }
        const dados = await resp.json()
        
        divErro.classList.add('hyde');

        const air_quality = await dados.current.air_quality;
        const { co, no2, o3, pm2_5, pm10, so2 } = air_quality;
        const gbDefraIndex = air_quality["gb-defra-index"];
        const table = document.querySelector('table');

        innerHTML(co, no2, o3, pm2_5, pm10, so2, gbDefraIndex);

        table.innerHTML = '';
        table.innerHTML =
            `<tr>
            <th>Horário</th>
            <th>Condição</th>
            <th>Chuva (%)</th>
            <th>Temperatura (C°)</th>
            <th>Sensasão (C°)</th>
            <th>Umidade (%)</th>
            <th>Vento (Kph)</th>
        </tr>`;

        dados.forecast.forecastday[0].hour.map(i => {
            const info = new CreactTable(i.time.slice(11, 16),
                i.condition.text, i.chance_of_rain, i.temp_c, i.heatindex_c,
                i.humidity, i.wind_kph);

            table.innerHTML += info.insertInto();
        })
        document.querySelector('#cidadeTable').innerHTML = dados.location.name
        document.querySelector('.table').classList.remove('hyde')

    } catch (error) {
        const msgErro = document.querySelector('#msgErro');
        console.error('Erro ao buscar: ', error.message)
        divErro.classList.remove('hyde');
        document.querySelector('.table').classList.add('hyde')
        msgErro.innerHTML = 'Erro ao buscar', error.statusText
    }
})

const element = document.querySelector('main');
document.querySelector('button').addEventListener('click', () =>{
    salvarPDF(element, 'relario_climatico')
})