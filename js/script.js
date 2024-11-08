export class CreactTable {
    constructor(hr, cond, chuva, temp, sens, umi, vento) {
        this.hr = hr
        this.condicao = cond
        this.chuva = chuva
        this.temperatura = temp
        this.sensacao = sens
        this.umidade = umi
        this.vento = vento
    }

    insertInto() {
        const line =
        `<tr>
            <td>${this.hr}</td>
            <td>${this.condicao}</td>
            <td>${this.chuva}</td>
            <td>${this.temperatura}</td>
            <td>${this.sensacao}</td>
            <td>${this.umidade}</td>
            <td>${this.vento}</td>
        </tr>`
        return line
    }
}

export function getDate() {
    const date = new Date()
    const dateFormat = (date).toLocaleDateString("pt-BR")
    document.querySelector('input').value = dateFormat
    const hrAtual = (date).toLocaleTimeString('pt-br')
    document.querySelector('#dt-hr').innerHTML = dateFormat + ' às ' + hrAtual.slice(0, 5)
}

export async function getEstado() {
    const resp = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    const dados = await resp.json()
    const selectEstado = document.querySelector('#estado');

    dados.map(i => {
        selectEstado.innerHTML += `<option value="${i.sigla}" id='opE'>${i.nome}</option>`
    })
}

export async function getCidade(estado) {
    const selectCidade = document.querySelector('#cidade');
    selectCidade.innerHTML = ''
    selectCidade.innerHTML += `<option value="#">Selecione uma cidade</option>`;
    const resp = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
    const dados = await resp.json()

    dados.map(i => {
        selectCidade.innerHTML += `<option value="${i.nome}">${i.nome}</option>`;
    })
}

export async function salvarPDF(elemento, filename = 'arquivo') {
    const options = {
        margin: [10, 10, 14, 10],
        filename: filename + ".pdf",
        image: { type: 'png', quality: 1 },
        html2canvas: { scale: 1 },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'landscape',
        }
    }
    html2pdf().set(options).from(elemento).save()
}

export function innerHTML(co, no2, o3, pm2_5, pm10, so2, gbDefraIndex) {
    const qAr = document.querySelector('#qualidadeAr');

    if (gbDefraIndex >= 1 && gbDefraIndex <= 3) {
        qAr.innerHTML = 'Boa'
        qAr.style.backgroundColor = 'green';
    } else if (gbDefraIndex > 3 && gbDefraIndex <= 6) {
        qAr.innerHTML = 'Moderada'
        qAr.style.backgroundColor = 'orange';
    } else if (gbDefraIndex > 6 && gbDefraIndex <= 9) {
        qAr.innerHTML = 'Alta'
        qAr.style.backgroundColor = 'orangered';
    } else if (gbDefraIndex > 9) {
        qAr.innerHTML = 'Muito Alta'
        qAr.style.backgroundColor = 'red';
    } else {
        qAr.innerHTML = '---'
        qAr.style.backgroundColor = 'gray'
    }

    const info = document.querySelectorAll('.dados');
    const [infoCo, infoNo2, infoO3, infoPm2_5, infoPm10, infoSo2] = info;
    infoCo.innerHTML = '<i>co: </i>' + co;
    infoNo2.innerHTML = '<i>no2: </i>' + no2;
    infoO3.innerHTML = '<i>o3: </i>' + o3;
    infoPm2_5.innerHTML = '<i>pm2_5: </i>' + pm2_5;
    infoPm10.innerHTML = '<i>pm10: </i>' + pm10;
    infoSo2.innerHTML = '<i>so2: </i>' + so2;
}