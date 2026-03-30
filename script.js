// On initialise jsPDF
const { jsPDF } = window.jspdf;

// Au chargement de la page, on affiche les clients sauvegardés
document.addEventListener('DOMContentLoaded', afficherDonnees);

function creerDossier() {
    // Récupération des valeurs
    const data = {
        id: Date.now(),
        creancier: document.getElementById('creancier').value,
        debiteur: document.getElementById('debiteur').value,
        email: document.getElementById('email').value,
        montant: document.getElementById('montant').value,
        date: document.getElementById('date').value,
        paye: false
    };

    // Validation simple
    if (!data.creancier || !data.debiteur || !data.montant) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    // 1. Lancer la génération du PDF
    genererPDF(data);

    // 2. Sauvegarder localement dans le navigateur
    sauvegarderLocal(data);

    // 3. Préparer l'email
    envoyerMail(data);

    // 4. Actualiser l'interface
    afficherDonnees();
    document.getElementById('creanceForm').reset();
}

function genererPDF(data) {
    const doc = new jsPDF();
    const dateJour = new Date().toLocaleDateString('fr-FR');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("RECONNAISSANCE DE DETTE", 105, 30, null, null, "center");

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Fait le : ${dateJour}`, 20, 50);

    const corpsTexte = `Je soussigné(e), ${data.debiteur}, reconnais par la présente devoir à ${data.creancier} la somme de ${data.montant} Euros.\n\nJe m'engage formellement à rembourser cette somme au plus tard le ${data.date}.\n\nCe document est établi pour servir et valoir ce que de droit.`;
    
    const textLines = doc.splitTextToSize(corpsTexte, 170);
    doc.text(textLines, 20, 70);

    doc.text("Signature (précédée de la mention 'lu et approuvé') :", 20, 130);
    
    doc.save(`Creance_${data.debiteur}.pdf`);
}

function sauvegarderLocal(nouveau) {
    let base = JSON.parse(localStorage.getItem('db_creances') || '[]');
    base.push(nouveau);
    localStorage.setItem('db_creances', JSON.stringify(base));
}

function afficherDonnees() {
    const liste = document.getElementById('listeClients');
    const base = JSON.parse(localStorage.getItem('db_creances') || '[]');
    
    if (base.length === 0) {
        liste.innerHTML = '<tr><td colspan="5" style="text-align:center; color:gray;">Aucun client enregistré</td></tr>';
        return;
    }

    liste.innerHTML = base.map(item => `
        <tr>
            <td><strong>${item.debiteur}</strong><br><small>${item.email}</small></td>
            <td>${item.montant} €</td>
            <td>${item.date}</td>
            <td>
                <span class="badge ${item.paye ? 'badge-success' : 'badge-pending'}">
                    ${item.paye ? 'Payé' : 'En attente'}
                </span>
            </td>
            <td class="actions">
                <button class="btn-icon" onclick="modifierStatut(${item.id})">✅</button>
                <button class="btn-icon" onclick="supprimerClient(${item.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function modifierStatut(id) {
    let base = JSON.parse(localStorage.getItem('db_creances'));
    base = base.map(i => i.id === id ? {...i, paye: !i.paye} : i);
    localStorage.setItem('db_creances', JSON.stringify(base));
    afficherDonnees();
}

function supprimerClient(id) {
    if(confirm("Voulez-vous vraiment supprimer ce suivi ?")) {
        let base = JSON.parse(localStorage.getItem('db_creances'));
        base = base.filter(i => i.id !== id);
        localStorage.setItem('db_creances', JSON.stringify(base));
        afficherDonnees();
    }
}

function envoyerMail(data) {
    const s = encodeURIComponent("Document de créance officiel");
    const b = encodeURIComponent(`Bonjour ${data.debiteur},\n\nVotre reconnaissance de dette de ${data.montant}€ est disponible.\n\nCordialement.`);
    window.location.href = `mailto:${data.email}?subject=${s}&body=${b}`;
}
