# Linux, de 24 à 36 Go de mémoire vive

Tu es au bon endroit si ton ordinateur tourne sous Linux et qu’il a au moins 24 Go de mémoire vive, mais moins de 36 Go. Sinon, reviens à [l’accueil](../../README.md) pour choisir ton dossier.

Trois étapes : installer le moteur, télécharger les modèles, vérifier que tout répond. Ce n’est pas un examen d’entrée : si ça bloque, viens quand même, on règle ça ensemble sur place.

Ce parcours a été préparé sur Mac et n’a pas encore été essayé sous Linux. Si un écran ou un message diffère de ce qui est décrit ici, note-le et viens quand même : tu nous aideras à l’améliorer.

> **Astuce**
> Ton PC a une carte graphique ? Sa mémoire dédiée est bien plus rapide que la mémoire vive. Vérifie combien elle en a avant de choisir ton dossier : [comment faire](../../README.md#et-si-ton-pc-a-une-carte-graphique-windows-et-linux).

## 1. Installer Ollama

Ollama est le **moteur** : le logiciel qui fait tourner l’IA sur ton ordinateur. Ce qu’il fait tourner s’appelle un **modèle** : le fichier qui contient ce que l’IA a appris. Avec les modèles de ce dossier, tes questions et ses réponses sont calculées et gardées sur ton ordinateur : Internet sert au téléchargement. Sous Linux, tout se fait dans un **terminal** : une fenêtre où l’on tape des commandes.

L’installation passe par un script : un petit programme, publié sur le site officiel d’Ollama, qui télécharge le logiciel puis l’installe. Sans autre réglage, il installe la version que l’éditeur publie au moment où tu le lances.

1. **Ouvre** un terminal.
2. **Lis le script si tu veux savoir ce qu’il fait** avant de le lancer. Cette ligne l’affiche sans rien exécuter ; la touche `q` referme la lecture :

   ```bash
   curl -fsSL https://ollama.com/install.sh | less
   ```

3. **Lance** le script d’installation :

   ```bash
   curl -fsSL https://ollama.com/install.sh | OLLAMA_VERSION=0.40.14 sh
   ```

4. **Laisse le script aller au bout.**

La mention `OLLAMA_VERSION=0.40.14` demande au script la version de l’atelier. Ce réglage reste à vérifier : il est lu dans le code du script, mais nous ne l’avons pas encore essayé. Le script télécharge l’archive qui correspond à ton processeur, et selon ta carte graphique un complément :

| Processeur | Archive | Taille | SHA-256 |
|---|---|---|---|
| x86_64 | [ollama-linux-amd64.tar.zst](https://github.com/ollama/ollama/releases/download/v0.40.14/ollama-linux-amd64.tar.zst) | 1,53 Go | `993e83d08c3d13d17c55009a3e2664c8a25445e644aec3a68bef5abb6abce67d` |
| ARM64 | [ollama-linux-arm64.tar.zst](https://github.com/ollama/ollama/releases/download/v0.40.14/ollama-linux-arm64.tar.zst) | 1,58 Go | `39bb333b7b4c0bafcdd7fad35eab1ae9aaf4518ea0f2c731de4376e3a29c94d0` |

<!-- À VÉRIFIER : procédure Linux jamais essayée. La variable OLLAMA_VERSION est lue dans le code du script v0.40.14, pas observée à l'exécution. -->

Pourquoi la version 0.40.14 et pas la toute dernière ? C’est avec elle que l’atelier a été préparé. Une version plus récente existe : elle n’a pas été essayée pour l’atelier.

**Dépôt officiel GitHub :** [github.com/ollama/ollama](https://github.com/ollama/ollama)

## 2. Télécharger les modèles

Le modèle, c’est ce que l’IA a appris, rangé dans un fichier. Tu ne télécharges pas Internet : tu télécharges des réglages. Dans ce dossier :

| Modèle | À quoi il sert | Taille |
|---|---|---|
| `ministral-3:3b` | Ministral 3, le modèle de l’atelier, pour discuter | 2,95 Go |
| `ornith-1.5:9b` | Ornith 1.5 9B, un modèle plus grand, pour le bonus code | 6,55 Go |

Lance ces commandes une par une, dans le terminal. Pour chacune : copie-la, colle-la, appuie sur Entrée, puis attends le mot `success` avant de lancer la suivante. Pendant le téléchargement, une barre de progression avance.

1. **Ministral 3** :

   ```bash
   ollama pull ministral-3:3b
   ```

2. **Ornith 1.5 9B** :

   ```bash
   ollama pull ornith-1.5:9b
   ```

**Espace disque pour les modèles : 9,50 Go**, en plus de l’installeur et d’Ollama lui-même. Garde de la marge : ton ordinateur a besoin de place libre pour bien fonctionner.

> **À retenir**
> Si le téléchargement s’interrompt, Ollama est conçu pour reprendre : relance la même commande sans rien supprimer.

## 3. Vérifier

1. **Tape** cette ligne dans le terminal, puis appuie sur Entrée :

   ```bash
   ollama run ministral-3:3b "bonjour"
   ```

2. **Tape** `ollama list`, puis appuie sur Entrée.

## C’est réussi si…

- une réponse à ton « bonjour » s’affiche dans le terminal, écrite par ton propre ordinateur ;
- `ollama list` affiche `ministral-3:3b` et `ornith-1.5:9b`.

> **Besoin d’un indice ?**
> Note le message exact qui s’affiche et apporte ton ordinateur le 20 novembre. Tu peux aussi coller ce message dans une IA en ligne pour qu’elle te l’explique. Retire d’abord ton nom, les chemins de tes dossiers personnels et toute adresse ou clé : ce message quitte alors ton ordinateur.

## En option

Rien de ce qui suit n’est nécessaire pour participer à l’atelier.

### Bonus code : OpenCode, avec Ornith

OpenCode est un assistant de programmation : il écrit et modifie des fichiers à ta demande. Le jour J, il travaillera avec le modèle Ornith, sur ton ordinateur. La version 2.2.5 est celle avec laquelle le bonus a été préparé. La façon de le relier à Ornith est donnée pendant l’atelier.

L’installation passe par un script publié sur le site officiel d’OpenCode : il télécharge le logiciel, puis l’installe. Sans autre réglage, il installe la version que l’éditeur publie au moment où tu le lances. L’option `--version 2.2.5` lui demande la version du bonus ; ce réglage reste à vérifier, nous ne l’avons pas encore essayé.

1. **Lis le script si tu veux savoir ce qu’il fait** avant de le lancer. Cette ligne l’affiche dans le terminal sans rien exécuter ; la touche `q` referme la lecture :

   ```bash
   curl -fsSL https://opencode.ai/v2/install | less
   ```

2. **Lance** le script d’installation :

   ```bash
   curl -fsSL https://opencode.ai/v2/install | bash -s -- --version 2.2.5
   ```

**Dépôt officiel GitHub :** [github.com/anomalyco/opencode](https://github.com/anomalyco/opencode)

### Dictée vocale (bonus) : Handy

Handy transforme ta voix en texte, sur ton ordinateur. Ce n’est pas une application de conversation : il écrit ce que tu dictes, il ne te répond pas. Version 0.10.0. Il n’a pas encore été testé par l’équipe de l’atelier.

| Ton système | Fichier | Taille | SHA-256 |
|---|---|---|---|
| Debian, Ubuntu, x86_64 | [Handy_0.10.0_amd64.deb](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_amd64.deb) | 34 Mo | `cd91f0eb445a1b20a0ed7391a77cb1174d1e5c83d1696491e1228d13e2364684` |
| Debian, Ubuntu, ARM64 | [Handy_0.10.0_arm64.deb](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_arm64.deb) | 30 Mo | `6fd7c4147fc26302e062df53f0721ed9c8be03850083c7dc36d591e554a868b8` |
| Fedora et dérivés, x86_64 | [Handy-0.10.0-1.x86_64.rpm](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy-0.10.0-1.x86_64.rpm) | 91 Mo | `2c77658d4939fbaeb82e168830d549b758d954e23e387a50017112dbc2735992` |
| Autre distribution, x86_64 | [Handy_0.10.0_amd64.AppImage](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_amd64.AppImage) | 124 Mo | `20661c16b0b9e1b7dc5020be463f2b17f654bfeaf0ba1d7032bc4b77b268ec6c` |

Pour savoir lequel prendre : tape `uname -m` dans le terminal. `x86_64` correspond à x86_64, `aarch64` à ARM64.

1. **Place-toi** dans le dossier du téléchargement, par exemple avec `cd ~/Téléchargements` ou `cd ~/Downloads`.
2. **Vérifie** l’empreinte avant d’installer : `sha256sum Handy_0.10.0_amd64.deb`, avec le nom de ton fichier. Si elle diffère de la colonne SHA-256, n’installe pas le fichier : retélécharge-le depuis le lien du tableau.
3. **Installe** le paquet, sous Debian ou Ubuntu, avec la commande de ton processeur :

   - x86_64 : `sudo apt install ./Handy_0.10.0_amd64.deb`
   - ARM64 : `sudo apt install ./Handy_0.10.0_arm64.deb`

Au premier lancement, Handy télécharge son modèle de transcription. Lance-le une fois à la maison : ce téléchargement sera déjà fait le jour J.

Au moment de choisir le modèle de transcription dans Handy, prends **Parakeet** (environ 706 Mo) : nous l'avons essayé en français, sans Wi-Fi. À partir de 24 Go, **Voxtral** donne un résultat proche, pour une taille bien plus grande.

> **Attention**
> Handy garde tes derniers enregistrements audio sur ton ordinateur. Laisse aussi le « post-traitement » désactivé : il peut envoyer ton texte à un service en ligne.

**Dépôt officiel GitHub :** [github.com/cjpais/Handy](https://github.com/cjpais/Handy)

---

[Retour à l’accueil](../../README.md)
