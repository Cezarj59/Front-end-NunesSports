// Fazer uma requisição GET para a API
fetch('https://nunes-sports-axl7.onrender.com/products/listar')
    .then(response => response.json())
    .then(data => {
        // Manipular o DOM para exibir os dados
        data.forEach(product => {
            const row = document.createElement('tr');
            row.id = `productRow_${product._id}`; // Adicionar um ID único à linha

            row.innerHTML = `
             <td>${product.nome}</td>
             <td>${product.codigo}</td>
             <td>${product.descricao}</td>
             <td>R$ ${product.preco}</td>
             <td><button class="btn btn-outline-warning btn-sm col-12" onclick="abrirFormularioEdicao('${product._id}')">Editar</button></td>
             <td><button class="btn btn-outline-danger btn-sm col-12" onclick="excluirProduto('${product._id}')">Excluir</button></td>
         `;
            productList.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Erro ao obter dados da API:', error);
    });


// -------------------- Excluir Produto ---------------------------
function excluirProduto(productId) {
    exibirModalConfirmacao(() => {
        fazerRequisicaoExclusao(productId);
    });
}

function exibirModalConfirmacao(confirmCallback) {
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    confirmDeleteModal.show();

    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    confirmDeleteButton.onclick = function () {
        confirmCallback();
        confirmDeleteModal.hide();
    };
}

function fazerRequisicaoExclusao(productId) {
    fetch(`https://nunes-sports-axl7.onrender.com/products/deletar/${productId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Erro ao excluir produto: ${response.statusText}`);
            }
        })
        .then(data => {
            handleRespostaExclusao(data, productId);
        })
        .catch(error => {
            handleErroExclusao(error);
        });
}

function handleRespostaExclusao(data, productId) {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const msgElement = document.getElementById("modal-mensagem");
    msgElement.innerHTML = data.message ? data.message : 'Mensagem não definida';
    successModal.show();

    const rowToDelete = document.getElementById(`productRow_${productId}`);
    if (rowToDelete) {
        rowToDelete.remove();
    }
}

function handleErroExclusao(error) {
    console.error(error.message);
}


// --------------------------- Editar Produto ---------------------------
var editModal = new bootstrap.Modal(document.getElementById('editModal'));


function abrirFormularioEdicao(productId) {
    // Fazer uma requisição GET para a API para obter os detalhes do produto

    fetch(`https://nunes-sports-axl7.onrender.com/products/buscar/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Preencher o modal com os detalhes do produto
            document.getElementById('edit-nome').value = product.nome;
            document.getElementById('edit-codigo').value = product.codigo;
            document.getElementById('edit-descricao').value = product.descricao;
            document.getElementById('edit-preco').value = product.preco;

            // Defina o productId como um atributo do botão de salvar
            document.getElementById('btnSalvarEdicao').dataset.productId = productId;


            editModal.show();
        })
        .catch(error => {
            console.error('Erro ao obter detalhes do produto:', error);
        });
}

function editarProduto() {
    const productId = document.getElementById('btnSalvarEdicao').dataset.productId;
    const dadosProduto = obterDadosProduto();

    enviarRequisicaoAPI(productId, dadosProduto);
}

function obterDadosProduto() {
    const nome = capitalizeFirstLetter(document.getElementById('edit-nome').value);
    const codigo = document.getElementById('edit-codigo').value;
    const descricao = capitalizeFirstLetter(document.getElementById('edit-descricao').value);
    const preco = document.getElementById('edit-preco').value;

    return {
        nome: nome,
        codigo: codigo,
        descricao: descricao,
        preco: preco,
    };
}

function enviarRequisicaoAPI(productId, dadosProduto) {
    fetch(`https://nunes-sports-axl7.onrender.com/products/atualizar/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosProduto),
    })
        .then(response => response.json())
        .then(data => {
            handleRespostaAPI(data);
        })
        .catch(error => {
            handleErroAPI(error);
        });
}

function handleRespostaAPI(data) {
    editModal.hide();
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const msgElement = document.getElementById("modal-mensagem");
    msgElement.innerHTML = data.message ? data.message : 'Mensagem não definida';

    successModal.show();

    const okButton = document.getElementById('ok-button');
    okButton.addEventListener('click', function () {
        location.reload();
    });
}

function handleErroAPI(error) {
    console.error('Erro ao editar produto:', error);
}


function capitalizeFirstLetter(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
}