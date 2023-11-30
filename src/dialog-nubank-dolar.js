
/**
 * refs:
 * 	- https://awmpietro.github.io/dolar-nubank/
 *  - https://blog.nubank.com.br/qual-valor-do-iof
 *  - https://blog.nubank.com.br/nubank-trava-dolar-no-dia-do-gasto
 *  - https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/documentacao
 *  - https://devhints.io/wip/intl-datetime
 *  - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
 *  - 
 */

const BLOCK_NAME = "dialog-nubank-dolar";

const removeItself = () => {
  let e = document.querySelector("#" + BLOCK_NAME);
  e.parentNode.removeChild(e);
  e = null;
};

if (document.querySelector("#" + BLOCK_NAME)) {
  removeItself();
} else {

  const CONFIGS = {
    spread: 4 / 100,
    iof: {
      2023: 5.38 / 100,
      2024: 4.38 / 100,
      2025: 3.38 / 100,
      2026: 2.38 / 100,
      2027: 1.38 / 100,
      2028: 0
    },
    ptax_dolar: false
  };

  const updatePtaxDolarValue = (value) => {
    CONFIGS.ptax_dolar = value;
    window.bookmarklet_ptax_dolar = CONFIGS.ptax_dolar;

    // update interface
    e.querySelector("#dolar-consulta").textContent = value.dataHoraCotacao;
    e.querySelector("#dolar-venda").textContent = value.cotacaoVenda.toLocaleString("pt-BR", {minimumFractionDigits: 4, style: "currency", currency: "BRL"});
    e.querySelector("#dolar-compra").textContent = value.cotacaoCompra.toLocaleString("pt-BR", {minimumFractionDigits: 4, style: "currency", currency: "BRL"});
    // toggle fieldset
    e.querySelector("#dolar-info").classList.remove('d-none');

    if (initialValue) {
      processConversion(initialValue);
    }
  }

  const callBcbApi = (daysFromValid) => {
    // cache it for the current tab/site, so it hits the api less
    if (window.bookmarklet_ptax_dolar) {
      updatePtaxDolarValue(window.bookmarklet_ptax_dolar);
      return;
    }

    let validDate = new Date(); // starts at today
    validDate.setDate(validDate.getDate() - daysFromValid); // starts at 0

    const [month, day, year] = new Intl.DateTimeFormat('en-US').format(validDate).split('/');
    let valid_date_month_first = `${month}-${day}-${year}`;

    let bcbApiLink = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${valid_date_month_first}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`;
    let request = new XMLHttpRequest();
    request.open("GET", encodeURI(bcbApiLink), true);
    request.responseType = 'json';
    request.onreadystatechange = () => {
      let done = 4, ok = 200;
      if (request.readyState == done && request.status == ok) {
        /*
        {
          "@odata.context": "https://was-p.bcnet.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata$metadata#_CotacaoDolarDia(cotacaoCompra,cotacaoVenda,dataHoraCotacao)",
          "value": []
        }

        {
          "@odata.context": "https://was-p.bcnet.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata$metadata#_CotacaoDolarDia(cotacaoCompra,cotacaoVenda,dataHoraCotacao)",
          "value": [
            {
              "cotacaoCompra": 4.8927,
              "cotacaoVenda": 4.8933,
              "dataHoraCotacao": "2023-11-29 13:09:28.279"
            }
          ]
        }
        */
        if (request.response.value.length === 0) {
          daysFromValid = daysFromValid + 1;
          if (daysFromValid < 3) callBcbApi(daysFromValid); // cap at 3 to prevent spamming the api
        } else {
          updatePtaxDolarValue(request.response.value[0]);
        }
      }
    };
    request.send(null);
  }

  const calcularValorFinal = (valor_usd) => {
    let bruto = valor_usd * CONFIGS.ptax_dolar.cotacaoVenda || 0;
    let spread = bruto * CONFIGS.spread;
    let base = bruto + spread;
    let iofPercent = CONFIGS.iof[new Date().getFullYear()] || 0;
    let iof = base * iofPercent;
    return base + iof;
  }

  // @twing-include {% include 'building_blocks/shared/partials/get-selected-text.js' %}

  const selectedText = getSelectedText();
  const getNumbersOnly = (text) => {
    return parseFloat(text.replace(/[^\d\.\,\s]*/g, ''));
  }
  let initialValue = getNumbersOnly(selectedText) || '';

  let e = document.createElement("dialog");
  e.id = BLOCK_NAME;

  e.innerHTML = `
    <style>
      #${BLOCK_NAME} {
        font-size: 16px;
        border-radius: 5px;
        border: 3px solid #4d646f;
        position: fixed;
        padding: 0;
        margin: auto;
        font-family: sans-serif;
        text-align: center;
      }
      #${BLOCK_NAME} a {
        all: unset;
        color: blue;
        text-decoration: underline;
        cursor: pointer;
      }
      #${BLOCK_NAME}:before {
        display: block;
        padding: .5em .75em;
        background-color: #607D8B;
        text-align: left;
        color: #fff;
        content: "${BLOCK_NAME}";
        font-size: .75em;
      }

      /* required to overwrite default website font-family */
      #${BLOCK_NAME} * {
        font-family: sans-serif;
        box-sizing: border-box;
      }

      #${BLOCK_NAME} button {
        background-clip: padding-box;
        background-color: #607D8B;
        border-radius: 3px;
        border: none;
        box-shadow: inset 0 -4px rgba(0,0,0,0.2);
        box-sizing: border-box;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        font-size: .75em;
        font-weight: 600;
        line-height: 30px;
        margin: .25em;
        overflow: hidden;
        padding: 0 1.5em;
        text-align: center;
        text-decoration: none;
        text-transform: uppercase;
        vertical-align: middle;
        white-space: nowrap;
      }

      #${BLOCK_NAME} input {
        color: #262626;
        font-size: 16px;
        line-height: 20px;
        min-height: 28px;
        border-radius: 4px;
        padding: 8px 16px;
        border: 2px solid transparent;
        box-shadow: rgb(0 0 0 / 12%) 0px 1px 3px, rgb(0 0 0 / 24%) 0px 1px 2px;
        background: rgb(251, 251, 251);
        transition: all 0.1s ease 0s;
      }

      #${BLOCK_NAME} input:focus {
        border: 2px solid #607D8B;
      }

      #${BLOCK_NAME} .close-bookmarklet {
        position: absolute;
        top: .25em;
        right: .25em;
        padding: .25em .75em;
        cursor: pointer;
        color: #fff;
        font-weight: bolder;
        font-size: .75em;
        background-color: rgba(0,0,0,.1);
        border-radius: 3px;
      }

      #${BLOCK_NAME} input {
        min-width: 150px;
        max-width: 200px;
        width: ${initialValue.length}ch;
        display: block;
      }

      #${BLOCK_NAME} #main-form {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #${BLOCK_NAME} #main-form button {
        line-height: 40px;
        margin: 0 10px !important;
      }

      #${BLOCK_NAME} fieldset {
        border: 1px solid #90a4ae;
        border-radius: 4px;
        padding: 1em;
        margin-bottom: 1em;
      }
      
      #${BLOCK_NAME} legend {
        border: 1px solid #90a4ae;
        border-radius: 4px;
        padding: .25em .725em;
        font-weight: 600;
        text-transform: uppercase;
        font-size: .875em;
      }

      #${BLOCK_NAME} strong {
        font-weight: bold;
      }
      #${BLOCK_NAME} .d-none {
        display: none;
      }
      #${BLOCK_NAME} .d-inline-block {
        display: inline-block;
      }
      #${BLOCK_NAME} .d-block {
        display: block;
      }
      #${BLOCK_NAME} .d-flex {
        display: flex;
      }
    </style>

    <span
      class="close-bookmarklet" id="close" aria-label="close" formnovalidate>
      close
    </span>

    <div style="padding: 16px">
      <fieldset>
        <legend>Taxas cobradas pelo Nubank (cartão crédito)</legend>
        <span>Taxa de spread: <strong>${CONFIGS.spread * 100}%</strong></span><br>
        <span>IOF (${new Date().getFullYear()}): <strong>${(CONFIGS.iof[new Date().getFullYear()] || 0) * 100}%</strong></span><br>
        <span>
          <a href="https://nubank.com.br/taxas-conversao/" target="_blank" rel="noopener noreferrer">
            Dólar PTAX Venda (média)
          </a>
        </span><br>
        <small>* taxa conversão = Cotação venda PTAX + 4% spread</small>
      </fieldset>

      <form id="main-form" style="margin:1em 0;padding:0">
        <input type="text" placeholder="USD" id="initial-value" value="${initialValue}"/>
        <button type="submit">CALCULAR >></button>
        <input type="text" placeholder="BRL" disabled id="final-value" value="${initialValue}"/>
      </form>
      
      <fieldset id="dolar-info" class="d-none">
        <legend>Cotação dólar PTAX</legend>
        <span>Data e hora da consulta: <strong><span id="dolar-consulta"></span></strong></span><br>
        <span>Cotação venda: <strong><span id="dolar-venda"></span></strong></span><br>
        <span>Cotação compra: <strong><span id="dolar-compra"></span></strong></span>
      </fieldset>
    </div>
  `;

  document.body.append(e);
  
  callBcbApi(0);

  function processConversion (value) {
    const valorFinal = calcularValorFinal(value);
    e.querySelector("#final-value").value = valorFinal.toLocaleString("pt-BR", {minimumFractionDigits: 2, style: "currency", currency: "BRL"})
    let initInput = e.querySelector("#initial-value");
    initInput.focus();
    initInput.select();
  }

  e.querySelector("#main-form").addEventListener('submit', function (ev) {
    ev.preventDefault();
    const inputContent = ev.target[0].value;
    processConversion(inputContent);
  });

  e.addEventListener('close', function onClose() {
    removeItself();
  });

  e.querySelector('#close').addEventListener('click', () => {
    removeItself();
  });

  if (typeof e.showModal === "function") {
    e.showModal();
  } else {
    alert("Sorry, the <dialog> element is not supported by this browser.");
  }

}
