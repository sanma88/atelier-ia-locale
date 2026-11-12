# L’IA locale sur ton ordinateur : préparer ta machine

Vivement le 20 novembre, on va pouvoir discuter ensemble et découvrir cet univers. Voici tout ce qu’on utilisera ce jour-là. Télécharge-le avant de venir : tu gagneras du temps le jour J.

Atelier d’initiation du vendredi 20 novembre 2026, à 16 h 30, salle Imprimerie, dans le cadre de Digital Change with Ethics. Animé par Mariano Sanfilippo et Vincent Daron, au nom de HELMo.

## À quoi sert ce dépôt

Le jour de l’atelier, une douzaine de personnes voudront télécharger les mêmes fichiers, de plusieurs gigaoctets, sur le même Wi-Fi. Ce dépôt te permet de le faire chez toi, au calme : tu arrives avec un ordinateur prêt et tu passes l’atelier à t’en servir, pas à regarder une barre de progression.

Avant l’atelier, ce dépôt n’est pas un cours : c’est une liste de courses. Il ne contient aucun logiciel ni aucun modèle, seulement les liens officiels pour les télécharger et les commandes pour les installer. Tout s’explique le jour J, et ce dépôt sera aussi le support de l’atelier.

Deux mots reviennent partout :

- le **moteur**, c’est Ollama : le logiciel qui fait tourner une IA sur ton ordinateur. Avec les modèles de ce dépôt, tes questions et ses réponses sont calculées et gardées sur ton ordinateur : Internet sert au téléchargement ;
- le **modèle**, c’est le fichier qui contient ce que l’IA a appris. Tu ne télécharges pas Internet : tu télécharges des réglages.

## Ce n’est pas obligatoire

Ce n’est pas un examen d’entrée. Si ça bloque, ou si tu n’as pas eu le temps, viens quand même : on règle ça ensemble sur place. Note seulement le message d’erreur exact s’il y en a un, et pense à ton chargeur.

## Choisir ton dossier en deux questions

**1. Quel est ton système ?** Mac, Windows ou Linux.

**2. Combien de mémoire vive a ton ordinateur ?** La mémoire vive, c’est la mémoire de travail de l’ordinateur, celle que le modèle occupe pendant qu’il répond. À ne pas confondre avec l’espace disque, où les fichiers sont rangés.

Pour la lire :

- **Mac** : menu Pomme, en haut à gauche, puis « À propos de ce Mac ». Regarde la ligne « Mémoire ».
- **Windows** : ouvre le Gestionnaire des tâches avec `Ctrl` + `Maj` + `Échap`, onglet « Performances », puis « Mémoire ». Le total s’affiche en haut à droite.
- **Linux** : dans un terminal, une fenêtre où l’on tape des commandes, tape `free -h`. Regarde la colonne `total` de la ligne qui commence par `Mem` ou `Mém.`.

Si la valeur affichée tombe juste sous un palier, 15,8 Go pour une machine de 16 Go par exemple, prends le palier de la valeur ronde : une partie de la mémoire est réservée par le système.

## Les neuf dossiers

| Système | Moins de 24 Go | De 24 à 36 Go | 36 Go et plus |
|---|---|---|---|
| Mac | [mac/moins-de-24-go](mac/moins-de-24-go/README.md) | [mac/de-24-a-36-go](mac/de-24-a-36-go/README.md) | [mac/36-go-et-plus](mac/36-go-et-plus/README.md) |
| Windows | [windows/moins-de-24-go](windows/moins-de-24-go/README.md) | [windows/de-24-a-36-go](windows/de-24-a-36-go/README.md) | [windows/36-go-et-plus](windows/36-go-et-plus/README.md) |
| Linux | [linux/moins-de-24-go](linux/moins-de-24-go/README.md) | [linux/de-24-a-36-go](linux/de-24-a-36-go/README.md) | [linux/36-go-et-plus](linux/36-go-et-plus/README.md) |

« De 24 à 36 Go » veut dire 24 Go ou plus, mais moins de 36 Go. Une machine de 36 Go va dans « 36 Go et plus ».

Ces paliers sont nos repères, testés pour l’instant sur une seule machine. En dessous de 16 Go de mémoire vive, viens quand même : on travaillera en binôme.

Ce que chaque palier télécharge :

| Palier | Modèles | Espace disque pour les modèles |
|---|---|---|
| Moins de 24 Go | Ministral 3 | 2,95 Go |
| De 24 à 36 Go | Ministral 3, Ornith 1.5 9B | 9,50 Go |
| 36 Go et plus | Ministral 3, Ornith 1.5 9B, Qwen3.8 27B (facultatif) | 27,25 Go, ou 9,50 Go sans Qwen3.8 27B |

Ministral 3 est le modèle de l’atelier : tout le monde l’utilise. Ornith 1.5 9B sert au bonus code. Qwen3.8 27B, plus gros, sert à comparer un petit modèle et un gros.

## Structure du dépôt

```text
.
├── README.md                 cette page
├── mac/
│   ├── moins-de-24-go/README.md
│   ├── de-24-a-36-go/README.md
│   └── 36-go-et-plus/README.md
├── windows/
│   └── (les trois mêmes dossiers)
└── linux/
    └── (les trois mêmes dossiers)
```

Chaque dossier tient en trois étapes : installer le moteur, télécharger les modèles, vérifier que tout répond. Viennent ensuite des outils en option.

## Pourquoi des liens officiels

Tous les liens directs mènent aux pages de publication des éditeurs, à une version précise : un installeur récupéré ailleurs peut embarquer autre chose que ce qu’il annonce. Chaque fichier est accompagné de son empreinte SHA-256, qui permet de vérifier que le fichier reçu est bien celui publié. Cette vérification se fait avant d’ouvrir le fichier ; chaque dossier donne la commande de ton système, et quoi faire si l’empreinte diffère.

Sous Linux, et pour OpenCode sur Mac, l’installation passe par un script du site officiel de l’éditeur. Sans autre réglage, un script installe la version que l’éditeur publie au moment où tu le lances ; chaque dossier montre comment le lire avant de le lancer.

## Licences

Logiciels :

| Logiciel | Rôle | Licence |
|---|---|---|
| Ollama | moteur | MIT |
| OpenCode | assistant de programmation, en option | MIT |
| Handy | dictée vocale, en bonus | MIT |

Modèles : chacun porte sa propre licence, distincte de celle d’Ollama.

| Modèle | Licence |
|---|---|
| Ministral 3 (`ministral-3:3b`) | Apache 2.0 |
| Ornith 1.5 9B (`ornith-1.5:9b`) | MIT, selon son éditeur |
| Qwen3.8 27B (`qwen3.8:27b`) | Apache 2.0 |

## Contact

Mariano Sanfilippo et Vincent Daron, pour HELMo.

Une question avant l’atelier ? Passe par l’organisateur, Digital Change with Ethics, qui nous transmet.
