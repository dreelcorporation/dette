function genererEtEnvoyerMailSimple() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Récupération des données
    const email = document.getElementById('emailDestinataire').value;
    const creancier = document.getElementById('nomCreancier').value;
    const debiteur = document.getElementById('nomDebiteur').value;
    const montant = document.getElementById('montant').value;

    if (!email || !creancier || !debiteur) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    // 2. Génération et Téléchargement du PDF
    doc.setFontSize(18);
    doc.text("RECONNAISSANCE DE DETTE", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text(`Le débiteur ${debiteur} reconnaît devoir ${montant}€ à ${creancier}.`, 20, 50);
    
    doc.save(`Creance_${debiteur}.pdf`);

    // 3. Ouverture du logiciel de messagerie (Option 1)
    const sujet = encodeURIComponent(`Document de créance officiel - ${debiteur}`);
    const corps = encodeURIComponent(
        `Bonjour,\n\n` +
        `Veuillez trouver ci-joint la reconnaissance de dette concernant ${debiteur} pour un montant de ${montant}€.\n\n` +
        `Note : Merci de joindre manuellement le fichier PDF qui vient d'être téléchargé sur votre ordinateur.\n\n` +
        `Cordialement.`
    );

    // Cette ligne ouvre la fenêtre de mail
    window.location.href = `mailto:${email}?subject=${sujet}&body=${corps}`;
}
