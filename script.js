const areaCaricamento = document.getElementById("area-caricamento");
const testoArea = document.getElementById("testo-area"); // nuovo elemento
const inputFile = document.getElementById("file-chat");
const pulsanteAnalizza = document.getElementById("pulsante-analizza");
const risultati = document.getElementById("risultati");
const spanTotale = document.getElementById("conteggio-totale");
const contenitoreSchede = document.getElementById("schede-utenti");

let contenutoChat = "";

function leggiFile(file) {
  if (!file || !file.name.endsWith(".txt")) {
    alert("Carica un file .txt valido esportato da WhatsApp.");
    return;
  }

  const lettore = new FileReader();

  lettore.onload = function (evento) {
    contenutoChat = evento.target.result;
    testoArea.textContent = `✅ File caricato: ${file.name}`;
  };

  lettore.readAsText(file);
}

areaCaricamento.addEventListener("click", () => inputFile.click());
inputFile.addEventListener("change", e => leggiFile(e.target.files[0]));
areaCaricamento.addEventListener("drop", e => {
  e.preventDefault();
  areaCaricamento.classList.remove("evidenziato");
  leggiFile(e.dataTransfer.files[0]);
});

["dragenter", "dragover"].forEach(evento => {
  areaCaricamento.addEventListener(evento, e => {
    e.preventDefault();
    areaCaricamento.classList.add("evidenziato");
  });
});
["dragleave"].forEach(evento => {
  areaCaricamento.addEventListener(evento, e => {
    e.preventDefault();
    areaCaricamento.classList.remove("evidenziato");
  });
});

pulsanteAnalizza.addEventListener("click", () => {
  if (!contenutoChat) {
    alert("Devi prima caricare un file di chat.");
    return;
  }

  const modelloMessaggio = /\[\d{2}\/\d{2}\/\d{2}, \d{2}:\d{2}(?::\d{2})?\] ([^:]+):/g;
  const corrispondenze = [...contenutoChat.matchAll(modelloMessaggio)];

  const totaleMessaggi = corrispondenze.length;
  const conteggiUtenti = {};

  for (const corrispondenza of corrispondenze) {
    const nome = corrispondenza[1];
    conteggiUtenti[nome] = (conteggiUtenti[nome] || 0) + 1;
  }

    risultati.classList.remove("nascosto");
    spanTotale.textContent = totaleMessaggi;
    contenitoreSchede.innerHTML = "";

    setTimeout(() => {
    risultati.scrollIntoView({ behavior: "smooth" });
    }, 100);


 for (const nome in conteggiUtenti) {
  const riquadro = document.createElement("div");
  riquadro.className = "scheda";
  riquadro.style.backgroundColor = "#e8f0fe"; 
  riquadro.innerHTML = `<strong>${nome}:</strong> ${conteggiUtenti[nome]}`;
  contenitoreSchede.appendChild(riquadro);
}
});
