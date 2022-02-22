var itensCarrinho = {
    listItens: [],
    quantidade: () => {
        
        let total = 0;
        itensCarrinho.listItens.forEach(item => total += item.quantidade);
        
        return total;
    },
    valor: () => {
        let valor = 0.00;

        itensCarrinho.listItens.forEach(item => valor += item.quantidade * item.tarifarios[0].valor);

        return valor;
        
    },
    salvarListLocalStorage: () => {
        localStorage.setItem('listItensCarrinho', JSON.stringify(itensCarrinho.listItens));
    },
    getListLocalStorage: () => {
        itensCarrinho.listItens = JSON.parse(localStorage.getItem('listItensCarrinho'));
    }
};
var itensApi = new Map();
let idButtonDayPasseioSelecionado;
window.addEventListener('load', async ()  => {
    //consumo da API
    await getApiItens();

    //Elements
    const floatButton = document.querySelector('.float-button');
    const divCarrinho = document.querySelector('.carrinho-pai');
    const divCarrinhoNav = document.querySelector('.carrinho-nav');
    const divCarrinhoBody = document.querySelector('#carrinho-body');
    const divCarrinhoBodyHideDiv = document.querySelector('#carrinho-dentro-hide');
    const closeDiv = document.querySelector('.div-close-carrinho-body');
    const arrowiconAll = document.querySelectorAll('.icon-setinha-animation');
    const buttonsDayPasseio = document.querySelectorAll('.button-day-passeio');

    //Events
    divCarrinhoNav.addEventListener('click', (e) => backToCarrinhoBody(divCarrinhoBody, divCarrinhoBodyHideDiv, closeDiv, arrowiconAll, e));
    floatButton.addEventListener('click', scrollTop);
    divCarrinhoBody.addEventListener('click', (e) => changeClass(divCarrinhoBody, divCarrinhoBodyHideDiv, closeDiv, arrowiconAll, e));
    
    closeDiv.addEventListener('click', (e) => {
        closeDiv.style.display = 'none';
        fechar(e, divCarrinhoBody, divCarrinhoBodyHideDiv, arrowiconAll);
    });
    
    buttonsDayPasseio.forEach(element => {
        element.addEventListener('click', () =>  {
            changeButton(element, buttonsDayPasseio);
        })
    });
    
    changeListCarrinho();

    window.addEventListener('scroll', () => positionScroll(floatButton, divCarrinho, divCarrinhoNav));

});

const changeValorAndQtdCarrinho = () => {
    document.querySelectorAll('.span-carrinho-valor')
    .forEach(
        itemHtml => {
            itemHtml.innerText = addVirgula(itensCarrinho.valor());
        } 
    );

    document.querySelectorAll('.quantidade-carrinho').forEach(
        
        carrinho => carrinho.innerText = itensCarrinho.quantidade()
    );

    
}

const precoIngresso = () => {
    
}

const changeListCarrinho = () => {
    
    changeValorAndQtdCarrinho();    
    //[id="${button.getAttribute('name')}"]
    const buttonsFinalizarVenda = document.querySelectorAll('[name = "finalizar-venda"]');
    const divPaiHide = document.querySelector('#carrinho-dentro-hide');
    divPaiHide.innerHTML = "";
    

    if(itensCarrinho.listItens.length > 0){
        itensCarrinho.salvarListLocalStorage();
        buttonsFinalizarVenda.forEach(btnFinalizarVenda => {
            btnFinalizarVenda.classList.add('button-carrinho-footer-rigth');
        });

        const divDiaSelecionado = document.createElement('div');
        divDiaSelecionado.classList.add('dia-selecionado');
        divDiaSelecionado.innerHTML = 
        `
        <span class="dia-selecionado-dia">
            20 de Fevereiro de 2022
        </span>
        <span class="dia-selecionado-text">
            Dia selecionado
        </span>
        `;

        divPaiHide.appendChild(divDiaSelecionado);
    
        
    
        for(const [index, item] of itensCarrinho.listItens.entries()) {
            const div = document.createElement('div');
            div.classList.add('list-itens-carrinho');
    
            div.innerHTML += 
            `
            <div class="list-itens-carrinho-left">${item.nome}</div>
            <div class="list-itens-carrinho-rigth">
                <span>${item.quantidade}x</span>
                <span>R$ ${addVirgula(item.tarifarios[0].valor)}</span>
                <svg id="${index}" name="${item.iditens}" class="delete-item-carrinho" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
           
            `
            divPaiHide.appendChild(div);
        
        }

            divPaiHide.innerHTML += 
            `
            <div class="bottom-carrinho-hide-finalizar-compra">
                <button class="button-carrinho-footer button-carrinho-footer-left">
                    <span>Comprar para outro dia</span>
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 17px; height: 17px; margin-right: 5px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </button>
                <button name="finalizar-venda" class="button-carrinho-footer button-carrinho-footer-rigth">
                    <span>Finalizar Compra</span>
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 21px; height: 21px; margin-top: 2px;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
            </div>
            `;
    
    } else{
        itensCarrinho.salvarListLocalStorage();
        const div = document.createElement('div');
        div.classList.add('nenhum-item-selecionado');
        div.innerText = "Nenhum produto adicionado ao carrinho";
        
        divPaiHide.appendChild(div);
    }
   
    eventDeletarItemCarrinho();

    if(itensCarrinho.listItens.length == 0) {
        buttonsFinalizarVenda.forEach(btnFinalizarVenda => {
            btnFinalizarVenda.classList.remove('button-carrinho-footer-rigth');
        });
    }

}

