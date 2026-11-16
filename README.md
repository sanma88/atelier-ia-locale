<img src="assets/logo-helmo.png" alt="HELMo" width="120">

# L’IA locale sur ton ordinateur

**Page de l’atelier :** https://sanma88.github.io/atelier-ia-locale/jour-j/

**Prépare ta machine avant l’atelier**

Vendredi **20 novembre 2026**, à **16 h 30**, salle **Imprimerie** · Digital Change with Ethics<br>
Avec **Mariano Sanfilippo** et **Vincent Daron**, pour **HELMo**.

Voici les installations à préparer avant l’atelier. Télécharge-les chez toi : les modèles occupent plusieurs gigaoctets et une douzaine de personnes partageront le Wi-Fi en salle.

Cette page sert à préparer ton ordinateur. Le lien vers la page de l’atelier est tout en haut.

<a id="sommaire"></a>

**Sur cette page** : [1. Repère ta mémoire](#memoire) · [2. Choisis ton parcours](#parcours) · [3. Prépare les applications](#preparation) · [Repères et licences](#reperes) · [Contact](#contact)

> [!NOTE]
> Si ça bloque ou si tu manques de temps, viens quand même. Nous regarderons le problème avec toi et tu pourras travailler en binôme. Note le message d’erreur exact et pense à ton chargeur.

<a id="memoire"></a>

## 1. Repère la mémoire de ton ordinateur

La **mémoire vive** est la mémoire de travail de l’ordinateur. Le modèle l’occupe pendant qu’il répond. L’**espace disque** sert à ranger les fichiers.

### Trouve la valeur

| Ton système | Où lire la mémoire vive |
|---|---|
| **Mac** | Menu Pomme, puis **À propos de ce Mac**. Lis la ligne **Mémoire**. |
| **Windows** | Ouvre le Gestionnaire des tâches avec **Ctrl + Maj + Échap**. Choisis **Performances**, puis **Mémoire**. Lis le total en haut à droite. |
| **Linux** | Ouvre le détail ci-dessous pour afficher la mémoire dans le terminal. |

<details>
<summary>Linux : lire la mémoire dans le terminal</summary>

1. Ouvre un terminal, la fenêtre où tu peux taper des commandes.
2. Copie cette commande, puis appuie sur Entrée :

```bash
free -h
```

3. Lis la colonne `total` de la ligne qui commence par `Mem` ou `Mém.`.

</details>

Si la valeur tombe juste sous un palier, prends la valeur ronde. Par exemple, **15,8 Go correspond à une machine de 16 Go**. Une partie de la mémoire est réservée au système.

<a id="et-si-ton-pc-a-une-carte-graphique-windows-et-linux"></a>

<details>
<summary>Carte graphique, Mac Apple M ou Mac Intel : quel repère garder ?</summary>

Une carte graphique calcule bien plus vite que le processeur. Pour en profiter, le modèle doit tenir dans sa mémoire dédiée, la **VRAM**.

**Sur Windows :**

1. Ouvre le Gestionnaire des tâches avec **Ctrl + Maj + Échap**.
2. Choisis **Performances**, puis **GPU**.
3. Lis la **mémoire GPU dédiée**.

La mémoire GPU partagée est de la mémoire vive prêtée à la carte. Elle ne va pas plus vite. Si la mémoire dédiée est faible ou absente, choisis ton parcours d’après la mémoire vive.

**Sur Linux avec une carte NVIDIA**, cette commande affiche la mémoire de la carte :

```bash
nvidia-smi
```

| Modèle | Repère de mémoire graphique dédiée |
|---|---|
| Ministral 3 | Environ 4 Go |
| Ornith 9B | Environ 8 Go |
| Qwen3.8 27B | Environ 24 Go |

Ollama exploite les cartes NVIDIA récentes et certaines Radeon récentes. Sinon, il calcule avec le processeur, plus lentement.

Sans carte graphique, garde de la marge. Windows et tes programmes ouverts occupent déjà une partie de la mémoire vive. Un modèle trop lourd peut ralentir fortement ton ordinateur, voire le bloquer.

Sur un **Mac avec une puce Apple M**, le processeur et la puce graphique partagent la mémoire. Sur un **Mac Intel**, Ollama utilise le processeur et les réponses peuvent être beaucoup plus lentes. Commence avec `ministral-3:3b` avant d’essayer un modèle plus gros.

</details>

**C’est réussi si tu connais ton système et la quantité de mémoire vive de ton ordinateur.**

[Étape suivante : choisis ton parcours](#parcours) · [Retour au sommaire](#sommaire)

<a id="parcours"></a>
<a id="les-neuf-dossiers"></a>

## 2. Choisis ton parcours

Clique sur la case qui correspond à ton ordinateur. Chaque lien ouvre les instructions adaptées.

| Système | Moins de 24 Go | De 24 à moins de 36 Go | 36 Go et plus |
|---|---|---|---|
| **Mac** | [Ouvrir le parcours](mac/moins-de-24-go/README.md) | [Ouvrir le parcours](mac/de-24-a-36-go/README.md) | [Ouvrir le parcours](mac/36-go-et-plus/README.md) |
| **Windows** | [Ouvrir le parcours](windows/moins-de-24-go/README.md) | [Ouvrir le parcours](windows/de-24-a-36-go/README.md) | [Ouvrir le parcours](windows/36-go-et-plus/README.md) |
| **Linux** | [Ouvrir le parcours](linux/moins-de-24-go/README.md) | [Ouvrir le parcours](linux/de-24-a-36-go/README.md) | [Ouvrir le parcours](linux/36-go-et-plus/README.md) |

Une machine de **36 Go** va dans **36 Go et plus**. Ces paliers sont nos repères, essayés pour l’instant sur une seule machine. En dessous de **16 Go**, viens quand même : tu pourras travailler en binôme.

### Prévois la place pour les modèles

| Mémoire vive | Modèles à télécharger | Espace disque pour les modèles |
|---|---|---|
| Moins de 24 Go | Ministral 3 | 2,95 Go |
| De 24 à moins de 36 Go | Ministral 3 et Ornith 1.5 9B | 9,50 Go |
| 36 Go et plus | Ministral 3, Ornith 1.5 9B et Qwen3.8 27B facultatif | 27,25 Go, ou 9,50 Go sans Qwen3.8 27B |

**Ministral 3** est le modèle de l’atelier : tout le monde l’utilise. **Ornith 1.5 9B** sert à comparer les réponses et au bonus code. **Qwen3.8 27B**, plus gros, sert à comparer un petit modèle et un gros.

**C’est réussi si tu as ouvert le parcours de ton système et de ta mémoire.**

[Étape suivante : prépare les applications](#preparation) · [Retour au sommaire](#sommaire)

<a id="preparation"></a>

## 3. Prépare les applications

Chaque parcours explique comment installer Ollama, télécharger les modèles et vérifier une première réponse. Prépare ensuite Handy pour la dictée locale. OpenCode reste facultatif.

### Suis les étapes de ton parcours

| Ordre | Ce que tu prépares | Ce que tu obtiens |
|---|---|---|
| **1** | Ollama | Le moteur qui fait tourner le modèle sur ton ordinateur |
| **2** | Les modèles de ton palier | Les fichiers disponibles avant l’atelier |
| **3** | Une première demande à Ministral | Une réponse qui confirme que l’installation fonctionne |
| **4** | Handy et son modèle Parakeet Ultra | La dictée locale prête à être essayée en salle |
| **Facultatif** | OpenCode, à partir de 24 Go | La préparation du bonus code avec Ornith |

Nous utiliserons Handy pendant l’atelier. Installe-le et télécharge Parakeet Ultra, environ 740 Mo, avant de venir si possible. Si cela bloque, tu pourras suivre l’essai en binôme.

Pour OpenCode, tu peux suivre la démonstration, puis reprendre le parcours de la page de l’atelier sur ton ordinateur. La procédure de lancement proposée reste à valider avec les versions retenues.

### Fais le point avant de venir

1. Vérifie qu’Ollama et `ministral-3:3b` donnent une première réponse.
2. Vérifie que Handy et Parakeet Ultra sont prêts.
3. Note l’étape qui bloque et le message d’erreur exact, s’il y en a un.
4. Prépare ton chargeur.

**C’est réussi si tu as obtenu une réponse de Ministral et préparé Handy avec Parakeet Ultra. Si une étape bloque, garde tes notes pour la reprendre avec nous.**

[Retour aux parcours](#parcours) · [Retour au sommaire](#sommaire)

<a id="reperes"></a>

## Repères et licences

<details>
<summary>Moteur et modèle : deux mots que tu retrouveras</summary>

Le **moteur**, Ollama, est le logiciel qui fait tourner une IA sur ton ordinateur. Avec les modèles de ce dépôt, tes questions et ses réponses sont calculées et gardées sur ton ordinateur. Internet sert au téléchargement.

Le **modèle** est le fichier qui contient les réglages appris pendant l’entraînement.

Ce dépôt contient les liens officiels et les commandes pour préparer ton ordinateur. Les logiciels et les modèles se téléchargent depuis les sites indiqués dans les parcours.

</details>

<details>
<summary>Pourquoi les parcours donnent des liens officiels et des empreintes SHA-256</summary>

Les liens directs mènent aux pages de publication des éditeurs, à une version précise. Un installeur récupéré ailleurs peut embarquer autre chose que ce qu’il annonce.

Chaque fichier est accompagné de son **empreinte SHA-256**. Elle permet de vérifier que le fichier reçu est bien celui publié. Fais cette vérification avant d’ouvrir le fichier. Ton parcours donne la commande et explique quoi faire si l’empreinte diffère.

Sous Linux, et pour OpenCode sur Mac, l’installation passe par un script du site officiel de l’éditeur. Sans autre réglage, ce script installe la version publiée au moment où tu le lances. Chaque parcours montre comment le lire avant de le lancer.

</details>

<details>
<summary>Licences des logiciels et des modèles</summary>

| Logiciel | Rôle | Licence |
|---|---|---|
| Ollama | Moteur | MIT |
| OpenCode | Assistant de programmation, facultatif | MIT |
| Handy | Dictée vocale locale | MIT |

Chaque modèle porte sa propre licence, distincte de celle d’Ollama.

| Modèle | Licence |
|---|---|
| Ministral 3 (`ministral-3:3b`) | Apache 2.0 |
| Ornith 1.5 9B (`ornith-1.5:9b`) | MIT, selon son éditeur |
| Qwen3.8 27B (`qwen3.8:27b`) | Apache 2.0 |

</details>

[Retour au sommaire](#sommaire)

<a id="contact"></a>

## Une question avant l’atelier ?

Mariano Sanfilippo et Vincent Daron, pour HELMo.

Une question avant l’atelier ? Passe par l’organisateur, **Digital Change with Ethics**, qui nous transmet.

[Retour au sommaire](#sommaire)
