<img src="../../assets/logo-helmo.png" alt="HELMo" width="120">

# Mac, moins de 24 Go de mémoire vive

**L’IA locale sur ton ordinateur** · HELMo · Vendredi 20 novembre 2026

Avec Mariano Sanfilippo et Vincent Daron.

Tu es au bon endroit si ton ordinateur est un Mac et qu’il a moins de 24 Go de mémoire vive. Sinon, reviens à [l’accueil](../../README.md) pour choisir ton dossier.

Prépare Ollama et les modèles, vérifie une première réponse, puis installe Handy pour la dictée locale. Si ça bloque, viens quand même. Nous regarderons le problème avec toi et tu pourras travailler en binôme.

Ces paliers sont nos repères, testés pour l’instant sur une seule machine. En dessous de 16 Go de mémoire vive, viens quand même : on travaillera en binôme.

<a id="parcours"></a>

**Ton parcours**

[1. Ollama](#ollama) · [2. Modèles](#modeles) · [3. Première réponse](#premiere-reponse) · [4. Handy](#handy)

<a id="ollama"></a>

## 1. Installe Ollama

Ollama est le **moteur** : le logiciel qui fait tourner l’IA sur ton ordinateur. Ce qu’il fait tourner s’appelle un **modèle** : le fichier qui contient ce que l’IA a appris. Avec les modèles de ce dossier, tes questions et ses réponses sont calculées et gardées sur ton ordinateur : Internet sert au téléchargement.

### Installe le moteur

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

> [!WARNING]
> Si l’empreinte affichée diffère, n’ouvre pas le fichier. Il diffère de celui publié par l’éditeur. Supprime-le, retélécharge-le depuis le lien officiel ci-dessus, puis vérifie à nouveau.

<details>
<summary>Pourquoi garder la version 0.40.14 ?</summary>

L’atelier a été préparé avec cette version. Une version plus récente existe : elle n’a pas été essayée pour l’atelier.

</details>

**Dépôt officiel GitHub :** [github.com/ollama/ollama](https://github.com/ollama/ollama)

**C’est réussi si…** l’empreinte correspond et l’application Ollama s’ouvre.

[Retour au parcours](#parcours) · [Étape suivante](#modeles)

<a id="modeles"></a>

## 2. Télécharge le modèle

Le modèle contient des réglages appris, rangés dans un fichier. Voici les modèles de ton parcours :

| Modèle | À quoi il sert | Taille |
|---|---|---|
| `ministral-3:3b` | Ministral 3, le modèle de l’atelier, pour discuter | 2,95 Go |

### Télécharge Ministral

1. **Copie** la commande ci-dessous, colle-la dans le Terminal, puis appuie sur Entrée.

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

1. **Ouvre** l’application Ollama.
2. **Choisis** le modèle `ministral-3:3b`.
3. **Copie** ce message dans la conversation, puis envoie-le :

   ```text
   bonjour
   ```

4. **Vérifie** les modèles téléchargés. Dans le Terminal, tape cette commande, puis appuie sur Entrée :

   ```bash
   ollama list
   ```

<!-- À COMPLÉTER APRÈS T1 ET T2 : où se trouve le choix du modèle dans l'application Ollama, et à quoi ressemble l'écran de réponse. -->

**C’est réussi si…**

- une réponse à ton « bonjour » s’affiche dans l’application, écrite par ton propre ordinateur ;
- la commande `ollama list`, tapée dans le Terminal, affiche `ministral-3:3b`.

<details>
<summary>Si tu bloques à cette étape</summary>

Note le message exact qui s’affiche et apporte ton ordinateur le 20 novembre. Tu peux aussi coller ce message dans une IA en ligne pour qu’elle te l’explique. Retire d’abord ton nom, les chemins de tes dossiers personnels et toute adresse ou clé : ce message quitte alors ton ordinateur.

</details>

[Retour au parcours](#parcours) · [Étape suivante](#handy)

<a id="handy"></a>

## 4. Préparer la dictée locale : Handy

Nous utiliserons Handy pendant l’atelier. Installe-le et télécharge Parakeet avant de venir si possible. Si cela bloque, tu pourras suivre l’essai en binôme.

Handy écrit ce que tu dictes dans l’application où se trouve ton curseur. Le traitement se fait sur ton ordinateur. Version 0.10.0, essayée sur Mac, hors ligne, en français. Relis ce qu’il écrit : lors de notre essai, il a déformé des noms propres.

### Choisis ton fichier

| Ton Mac | Fichier | Taille |
|---|---|---|
| Puce Apple | [Télécharger .dmg](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_aarch64.dmg) | 15 Mo |
| Processeur Intel | [Télécharger .dmg](https://github.com/cjpais/Handy/releases/download/v0.10.0/Handy_0.10.0_x64.dmg) | 15 Mo |

<details>
<summary>Empreintes SHA-256 des fichiers Handy</summary>

**Handy_0.10.0_aarch64.dmg**

```text
bdc41359af0b8b3014f14c44ea3fe85b1e45387bdad261bd4a2cfc92f7f35496
```

**Handy_0.10.0_x64.dmg**

```text
210cc45fa66c899dcb8848df807779c7a808fe8e6dd863b9d5ed448a8acd7d3a
```

</details>

Pour savoir lequel prendre : menu Pomme, puis « À propos de ce Mac », ligne « Puce » ou « Processeur ».

### Vérifie et installe Handy

1. Ouvre le Terminal.
2. Vérifie l’empreinte du fichier. Adapte le nom à celui que tu as téléchargé :

   ```bash
   shasum -a 256 ~/Downloads/Handy_0.10.0_aarch64.dmg
   ```

3. Ouvre le volet « Empreintes SHA-256 des fichiers Handy » ci-dessus et compare le résultat. Si elle diffère, retélécharge le fichier depuis le lien du tableau.
4. Si elle correspond, ouvre le fichier et suis les indications d’installation.

### Prépare la dictée

1. Lance Handy une fois à la maison.
2. Accorde l’accès au micro et à l’accessibilité.
3. Choisis **Parakeet** comme modèle de transcription et attends la fin du téléchargement, environ **706 Mo**.
4. Laisse le post-traitement désactivé.

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