const addVirgula = (valor) =>{

    let valorToString = valor.toString();

    //
    let position = valorToString.length - 2;

    return (valor == 0) ? '0,00' : valorToString.substring(0, position) + ',' + valorToString.substring(position);
}   

const eventDeletarItemCarrinho = () => {
    const buttonDelete = document.querySelectorAll('.delete-item-carrinho');

    buttonDelete.forEach(button => {
        button.addEventListener('click', () => {
            itensCarrinho.listItens.splice(button.id, 1);
            changeListCarrinho();

            let list = document.querySelectorAll(`[id="${button.getAttribute('name')}"]`);

            if(list)
            list.forEach(item => {
                if(item.classList.contains('button-card-full')){
                    item.style.display = 'block';
                } else{
                    item.style.display = 'none';
                    item.classList.remove('pai-button-card-compra-after');
                }
            });
        });
    });
}

const eventsButtonCard = () => {
    const buttonCardFull = document.querySelectorAll('.button-card-full');
    const buttonCardComprar = document.querySelectorAll('.pai-button-card-compra');
    const buttonCardComprarDireito = document.querySelectorAll('.button-direito');
    const buttonCardComprarEsquerdo = document.querySelectorAll('.button-esquerdo');
    const buttonCardComprarMeio = document.querySelectorAll('.button-meio');

    

    let keysMap = Object.keys(itensApi);

    for(let i = 0; i < buttonCardFull.length; i++){
        let button = buttonCardFull[i];
        button.addEventListener('click', () => {
            for(idGrupo of keysMap){
                let haveItem = itensCarrinho.listItens.find(item => item.iditens == button.value);
                if(!haveItem){
                    let newItem = itensApi[idGrupo].find(item => item.iditens == button.value);
                    if(!newItem) continue;
                    newItem['quantidade'] = 1;
                    itensCarrinho.listItens.push(newItem);
                    break;
                } 
            }

            buttonCardComprar[i].classList.add('pai-button-card-compra-after');
            button.style.display = 'none';
            buttonCardComprar[i].style.display = 'flex';
            
            itemAdd = itensCarrinho.listItens.find(item => item.iditens == button.value);
            buttonCardComprarMeio[i].innerText = itemAdd.quantidade;

            changeListCarrinho();
        });
    }

    for(let i = 0; i < buttonCardComprarEsquerdo.length; i++){
        let button = buttonCardComprarEsquerdo[i];

        button.addEventListener('click', () => {

            let item = itensCarrinho.listItens.find(item => item.iditens == button.value);
            if(item.quantidade > 0){
                item.quantidade -= 1;
                buttonCardComprarMeio[i].innerText = item.quantidade; 

            }
            
            if(item.quantidade <= 0){

                itensCarrinho.listItens.splice(itensCarrinho.listItens.indexOf(item), 1);
                buttonCardFull[i].style.display = 'block';
                buttonCardComprar[i].style.display = 'none';
                buttonCardComprar[i].classList.remove('pai-button-card-compra-after');
            }

            changeListCarrinho();
        });
    }

    for(let i = 0; i < buttonCardComprarDireito.length; i++){
        let button = buttonCardComprarDireito[i];

        button.addEventListener('click', () => {

            let item = itensCarrinho.listItens.find(item => item.iditens == button.value);
            item.quantidade++;
            buttonCardComprarMeio[i].innerText = item.quantidade;      
            changeListCarrinho();  
        });

    }
}


