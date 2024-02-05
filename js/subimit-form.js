const modalSucesso = new bootstrap.Modal(document.getElementById('modal-info'));

function submitForm() {
    const productData = obterDadosDoFormulario();

    if (validarDadosDoFormulario(productData)) {
        // Continuar com o processamento, por exemplo, cadastrar o produto
        cadastrarProduto(productData);
    }
}

function obterDadosDoFormulario() {
    const nome = capitalizeFirstLetter(document.getElementById('nome').value);
    const codigo = document.getElementById('codigo').value;
    const descricao = capitalizeFirstLetter(document.getElementById('descricao').value);
    const preco = document.getElementById('preco').value;

    return {
        nome: nome,
        codigo: codigo,
        descricao: descricao,
        preco: parseFloat(preco),
    };
}

function validarDadosDoFormulario(productData) {
    const camposObrigatorios = ['nome', 'codigo', 'descricao'];

    for (const campo of camposObrigatorios) {
        if (!productData[campo]) {
            alert(`O campo ${campo} é obrigatório.`);
            return false;
        }
    }

    if (isNaN(productData.preco)) {
        alert(`Por favor, insira um valor de preço válido.`);
        return false;
    }

    return true;
}

function cadastrarProduto(productData) {
    fetch('http://localhost:3001/products/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
        .then(response => response.json())
        .then(data => {
            handleRespostaCadastro(data);
        })
        .catch(error => {
            handleErroCadastro(error);
        });
}

function handleRespostaCadastro(data) {
    const mensagemElement = document.getElementById("modal-mensagem");

    if (data.error) {
        alert(`Erro ao cadastrar produto: ${data.message}`);
    } else {
        modalSucesso.show();
        mensagemElement.innerHTML = data.message;
        limparFormulario();
    }
}

function handleErroCadastro(error) {
    exibirMensagemErro('Erro ao enviar dados. Tente novamente mais tarde.');
    console.error('Erro ao enviar dados:', error);
}

function exibirMensagemErro(mensagem) {
    const mensagemElement = document.getElementById("mensagemErro");
    mensagemElement.innerHTML = mensagem;

    modalErro.show();
}

function limparFormulario() {
    const formulario = document.getElementById('productForm');
    formulario.reset();
}


function capitalizeFirstLetter(inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
}
