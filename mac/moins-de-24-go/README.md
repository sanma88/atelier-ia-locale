# Mac, moins de 24 Go de mémoire vive

Tu es au bon endroit si ton ordinateur est un Mac et qu’il a moins de 24 Go de mémoire vive. Sinon, reviens à [l’accueil](../../README.md) pour choisir ton dossier.

Trois étapes : installer le moteur, télécharger le modèle, vérifier que tout répond. Ce n’est pas un examen d’entrée : si ça bloque, viens quand même, on règle ça ensemble sur place.

Ces paliers sont nos repères, testés pour l’instant sur une seule machine. En dessous de 16 Go de mémoire vive, viens quand même : on travaillera en binôme.

## 1. Installer Ollama

Ollama est le **moteur** : le logiciel qui fait tourner l’IA sur ton ordinateur. Ce qu’il fait tourner s’appelle un **modèle** : le fichier qui contient ce que l’IA a appris. Avec les modèles de ce dossier, tes questions et ses réponses sont calculées et gardées sur ton ordinateur : Internet sert au téléchargement.

1. **Télécharge** l’installeur officiel : [Ollama.dmg, version 0.40.14](https://github.com/ollama/ollama/releases/download/v0.40.14/Ollama.dmg) (231 Mo).
2. **Ouvre** le Terminal, une fenêtre où l’on tape des commandes. Tu le trouves dans Applications, puis Utilitaires.
3. **Vérifie** le fichier avant de l’ouvrir, grâce à son empreinte SHA-256 : une suite de caractères calculée à partir du fichier, comme une empreinte digitale. Si un seul octet change, l’empreinte change. Tape cette ligne dans le Terminal, puis appuie sur Entrée :

   ```bash
   shasum -a 256 ~/Downloads/Ollama.dmg
   ```

   Le résultat doit commencer par :
   `683ca9baf3d4257f31fdd0004193527797c861be9d6dfb8c4617ba0800c170f9`

4. **Ouvre** le fichier téléchargé, seulement si l’empreinte correspond, et suis les indications à l’écran.
5. **Lance** l’application Ollama.

<!-- À COMPLÉTER APRÈS T1 ET T2 : ce que montre le .dmg (glisser dans Applications ?), alerte de sécurité macOS au premier lancement, demande éventuelle de compte, installation de la commande ollama dans le Terminal. -->

> **Attention**
> Si l’empreinte affichée diffère, n’ouvre pas le fichier : ce n’est pas celui que l’éditeur a publié. Supprime-le, retélécharge-le depuis le lien officiel ci-dessus, puis vérifie à nouveau.

Pourquoi la version 0.40.14 et pas la toute dernière ? C’est avec elle que l’atelier a été préparé. Une version plus récente existe : elle n’a pas été essayée pour l’atelier.

**Dépôt officiel GitHub :** [github.com/ollama/ollama](https://github.com/ollama/ollama)

## 2. Télécharger le modèle

Le modèle, c’est ce que l’IA a appris, rangé dans un fichier. Tu ne télécharges pas Internet : tu télécharges des réglages. Dans ce dossier :

| Modèle | À quoi il sert | Taille |
|---|---|---|
| `ministral-3:3b` | Ministral 3, le modèle de l’atelier, pour discuter | 2,95 Go |

1. **Copie** la commande ci-dessous, colle-la dans le Terminal, puis appuie sur Entrée.

   ```bash
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
- la commande `ollama list`, tapée dans le Terminal, affiche `ministral-3:3b`.

> **Besoin d’un indice ?**
> Note le message exact qui s’affiche et apporte ton ordinateur le 20 novembre. Tu peux aussi coller ce message dans une IA en ligne pour qu’elle te l’explique. Retire d’abord ton nom, les chemins de tes dossiers personnels et toute adresse ou clé : ce message quitte alors ton ordinateur.

## En option

Rien de ce qui suit n’est nécessaire pour participer à l’atelier.

### Dictée vocale (bonus) : Handy

Handy transforme ta voix en texte, sur ton ordinateur. Ce n’est pas une application de conversation : il écrit ce que tu dictes, il ne te répond pas. Version 0.10.0. Il n’a pas encore été testé par l’équipe de l’atelier.

| Ton Mac | Fichier | Taille | SHA-256 |
|---|---|---|---|
| Puce Apple | [Handy_0.10.0_aarch64.dmg](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_aarch64.dmg) | 15 Mo | `bdc41359af0b8b3014f14c44ea3fe85b1e45387bdad261bd4a2cfc92f7f35496` |
| Processeur Intel | [Handy_0.10.0_x64.dmg](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_x64.dmg) | 15 Mo | `210cc45fa66c899dcb8848df807779c7a808fe8e6dd863b9d5ed448a8acd7d3a` |

Pour savoir lequel prendre : menu Pomme, puis « À propos de ce Mac », ligne « Puce » ou « Processeur ».

Avant d’ouvrir le fichier, vérifie son empreinte comme pour Ollama, dans le Terminal : `shasum -a 256 ~/Downloads/Handy_0.10.0_aarch64.dmg`, avec le nom de ton fichier. Si elle diffère de la colonne SHA-256, ne l’ouvre pas : retélécharge-le depuis le lien du tableau.

Au premier lancement, Handy demande l’accès au micro et à l’accessibilité, puis télécharge son modèle de transcription. Lance-le une fois à la maison : ce téléchargement sera déjà fait le jour J.

Au moment de choisir le modèle de transcription dans Handy, prends **Parakeet** (environ 706 Mo) : nous l'avons essayé en français, sans Wi-Fi. À partir de 24 Go, **Voxtral** donne un résultat proche, pour une taille bien plus grande.

> **Attention**
> Handy garde tes derniers enregistrements audio sur ton ordinateur. Laisse aussi le « post-traitement » désactivé : il peut envoyer ton texte à un service en ligne.

**Dépôt officiel GitHub :** [github.com/cjpais/Handy](https://github.com/cjpais/Handy)

---

[Retour à l’accueil](../../README.md)