const getApiItens = async (key) => {

    let listGrupo = [];
    let date = new Date();
    let dia = '27';
    let month = date.getMonth() + 1;
    let ano = date.getFullYear();

    listMonths = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const dateNow = `${date.getFullYear()}-${(month < 10 ? "0" : "")}${month}-${dia}`;
    document.querySelectorAll('.top-left').forEach(letftCar => {
        letftCar.innerHTML = `
            <div class="dia">
                ${dia}
            </div>
            <div class="separator"></div>
            <div class="mes-ano">
                <div>
                    ${listMonths[month - 1]}
                </div>
                <div>
                    de ${ano}
                </div>
            </div>
        `;
    }); 

    var requestGetItens = new Request(
        `https://sofalta.eu/api/v4/empreendimentos/arcaparque/produtos/ingressos/ingressos?data=${dateNow}`, 
        {
            method: 'GET',
            headers: new Headers()
        }
    );

    try{
        //console.time("paozinho de queijo");
        let res = await fetch(requestGetItens);
        let resObject = await res.json();

        console.log("?? " + resObject.itens)
        if(res.status == 200 && resObject.itens.length > 0) {
            //TurnOf page Load
            document.querySelector('.body-page').style.display = 'flex';
            document.querySelector('.body-page').style.marginTop = '0px';
            document.querySelector('.body-page-load').style.display = 'none';
        }  else
            throw Exception("Erro ao carregar dados do servidor!"); 

        //console.timeEnd("paozinho de queijo");
        
        for(grupo of resObject.grupos) {
            listGrupo.push(grupo);
            itensApi[grupo.id] = [];
            
            for(itensCard of resObject.itens) {   
                if(itensCard.grupos.includes(grupo.id))
                    itensApi[grupo.id].push(itensCard);
            }
            
            itensApi[grupo.id].sort((item1, item2) => {
                if(item1[grupo.id] < item2[grupo.id]) return 1;
                else if(item1[grupo.id] > item2[grupo.id]) return -1;

                return 0;
            });
            
        }
        await itensCarrinho.getListLocalStorage();
        addGrupoHtml(listGrupo);

    }catch(e){
        document.querySelector('.body-page-load').innerHTML = `
                <div> Erro ao carregar dados do servidor! </div>
            `;
    }
}

const addGrupoHtml = (listGrupo) => {
    listGrupo.forEach((grupo, index) => {
        const button = document.createElement('button');
        button.classList.add('button-day-passeio');
        button.innerText = grupo.nome;
        button.setAttribute('id', grupo.id);
        document.querySelector('.day-passeio').appendChild(button);
        
        if(index == 0){
            idButtonDayPasseioSelecionado = button.getAttribute('id');
            button.style.borderBottom = '3px solid #0c62ad';
        }
    });

    addCardHtml();
}

