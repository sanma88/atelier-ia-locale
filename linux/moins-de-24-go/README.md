<img src="../../assets/logo-helmo.png" alt="HELMo" width="120">

# Linux, moins de 24 Go de mémoire vive

**L’IA locale sur ton ordinateur** · HELMo · Vendredi 20 novembre 2026

Avec Mariano Sanfilippo et Vincent Daron.

Tu es au bon endroit si ton ordinateur tourne sous Linux et qu’il a moins de 24 Go de mémoire vive. Sinon, reviens à [l’accueil](../../README.md) pour choisir ton dossier.

Prépare Ollama et les modèles, vérifie une première réponse, puis installe Handy pour la dictée locale. Si ça bloque, viens quand même. Nous regarderons le problème avec toi et tu pourras travailler en binôme.

Ces paliers sont nos repères, testés pour l’instant sur une seule machine. En dessous de 16 Go de mémoire vive, viens quand même : on travaillera en binôme.

> [!NOTE]
> Ce parcours a été préparé sur Mac et n’a pas encore été essayé sous Linux. Si un écran ou un message diffère de ce qui est décrit ici, note-le et viens quand même : tu nous aideras à l’améliorer.

Ton PC a une carte graphique ? Sa mémoire dédiée est bien plus rapide que la mémoire vive. Vérifie combien elle en a avant de choisir ton dossier : [comment faire](../../README.md#et-si-ton-pc-a-une-carte-graphique-windows-et-linux).

<a id="parcours"></a>

**Ton parcours**

[1. Ollama](#ollama) · [2. Modèles](#modeles) · [3. Première réponse](#premiere-reponse) · [4. Handy](#handy)

<a id="ollama"></a>

## 1. Installe Ollama

Ollama est le **moteur** : le logiciel qui fait tourner l’IA sur ton ordinateur. Ce qu’il fait tourner s’appelle un **modèle** : le fichier qui contient ce que l’IA a appris. Avec les modèles de ce dossier, tes questions et ses réponses sont calculées et gardées sur ton ordinateur : Internet sert au téléchargement. Sous Linux, tout se fait dans un **terminal** : une fenêtre où l’on tape des commandes.

L’installation passe par un script : un petit programme, publié sur le site officiel d’Ollama, qui télécharge le logiciel puis l’installe. Sans autre réglage, il installe la version que l’éditeur publie au moment où tu le lances.

### Installe le moteur

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

| Processeur | Archive | Taille |
|---|---|---|
| x86_64 | [Télécharger .zst](https://github.com/ollama/ollama/releases/download/v0.40.14/ollama-linux-amd64.tar.zst) | 1,53 Go |
| ARM64 | [Télécharger .zst](https://github.com/ollama/ollama/releases/download/v0.40.14/ollama-linux-arm64.tar.zst) | 1,58 Go |

<details>
<summary>Empreintes SHA-256 des archives Ollama</summary>

**ollama-linux-amd64.tar.zst**

```text
993e83d08c3d13d17c55009a3e2664c8a25445e644aec3a68bef5abb6abce67d
```

**ollama-linux-arm64.tar.zst**

```text
39bb333b7b4c0bafcdd7fad35eab1ae9aaf4518ea0f2c731de4376e3a29c94d0
```

</details>

<!-- À VÉRIFIER : procédure Linux jamais essayée. La variable OLLAMA_VERSION est lue dans le code du script v0.40.14, pas observée à l'exécution. -->

<details>
<summary>Pourquoi garder la version 0.40.14 ?</summary>

L’atelier a été préparé avec cette version. Une version plus récente existe : elle n’a pas été essayée pour l’atelier.

</details>

**Dépôt officiel GitHub :** [github.com/ollama/ollama](https://github.com/ollama/ollama)

**C’est réussi si…** le script se termine sans erreur. Tu vérifieras une réponse à l’étape 3.

[Retour au parcours](#parcours) · [Étape suivante](#modeles)

<a id="modeles"></a>

## 2. Télécharge le modèle

Le modèle contient des réglages appris, rangés dans un fichier. Voici les modèles de ton parcours :

| Modèle | À quoi il sert | Taille |
|---|---|---|
| `ministral-3:3b` | Ministral 3, le modèle de l’atelier, pour discuter | 2,95 Go |

### Télécharge Ministral

1. **Copie** la commande ci-dessous, colle-la dans le terminal, puis appuie sur Entrée.

   ```bash
   ollama pull ministral-3:3b
   ```

2. **Laisse la commande aller au bout** : une barre de progression avance, puis le mot `success` apparaît.

**Espace disque pour le modèle : 2,95 Go**, en plus de l’installeur et d’Ollama lui-même. Garde de la marge : ton ordinateur a besoin de place libre pour bien fonctionner.

<details>
<summary>Si le téléchargement s’interrompt</summary>

Ollama est conçu pour reprendre : relance la même commande sans rien supprimer.

</details>

**C’est réussi si…** chaque téléchargement choisi se termine par le mot `success`.

[Retour au parcours](#parcours) · [Étape suivante](#premiere-reponse)

<a id="premiere-reponse"></a>

## 3. Vérifie une première réponse

### Envoie un message

1. **Tape** cette ligne dans le terminal, puis appuie sur Entrée :

   ```bash
   ollama run ministral-3:3b "bonjour"
   ```

2. **Vérifie** les modèles téléchargés. Tape cette commande, puis appuie sur Entrée :

   ```bash
   ollama list
   ```

**C’est réussi si…**

- une réponse à ton « bonjour » s’affiche dans le terminal, écrite par ton propre ordinateur ;
- `ollama list` affiche `ministral-3:3b`.

<details>
<summary>Si tu bloques à cette étape</summary>

Note le message exact qui s’affiche et apporte ton ordinateur le 20 novembre. Tu peux aussi coller ce message dans une IA en ligne pour qu’elle te l’explique. Retire d’abord ton nom, les chemins de tes dossiers personnels et toute adresse ou clé : ce message quitte alors ton ordinateur.

</details>

[Retour au parcours](#parcours) · [Étape suivante](#handy)

<a id="handy"></a>

## 4. Préparer la dictée locale : Handy

Nous utiliserons Handy pendant l’atelier. Installe-le et télécharge Parakeet avant de venir si possible. Si cela bloque, tu pourras suivre l’essai en binôme.

Handy écrit ce que tu dictes dans l’application où se trouve ton curseur. Le traitement se fait sur ton ordinateur. Version 0.10.0. Il n’a pas encore été testé sous Linux par l’équipe de l’atelier.

### Choisis ton fichier

| Ton système | Fichier | Taille |
|---|---|---|
| Debian, Ubuntu, x86_64 | [Télécharger .deb](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_amd64.deb) | 34 Mo |
| Debian, Ubuntu, ARM64 | [Télécharger .deb](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_arm64.deb) | 30 Mo |
| Fedora et dérivés, x86_64 | [Télécharger .rpm](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy-0.10.0-1.x86_64.rpm) | 91 Mo |
| Autre distribution, x86_64 | [Télécharger .AppImage](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_amd64.AppImage) | 124 Mo |

<details>
<summary>Empreintes SHA-256 des fichiers Handy</summary>

**Handy_0.10.0_amd64.deb**

```text
cd91f0eb445a1b20a0ed7391a77cb1174d1e5c83d1696491e1228d13e2364684
```

**Handy_0.10.0_arm64.deb**

```text
6fd7c4147fc26302e062df53f0721ed9c8be03850083c7dc36d591e554a868b8
```

**Handy-0.10.0-1.x86_64.rpm**

```text
2c77658d4939fbaeb82e168830d549b758d954e23e387a50017112dbc2735992
```

**Handy_0.10.0_amd64.AppImage**

```text
20661c16b0b9e1b7dc5020be463f2b17f654bfeaf0ba1d7032bc4b77b268ec6c
```

</details>

Pour connaître ton processeur, tape cette commande dans le terminal :

```bash
uname -m
```

`x86_64` correspond à x86_64, `aarch64` à ARM64.

### Vérifie et installe Handy

1. **Place-toi** dans le dossier du téléchargement. Choisis la commande qui correspond à ton dossier :

   ```bash
   cd ~/Téléchargements
   ```

   Ou, si le dossier porte ce nom :

   ```bash
   cd ~/Downloads
   ```

2. **Vérifie** l’empreinte avant d’installer. Adapte le nom à ton fichier :

   ```bash
   sha256sum Handy_0.10.0_amd64.deb
   ```

   Ouvre le volet « Empreintes SHA-256 des fichiers Handy » ci-dessus et compare le résultat. Si l’empreinte diffère, n’installe pas le fichier. Retélécharge-le depuis le lien du tableau.

3. **Installe** le paquet, sous Debian ou Ubuntu, avec la commande de ton processeur :

   Pour x86_64 :

   ```bash
   sudo apt install ./Handy_0.10.0_amd64.deb
   ```

   Pour ARM64 :

   ```bash
   sudo apt install ./Handy_0.10.0_arm64.deb
   ```

### Prépare la dictée

1. Lance Handy une fois à la maison.
2. Choisis **Parakeet** comme modèle de transcription et attends la fin du téléchargement, environ **706 Mo**.
3. Laisse le post-traitement désactivé.

Parakeet a été essayé en français, sans Wi-Fi, sur le Mac du formateur.

<details>
<summary>Autre modèle à partir de 24 Go : Voxtral</summary>

Voxtral donne un résultat proche, pour une taille bien plus grande. Pour l’atelier, prépare Parakeet.

</details>

> [!IMPORTANT]
> Handy garde tes derniers enregistrements audio sur ton ordinateur. Laisse aussi le « post-traitement » désactivé : il peut envoyer ton texte à un service en ligne.

**Dépôt officiel GitHub :** [github.com/cjpais/Handy](https://github.com/cjpais/Handy)

**C’est réussi si…** Handy s’ouvre, Parakeet est téléchargé et le post-traitement reste désactivé.

[Retour au parcours](#parcours)

[Retour à l’accueil et au choix du parcours](../../README.md)
