var itensApi = new Map();
var idButtonDayPasseioSelecionado;

var itensCarrinho = {
    listItens: [],
    quantidade: (list) => {
        return list.reduce( (soma, {quantidade}) => { return soma + quantidade }, 0);
    },
    valor: () => {
        return itensCarrinho.listItens.reduce( (soma, {quantidade, valorVendaItem}) => { return soma + (quantidade * valorVendaItem) }, 0);
        
    },
    salvarListLocalStorage: () => {
        localStorage.setItem('listItensCarrinho', JSON.stringify(itensCarrinho.listItens));
    },
    getListLocalStorage: () => {
        itensCarrinho.listItens = JSON.parse(localStorage.getItem('listItensCarrinho'));
    }
};

//Loading
window.addEventListener('load', async ()  => {
    if(!localStorage.getItem('listItensCarrinho')){ 
        localStorage.setItem('listItensCarrinho', JSON.stringify([]));
    }
  
    await getApiItens();
    
    changeListCarrinho();

    //Events element body
    document.querySelector('.carrinho-nav').addEventListener('click', backToCarrinhoBody);
    document.querySelector('.float-button').addEventListener('click', scrollTop);
    document.querySelector('#carrinho-body').addEventListener('click', expandedCarrinho);
    document.querySelectorAll('.close-hide-carrinho').forEach( item => item.addEventListener('click', fecharCarrinho));
    window.addEventListener('click', eventCloseCarrinhoExpandedClickBody);
    window.addEventListener('resize', changeTextButtonOutroDia);
    window.addEventListener('scroll', () => positionScroll());
    document.querySelectorAll('.button-day-passeio').forEach(
        buttonsDayPasseio =>
            buttonsDayPasseio.addEventListener('click', () =>  {
                changeButton(buttonsDayPasseio);
            })
    );
});

const changeTextButtonOutroDia = () => {
    document.querySelectorAll('.outro-dia')
        .forEach(
            buttonOutroDia => buttonOutroDia.innerText = (window.innerWidth < 546) ? "Outro dia" : "Comprar para outro dia");
}

const eventCloseCarrinhoExpandedClickBody = (event) => {
    const listOfClass = ['div-carrinho-detalhes', 'carrinho-nav', 'delete-item-carrinho', 'item-svg', 'carrinhos-elements-inside-top'];
    
    if(!listOfClass.some((classe) => event.target.classList.contains(classe)) && (document.querySelector('#carrinho-body').classList.contains('carrinho-body-clicked'))) {
        fecharCarrinho(event);
    }
}

const changeValorAndQtdCarrinho = () => {
    document.querySelectorAll('.span-carrinho-valor')
        .forEach(
            itemHtml => itemHtml.innerText = addVirgula(itensCarrinho.valor()));

    document.querySelectorAll('.quantidade-carrinho')
        .forEach(
            carrinho => carrinho.innerText = itensCarrinho.quantidade(itensCarrinho.listItens));
}

