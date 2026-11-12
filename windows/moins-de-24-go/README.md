# Windows, moins de 24 Go de mémoire vive

Tu es au bon endroit si ton ordinateur tourne sous Windows et qu’il a moins de 24 Go de mémoire vive. Sinon, reviens à [l’accueil](../../README.md) pour choisir ton dossier.

Trois étapes : installer le moteur, télécharger le modèle, vérifier que tout répond. Ce n’est pas un examen d’entrée : si ça bloque, viens quand même, on règle ça ensemble sur place.

Ces paliers sont nos repères, testés pour l’instant sur une seule machine. En dessous de 16 Go de mémoire vive, viens quand même : on travaillera en binôme.

## 1. Installer Ollama

Ollama est le **moteur** : le logiciel qui fait tourner l’IA sur ton ordinateur. Ce qu’il fait tourner s’appelle un **modèle** : le fichier qui contient ce que l’IA a appris. Avec les modèles de ce dossier, tes questions et ses réponses sont calculées et gardées sur ton ordinateur : Internet sert au téléchargement.

1. **Télécharge** l’installeur officiel : [OllamaSetup.exe, version 0.40.14](https://github.com/ollama/ollama/releases/download/v0.40.14/OllamaSetup.exe) (1,68 Go).
2. **Ouvre** PowerShell, une fenêtre où l’on tape des commandes, appelée aussi terminal. Tape « PowerShell » dans le menu Démarrer et ouvre-le.
3. **Vérifie** le fichier avant de l’ouvrir, grâce à son empreinte SHA-256 : une suite de caractères calculée à partir du fichier, comme une empreinte digitale. Si un seul octet change, l’empreinte change. Tape cette ligne dans PowerShell, puis appuie sur Entrée :

   ```powershell
   Get-FileHash $HOME\Downloads\OllamaSetup.exe
   ```

   La colonne `Hash` doit afficher, en majuscules ou en minuscules :
   `e069c7cc7d4808f77684e81efa0b1f853a5190b4b8f070bc8fd63041180e3eba`

4. **Ouvre** le fichier téléchargé, seulement si l’empreinte correspond, et suis les indications à l’écran.
5. **Lance** l’application Ollama.

<!-- À COMPLÉTER APRÈS T1 ET T2 : procédure Windows pas encore essayée. Écrans de l'installeur, avertissement SmartScreen éventuel, demande éventuelle de compte, disponibilité de la commande ollama dans PowerShell. -->

> **Attention**
> Si l’empreinte affichée diffère, n’ouvre pas le fichier : ce n’est pas celui que l’éditeur a publié. Supprime-le, retélécharge-le depuis le lien officiel ci-dessus, puis vérifie à nouveau.

Pourquoi la version 0.40.14 et pas la toute dernière ? C’est avec elle que l’atelier a été préparé. Une version plus récente existe : elle n’a pas été essayée pour l’atelier.

**Dépôt officiel GitHub :** [github.com/ollama/ollama](https://github.com/ollama/ollama)

## 2. Télécharger le modèle

Le modèle, c’est ce que l’IA a appris, rangé dans un fichier. Tu ne télécharges pas Internet : tu télécharges des réglages. Dans ce dossier :

| Modèle | À quoi il sert | Taille |
|---|---|---|
| `ministral-3:3b` | Ministral 3, le modèle de l’atelier, pour discuter | 2,95 Go |

1. **Copie** la commande ci-dessous, colle-la dans PowerShell, puis appuie sur Entrée.

   ```powershell
   ollama pull ministral-3:3b
   ```

2. **Laisse la commande aller au bout** : une barre de progression avance, puis le mot `success` apparaît.

**Espace disque pour le modèle : 2,95 Go**, en plus de l’installeur et d’Ollama lui-même. Garde de la marge : ton ordinateur a besoin de place libre pour bien fonctionner.

> **À retenir**
> Si le téléchargement s’interrompt, Ollama est conçu pour reprendre : relance la même commande sans rien supprimer.

## 3. Vérifier

1. **Ouvre** l’application Ollama.
2. **Choisis** le modèle `ministral-3:3b`.
3. **Écris** `bonjour`, puis envoie.

<!-- À COMPLÉTER APRÈS T1 ET T2 : où se trouve le choix du modèle dans l'application Ollama, et à quoi ressemble l'écran de réponse. -->

## C’est réussi si…

- une réponse à ton « bonjour » s’affiche dans l’application, écrite par ton propre ordinateur ;
- la commande `ollama list`, tapée dans PowerShell, affiche `ministral-3:3b`.

> **Besoin d’un indice ?**
> Note le message exact qui s’affiche et apporte ton ordinateur le 20 novembre. Tu peux aussi coller ce message dans une IA en ligne pour qu’elle te l’explique. Retire d’abord ton nom, les chemins de tes dossiers personnels et toute adresse ou clé : ce message quitte alors ton ordinateur.

## En option

Rien de ce qui suit n’est nécessaire pour participer à l’atelier.

### Dictée vocale (bonus) : Handy

Handy transforme ta voix en texte, sur ton ordinateur. Ce n’est pas une application de conversation : il écrit ce que tu dictes, il ne te répond pas. Version 0.10.0. Il n’a pas encore été testé par l’équipe de l’atelier.

| Ton PC | Fichier | Taille | SHA-256 |
|---|---|---|---|
| Processeur x64 (Intel, AMD) | [Handy_0.10.0_x64-setup.exe](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_x64-setup.exe) | 17 Mo | `d4c02386d6b4b2a8ef8e53a7ce5c6c417d554005e91b3529def3920e0e786d03` |
| Processeur ARM64 | [Handy_0.10.0_arm64-setup.exe](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_arm64-setup.exe) | 11 Mo | `2cec8defbe193d9cf837ac7e2f55880d685c486b0f15d2da11fa71f36de4c3d1` |

Pour savoir lequel prendre : ouvre Paramètres, puis Système, puis Informations. La ligne « Type de système » indique x64 ou ARM64.

Avant d’ouvrir le fichier, vérifie son empreinte comme pour Ollama, dans PowerShell : `Get-FileHash $HOME\Downloads\Handy_0.10.0_x64-setup.exe`, avec le nom de ton fichier. Si elle diffère de la colonne SHA-256, ne l’ouvre pas : retélécharge-le depuis le lien du tableau.

Au premier lancement, Handy télécharge son modèle de transcription. Lance-le une fois à la maison : ce téléchargement sera déjà fait le jour J.

Au moment de choisir le modèle de transcription dans Handy, prends **Parakeet** (environ 706 Mo) : nous l'avons essayé en français, sans Wi-Fi. À partir de 24 Go, **Voxtral** donne un résultat proche, pour une taille bien plus grande.

> **Attention**
> Handy garde tes derniers enregistrements audio sur ton ordinateur. Laisse aussi le « post-traitement » désactivé : il peut envoyer ton texte à un service en ligne.

**Dépôt officiel GitHub :** [github.com/cjpais/Handy](https://github.com/cjpais/Handy)

---

[Retour à l’accueil](../../README.md)
