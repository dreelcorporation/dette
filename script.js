function genererPDF() {
    // Correction ici : on s'assure d'accéder à l'objet interne de la librairie
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF();
    
    // Récupération des données avec vérification
    const creancier = document.getElementById('nomCreancier').value;
    const debiteur = document.getElementById('nomDebiteur').value;
    const montant = document.getElementById('montant').value;

    if(!creancier || !debiteur || !montant) {
        alert("Veuillez remplir les champs obligatoires !");
        return;
    }

    // Le reste du code...
    doc.text(`Reconnaissance de dette de ${montant}€`, 20, 20);
    doc.text(`Créancier: ${creancier}`, 20, 40);
    doc.text(`Débiteur: ${debiteur}`, 20, 50);

    // Téléchargement
    doc.save("document-creance.pdf");
}