const changeListCarrinho = () => {
    
    changeValorAndQtdCarrinho();

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
        divDiaSelecionado.innerHTML = addDayToCarrinho();


        divPaiHide.appendChild(divDiaSelecionado);    
    
        for(const [index, itemAddCarrinho] of itensCarrinho.listItens.entries()) {
            const div = document.createElement('div');
            div.classList.add('list-itens-carrinho');
            
            div.innerHTML += itemListAddCarrinhoHtml(itemAddCarrinho, index);
            
            divPaiHide.appendChild(div);
        }

        divPaiHide.innerHTML +=  addButtonCarrinhoHtml();
    
    } else{
        itensCarrinho.salvarListLocalStorage(itensCarrinho.listItens);
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

const addButtonCarrinhoHtml = () => {
    return`
            <div class="bottom-carrinho-hide-finalizar-compra">
                <button class="button-carrinho-footer button-carrinho-footer-left">
                    <span class="outro-dia">Comprar para outro dia</span>
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 17px; height: 17px; margin-right: 5px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </button>
                <button name="finalizar-venda" class="button-carrinho-footer button-carrinho-footer-rigth">
                    <span>Finalizar Compra</span>
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="width: 21px; height: 21px; margin-top: 2px;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
            </div>
        `;
} 

const addDayToCarrinho = () => {
    return `
        <span class="dia-selecionado-dia">
            20 de Fevereiro de 2022
        </span>
        <span class="dia-selecionado-text">
            Dia selecionado
        </span>
    `;
}
const itemListAddCarrinhoHtml = ({nome, quantidade, valorVendaItem, iditens}, index) => {
    return `
        <div class="list-itens-carrinho-left">${nome}</div>
        <div class="list-itens-carrinho-rigth">
            <span>${quantidade}x</span>
            <span>R$ ${addVirgula(valorVendaItem)}</span>
            <div class="item-svg">
                <svg id="${index}" name="${iditens}" class="delete-item-carrinho" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <polyline class="item-svg" points="3 6 5 6 21 6"></polyline>
                    <path class="item-svg" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line class="item-svg" x1="10" y1="11" x2="10" y2="17"></line>
                    <line class="item-svg" x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </div>    
        </div>
   
    `;
}

const addVirgula = (valor) =>{
    return (valor == 0) ? '0,00' : (valor/100).toLocaleString('pt-BR', {style:"currency", currency:"BRL"}).split(/\s/)[1];
}   

const eventDeletarItemCarrinho = () => {
    const buttonDelete = document.querySelectorAll('.delete-item-carrinho');

    buttonDelete.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.stopPropagation();

            itensCarrinho.listItens.splice(button.id, 1);

            changeListCarrinho();

            if(!itensCarrinho.listItens.length){
                fecharCarrinho();
            }

            let list = document.querySelectorAll(`[id="${button.getAttribute('name')}"]`);

            if(list){
                list
                    .forEach(item => {
                        if(item.classList.contains('button-card-full')){
                            item.style.display = 'block';
                        } else{
                            item.style.display = 'none';
                            item.classList.remove('pai-button-card-compra-after');
                        }
                    });
            }
        });
    });
}

const eventsButtonCard = () => {
    const divPaiButtonsCard = document.querySelectorAll('.div-card-button-elements');

    for(let i = 0; i < divPaiButtonsCard.length; i++){
        const buttonCardFull = document.querySelectorAll('.button-card-full')[i];
        const buttonCardComprar = document.querySelectorAll('.pai-button-card-compra')[i];
        const buttonCardComprarDireito = document.querySelectorAll('.button-direito')[i];
        const buttonCardComprarEsquerdo = document.querySelectorAll('.button-esquerdo')[i];
        const spanTextQtd = document.querySelectorAll('.span-text')[i];

        buttonCardFull.addEventListener('click', () => {
            //Pesquisar item para adicionar
            for(idGrupo of Object.keys(itensApi)){
                let newItem = itensApi[idGrupo].find(item => item.iditens == buttonCardFull.value);
                
                if(!newItem) continue; //Existe para que se novo item não exista no grupo 1 ele vá procurar no grupo 2 do map
                
                newItem.quantidade = 1;
                itensCarrinho.listItens.push(newItem);
                spanTextQtd.innerText = 1;
                
                break;
            }

            buttonCardComprar.style.display = 'flex';
            buttonCardComprar.classList.add('pai-button-card-compra-after');
            buttonCardFull.style.display = 'none';

            changeListCarrinho();
        });

        buttonCardComprarEsquerdo.addEventListener('click', () => alterarQtdItemCarrinho('retirar', buttonCardComprarEsquerdo, spanTextQtd, buttonCardFull, buttonCardComprar));

        buttonCardComprarDireito.addEventListener('click', () => alterarQtdItemCarrinho('adicionar', buttonCardComprarDireito, spanTextQtd, buttonCardFull, buttonCardComprar));
    }
}

const alterarQtdItemCarrinho = (acao, button, spanTextQtd, buttonCardFull, buttonCardComprar) => {

    let itemSelected = itensCarrinho.listItens.find(item => item.iditens == button.value);

    if(acao === 'retirar'){
        if(itemSelected.quantidade > 1){
            spanTextQtd.innerText = --itemSelected.quantidade; 
        } else{
            itensCarrinho.listItens.splice(itensCarrinho.listItens.indexOf(itemSelected), 1); //Remove o item do array quando chega a 0
            buttonCardFull.style.display = 'block';
            buttonCardComprar.style.display = 'none';
            buttonCardComprar.classList.remove('pai-button-card-compra-after');
        }
    } else if(acao === 'adicionar'){
        spanTextQtd.innerText = (itemSelected.limiteMaximoVenda == null || itemSelected.limiteMaximoVenda > itemSelected.quantidade) ? ++itemSelected.quantidade : itemSelected.quantidade;
    }

    changeListCarrinho();
}

