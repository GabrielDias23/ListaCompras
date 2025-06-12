const tela_nome = document.getElementById("tela_nome");
const input_nome = document.getElementById("input_nome");
const btn_iniciar = document.getElementById("btn_add_nome");
const container = document.getElementById("container");
const mensagem_nome = document.getElementById("mensagem_nome");

// Elementos da lista
const lista_compras = document.getElementById("lista_compra");
const input_item = document.getElementById("input_item");
const btn_add_item = document.getElementById("btn_add_item");
const contador = document.getElementById("contador");

let nome_usuario;
let itens = [];

// Iniciar app
btn_iniciar.onclick = () => {
    nome_usuario = input_nome.value.trim();
    if (nome_usuario === "") {
        alert("Digite seu nome!");
        input_nome.focus();
        return;
    }
    tela_nome.style.display = "none";
    container.classList.remove("hidden");
    mensagem_nome.textContent = `Bem-vindo, ${nome_usuario}! Monte sua lista de compras:`;
};

// Adicionar item
btn_add_item.onclick = () => {
    const nome_item = input_item.value.trim();
    if (nome_item.length < 3) {
        alert("Digite um item válido (mínimo 3 letras).");
        input_item.focus();
        return;
    }

    itens.push({ nome: nome_item, comprado: false });
    input_item.value = "";
    atualizarLista();
};

// Atualizar visual da lista
function atualizarLista() {
    lista_compras.innerHTML = "";

    itens.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "item";
        li.setAttribute("draggable", "true");
        li.dataset.index = index;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.comprado;
        checkbox.onchange = () => {
            item.comprado = checkbox.checked;
            atualizarContador();
        };

        const span = document.createElement("span");
        span.textContent = item.nome;
        if (item.comprado) span.classList.add("comprado");

        const remover = document.createElement("button");
        remover.textContent = "🗑️";
        remover.className = "remover";
        remover.onclick = () => {
            itens.splice(index, 1);
            atualizarLista();
        };

        const handle = document.createElement("span");
        handle.textContent = "≡";
        handle.className = "handle";

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(remover);
        li.appendChild(handle);

        adicionarDragDrop(li);

        lista_compras.appendChild(li);
    });

    atualizarContador();
}

// Atualizar contador
function atualizarContador() {
    const comprados = itens.filter(item => item.comprado).length;
    contador.textContent = `Itens comprados: ${comprados}/${itens.length}`;
}

// Drag and drop
function adicionarDragDrop(elemento) {
    elemento.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", e.target.dataset.index);
    });

    elemento.addEventListener("dragover", e => {
        e.preventDefault();
        e.target.classList.add("drag-over");
    });

    elemento.addEventListener("dragleave", e => {
        e.target.classList.remove("drag-over");
    });

    elemento.addEventListener("drop", e => {
        e.preventDefault();
        const fromIndex = +e.dataTransfer.getData("text/plain");
        const toIndex = +e.currentTarget.dataset.index;

        if (fromIndex !== toIndex) {
            const itemMovido = itens.splice(fromIndex, 1)[0];
            itens.splice(toIndex, 0, itemMovido);
            atualizarLista();
        }
    });
}