const addCardHtml = () => {
    document.querySelector('.cards').innerHTML = '';
    itensApi[idButtonDayPasseioSelecionado].forEach(
        item => {
            let itemJaNoCarrinho = itensCarrinho.listItens.find(itemCar => itemCar.iditens == item.iditens);
            
            if(itemJaNoCarrinho);
            
            let idadeAltura; 

            item.itens.produtos.forEach(objectItem => {
                let alturaMinima = objectItem['altura_minima'].toString().replace(/(\d{1})(\d{2})/, "$1.$2");
                if(objectItem['altura_minima'])
                    idadeAltura = `A partir de ${ alturaMinima ?? ""}m`;
            });

            if(idadeAltura == null)
                item.itens.ingressos.forEach((objectItem) => {
                    if(objectItem['idade_minima'] && objectItem['idade_maxima'])
                        idadeAltura = `${objectItem['idade_minima'] ?? ""} a ${objectItem['idade_maxima'] ?? ""} anos`;
                    else if(objectItem['idade_minima']){
                        idadeAltura = `A partir de ${objectItem['idade_minima'] ?? ""} anos`;
                    } else{
                        idadeAltura = `Idade máxima ${objectItem['idade_maxima'] ?? ""} anos`;
                    }
                });
            
            const div = document.createElement('div');
            div.classList.add('card');
            div.classList.add('shadow');
            div.innerHTML = `
    
            <div class="card-img" value="${idButtonDayPasseioSelecionado}">
                <img class="img-card" src="${item.imagem}">
            </div>
            <div class="card-div-corpo">
                <div class="nome-preco">
                    <span>${item.nome}</span>
                    <span>${item.valorOriginal ?? ""}</span>
                </div>
                <div class="descricao">${item.descricao}</div>
            </div>
            <div class="termos">
                <div>
                    <svg class="icon-termos" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    <span>${idadeAltura}</span>
                </div>
                <div>
                    <svg class="icon-termos" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span>Regras e condições</span>
                </div>
            </div>
            <div class="card-div-button">
               
               <div class="div-card-button-elements">
                <button id="${item.iditens}" value="${item.iditens}" ${itemJaNoCarrinho ? `style = "display:none"` : `style = "display:block"`} class="button-card-full">Comprar</button>
                <div id="${item.iditens}" ${itemJaNoCarrinho ? `style = "display:flex"` : `style = "display:none"`} class="pai-button-card-compra pai-button-card-compra-after">
                    <button value="${item.iditens}" class="button-card button-card-lateral button-esquerdo">-</button>
                    <span class=" button-meio">${itemJaNoCarrinho ? itemJaNoCarrinho.quantidade : '0'}</span>
                    <button value="${item.iditens}" class="button-card button-card-lateral button-direito">+</button>
                </div>
               </div>
            </div>
        
            `;
            document.querySelector('.cards').appendChild(div);
        });


        

    eventsButtonCard();
}

const fechar = (e, divCarrinhoBody, divCarrinhoBodyHideDiv, arrowiconAll) => {
    const have = divCarrinhoBody.classList.contains('carrinho-body-clicked');
    arrowiconAll.forEach (arrowicon => arrowicon.style.animationName = 'arrow-down');
    if(!(e.target.classList.contains('carrinho-element')) && have){
        divCarrinhoBody.classList.remove('carrinho-body-clicked');
        divCarrinhoBodyHideDiv.setAttribute('style', 'display: none !important'); 
    }
}

const backToCarrinhoBody = (divCarrinhoBody, divCarrinhoBodyHideDiv, closeDiv, arrowiconAll, e) => {
    const scroll = this.scrollY;
    const nav = document.querySelector('.header-page');

    changeClass(divCarrinhoBody, divCarrinhoBodyHideDiv, closeDiv, arrowiconAll, e);

    scrollTop(nav.clientHeight);
}

const changeButton = (element, buttonsDayPasseio) => {
    buttonsDayPasseio.forEach(element => element.style.border = 'none');
    element.style.borderBottom = '3px solid #0c62ad';
    idButtonDayPasseioSelecionado = element.getAttribute('id');
    addCardHtml();
}   

const changeClass = ( divCarrinhoBody, divCarrinhoBodyHideDiv, closeDiv, arrowiconAll, e) => {
    const notHave = !divCarrinhoBody.classList.contains('carrinho-body-clicked');

    if(notHave){
        divCarrinhoBody.classList.add('carrinho-body-clicked');
        if(closeDiv != null) closeDiv.style.display = 'block';
        arrowiconAll.forEach (arrowicon => arrowicon.style.animationName = 'arrow-up');
        divCarrinhoBodyHideDiv.style.display = 'flex'; 
    } else{
        fechar(e, divCarrinhoBody, divCarrinhoBodyHideDiv, arrowiconAll);
    }

   
}

const positionScroll = (floatButton, divCarrinho, divCarrinhoNav) => {
    const scroll = this.scrollY;
    const nav = document.querySelector('.header-page');

    floatButton.style.display = (scroll < nav.clientHeight )? 'none' : 'flex';
    divCarrinho.style.opacity = (scroll < nav.clientHeight + 50 )? '1' : '0.3';
    divCarrinhoNav.style.top = (scroll < nav.clientHeight + 10 )? '-90px' : '0px';
    
}

const scrollTop = (top = 0) => {
    window.scroll({
        top: top,
        behavior: "smooth"
    });
}