window.jsPDF = window.jspdf.jsPDF;

function genererPDF() {
    const doc = new jsPDF();
    
    // Récupération des données
    const creancier = document.getElementById('nomCreancier').value;
    const adrCreancier = document.getElementById('adresseCreancier').value;
    const debiteur = document.getElementById('nomDebiteur').value;
    const adrDebiteur = document.getElementById('adresseDebiteur').value;
    const montant = document.getElementById('montant').value;
    const dateEcheance = document.getElementById('dateEcheance').value;
    const dateJour = new Date().toLocaleDateString('fr-FR');

    // Mise en page du PDF
    doc.setFontSize(18);
    doc.text("RECONNAISSANCE DE DETTE", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Fait le : ${dateJour}`, 20, 40);

    let texte = `Je soussigné(e), ${debiteur}, demeurant au ${adrDebiteur}, 
reconnais devoir à ${creancier}, demeurant au ${adrCreancier}, 
la somme totale de ${montant} Euros.

Cette somme devra être remboursée au plus tard le : ${dateEcheance}.

En foi de quoi, ce document est établi pour servir et valoir ce que de droit.`;

    // Division du texte pour qu'il tienne dans la page
    const splitText = doc.splitTextToSize(texte, 170);
    doc.text(splitText, 20, 60);

    doc.text("Signature du débiteur (précédée de la mention 'Lu et approuvé')", 20, 130);
    
    // Téléchargement
    doc.save(`creance_${debiteur}.pdf`);
}