const getApiItens = async () => {

    let listGrupo = [];
    let date = new Date('2022-04-17'); //por algum motivo está tirando -1 do dia criar assim
    let dia = date.getDate();
    let month = date.getMonth() + 1;
    let ano = date.getFullYear();

    const dateNow = `${ano}-${(month < 10 ? "0" : "")}${month}-${dia}`;

    month = date.toLocaleString('default', {month: 'long'});

    document.querySelectorAll('.top-left').forEach(letftCar => {
        letftCar.innerHTML = `
            <div class="dia">
                ${dia}
            </div>
            <div class="separator"></div>
            <div class="mes-ano">
                <div>
                    ${month}
                </div>
                <div>
                    de ${ano}
                </div>
            </div>
        `;
    }); 

    let requestGetItens = new Request(
        `https://sofalta.eu/api/v4/empreendimentos/arcaparque/produtos/ingressos/ingressos?data=${dateNow}`, 
        {
            method: 'GET',
            headers: new Headers()
        }
    );

    try{
        let res = await fetch(requestGetItens);
        if(res){
            let resObject = await res.json();

            if(res.status == 200 && resObject.itens.length > 0) {
                //TurnOf page Load
                document.querySelector('.body-page').style.display = 'flex';
                document.querySelector('.body-page').style.marginTop = '0px';
                document.querySelector('.body-page-load').style.display = 'none';
            } else throw "Data sem ingressos para venda!";     
    
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
    
            itensApi.maximoQtdParcelamento = resObject.maximoQtdParcelamento;
    
            itensCarrinho.getListLocalStorage(itensCarrinho.listItens);
            addGrupoHtml(listGrupo); 
        } else throw "Erro ao carregar dados do servidor!";

    }catch(ex){
        document.querySelector('.body-page-load')
            .innerHTML = `
                            <div> ${ex} </div>
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
            button.classList.add('color-grupo');
        }
    });

    addCards();
}

const addCards = () => {
    document.querySelector('.cards').innerHTML = '';

    itensApi[idButtonDayPasseioSelecionado].forEach(
        item => {
            const itemJaNoCarrinho = itensCarrinho.listItens.find(itemCar => itemCar.iditens == item.iditens);
            
            let idadeAltura; 

            item.itens.produtos.forEach(objectItem => {
                
                let alturaMinima = objectItem['altura_minima'].toString().replace(/(\d{1})(\d{2})/, "$1.$2");
                
                if(objectItem['altura_minima']) idadeAltura = `A partir de ${ alturaMinima ?? ""}m`;
            });

            if(idadeAltura == null){
                item.itens.ingressos
                    .forEach((objectItem) => {
                        if(objectItem['idade_minima'] && objectItem['idade_maxima'])
                            idadeAltura = `${objectItem['idade_minima'] ?? ""} a ${objectItem['idade_maxima'] ?? ""} anos`;
                        else if(objectItem['idade_minima']){
                            idadeAltura = `A partir de ${objectItem['idade_minima'] ?? ""} anos`;
                        } else{
                            idadeAltura = `Idade máxima ${objectItem['idade_maxima'] ?? ""} anos`;
                        }});
            }

            item.limiteMaximoVenda = null;
            item.valorVendaItem = item.tarifarios[0].valor;

            let isValorSameOriginal = (item.valorOriginal === item.valorVendaItem);

            objectCard = {
                isValorSameOriginal: isValorSameOriginal,
                image: item.imagem,
                nome: item.nome,
                valorVendaItem: item.valorVendaItem,
                maximoParcelamento: itensApi.maximoQtdParcelamento,
                descricao: item.descricao,
                idadeAltura: idadeAltura,
                id: item.iditens,
                valorOriginalItem: item.valorOriginal,
                isItemJaNoCarrinho: (itemJaNoCarrinho),
                idButtonAba: idButtonDayPasseioSelecionado,
                quantidadeCarrinho: (itemJaNoCarrinho) ? itemJaNoCarrinho.quantidade : 0,
            };

            const div = document.createElement('div');
            div.classList.add('card');
            div.classList.add('shadow');
            div.innerHTML = cardHtml(objectCard);

            document.querySelector('.cards').appendChild(div);
        }
    );

    eventsButtonCard();
}

const cardHtml = ({id, nome, image, valorVendaItem, maximoParcelamento, isValorSameOriginal, descricao, idadeAltura, isItemJaNoCarrinho, valorOriginalItem, idButtonAba, quantidadeCarrinho}) => {
    return `
            <div class="card-img" value="${idButtonAba}">
                <img class="img-card" src="${image}">
            </div>
            <div class="card-div-corpo">
                <div class="nome-preco">
                <strong>${nome}</strong>
                ${!isValorSameOriginal 
                    ?  `<div class="precos-card"><span class="preco-riscado">R$${addVirgula(valorOriginalItem)}</span>
                            <span class="preco-destaque">
                                <span class="tipo-moeda">R$</span>
                                ${addVirgula(valorVendaItem)}
                            </span>
                        </div>`
                    : `<div class="precos-card"> <span class="preco-destaque">
                            <span class="tipo-moeda">R$</span>${addVirgula(valorVendaItem)}</span>
                            <span class="dividido-em-ate">em até ${maximoParcelamento}x</span>
                    </div>`}
                
                </div>
                <div class="card-descricao">${descricao}</div>
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
                    <button id="${id}" value="${id}" ${isItemJaNoCarrinho ? `style = "display:none"` : `style = "display:block"`} class="button-card-full">Comprar</button>
                    <div id="${id}" ${isItemJaNoCarrinho ? `style = "display:flex"` : `style = "display:none"`} class="pai-button-card-compra pai-button-card-compra-after">
                        <button value="${id}" class="button-card button-card-lateral button-esquerdo">-</button>
                        <span class=" span-text">${quantidadeCarrinho}</span>
                        <button value="${id}" class="button-card button-card-lateral button-direito">+</button>
                    </div>
                </div>
            </div>
           `;
}

const fecharCarrinho = () => {
    const divCarrinhoBody = document.querySelector('[id="carrinho-body"]');
    
    //Animation arrow close
    document.querySelectorAll('.icon-setinha-animation').forEach(arrowicon => arrowicon.style.animationName = 'arrow-down');
       
    if(divCarrinhoBody.classList.contains('carrinho-body-clicked')){
        divCarrinhoBody.classList.remove('carrinho-body-clicked');
        document.querySelector('#carrinho-dentro-hide').setAttribute('style', 'display: none !important'); 
    }           
}

const backToCarrinhoBody = (event) => {
    event.stopPropagation();

    if(!document.querySelector('#carrinho-body').classList.contains('carrinho-body-clicked')){
        expandedCarrinho();
    }

    scrollTop(document.querySelector('.header-page').clientHeight);
}

const changeButton = (buttonSelected) => {
    document.querySelectorAll('.button-day-passeio')
        .forEach(buttonDayPasseio => buttonDayPasseio.classList.remove('color-grupo'));
    
    buttonSelected.classList.add('color-grupo');
    
    idButtonDayPasseioSelecionado = buttonSelected.getAttribute('id');
    
    addCards();
}   

const expandedCarrinho = () => {
    const divCarrinhoBody = document.querySelector('#carrinho-body');
    
    if(!(divCarrinhoBody.classList.contains('carrinho-body-clicked'))){
        divCarrinhoBody.classList.add('carrinho-body-clicked');
        document.querySelectorAll('.icon-setinha-animation').forEach(arrowicon => arrowicon.style.animationName = 'arrow-up');
        document.querySelector('#carrinho-dentro-hide').style.display = 'flex'; 
    } else{
        fecharCarrinho();
    }
}

const positionScroll = () => {
    const scroll = this.scrollY;
    const nav = document.querySelector('.header-page');

    document.querySelector('.float-button').style.display = (scroll < nav.clientHeight )? 'none' : 'flex';
    document.querySelector('#carrinho-body').style.opacity = (scroll < nav.clientHeight + 50 )? '1' : '0.3';
    document.querySelector('.carrinho-nav').style.top = (scroll < nav.clientHeight + 10 )? '-90px' : '0px';
}

const scrollTop = (topDistance = 0) => {
    window.scroll({
        top: topDistance,
        behavior: "smooth"
    });
}