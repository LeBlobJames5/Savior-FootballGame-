import * as ex from "excalibur";
import { Resources } from "../resources";

export interface Exercise {
    name: string;
    description: string;
    startingPosition: string;
    execution: string
    image?: ex.ImageSource;
    duration: number;
    stats: {
    strength: number;
    endurance: number;
    speed: number;
    energyCost: number;
    }
} 

//Trap bar exercises description

export const TrapBarDeadlift: Exercise = {
    name: "Trap Bar Deadlift",
    description: "Un exercice de force qui sollicite principalement les jambes, \n les fessiers et le dos.",
    startingPosition: "Place-toi au centre de la trap bar, les pieds écartés à \n largeur d'épaules. Garde le dos droit, plie légèrement les \n genoux et saisis les poignées.",
    execution: "Pousse dans tes jambes pour te redresser tout en gardant le \n dos droit. Monte jusqu'à être complètement debout, puis \n redescends la trap bar de manière contrôlée.",
    duration: 10,

    stats: {
        strength: 8,
        endurance: 1,
        speed: 0,
        energyCost: 33
    }
};

export const TrapBarCarry: Exercise = {
    name: "Trap Bar Carry",
    description: "Un exercice qui consiste à transporter une charge sur une \n distance donnée. Il développe la force, l'endurance \n musculaire et la stabilité.",
    startingPosition: "Place-toi au centre de la trap bar, les pieds à largeur \n d'épaules. Saisis les poignées et redresse-toi en gardant \n le dos droit.",
    execution: "Marche vers l'avant en maintenant une posture droite et en \n contrôlant la charge. Continue jusqu'à avoir parcouru la \n distance prévue.",
    duration: 10,

    stats: {
        strength: 5,
        endurance: 5,
        speed: 0,
        energyCost: 33
    }
};

//Squat rack exercises description

export const Squat: Exercise = {
    name: "Squat",
    description: "Un exercice fondamental qui développe principalement la force \n des jambes et des fessiers.",
    startingPosition: "Place la barre sur le haut de ton dos. Écarte les pieds à \n largeur d'épaules et garde la poitrine relevée.",
    execution: "Plie les genoux et pousse les hanches vers l'arrière pour \n descendre. Descends de manière contrôlée puis pousse dans \n tes pieds pour revenir en position debout.",
    duration: 10,

    stats: {
        strength: 7,
        endurance: 2,
        speed: 0,
        energyCost: 33
    }
};

export const BenchPress: Exercise = {
    name: "Bench Press",
    description: "Un exercice de poussée qui développe principalement les \n pectoraux, les triceps et les épaules.",
    startingPosition: "Allonge-toi sur le banc, les pieds au sol et les mains \n légèrement plus écartées que les épaules sur la barre.",
    execution: "Décroche la barre et descends-la lentement vers la poitrine. \n Pousse ensuite la barre vers le haut jusqu'à tendre les bras \n sans verrouiller brutalement les coudes.",
    duration: 10,

    stats: {
        strength: 7,
        endurance: 0,
        speed:0,
        energyCost: 33
    }
};

export const OverheadPress: Exercise = {
    name: "Overhead Press",
    description: "Un exercice de poussée verticale qui développe principalement \n les épaules et les triceps.",
    startingPosition: "Tiens la barre devant tes épaules, les mains légèrement plus \n écartées que les épaules. Garde le dos droit et les \n abdominaux contractés.",
    execution: "Pousse la barre au-dessus de ta tête jusqu'à tendre les bras. \n Redescends ensuite la barre de manière contrôlée jusqu'aux \n épaules.",
    duration: 10,

    stats: {
        strength: 6,
        endurance: 0,
        speed: 0,
        energyCost: 33
    }
};

export const BarbellRow: Exercise = {
    name: "Barbell Row",
    description: "Un exercice de tirage qui développe principalement le dos et \n les biceps.",
    startingPosition: "Tiens la barre devant toi et penche ton buste vers l'avant en \n gardant le dos droit. Garde les genoux légèrement fléchis.",
    execution: "Tire la barre vers ton abdomen en rapprochant les coudes du \n corps. Redescends ensuite la barre lentement jusqu'à la \n position de départ.",
    duration: 10,

    stats: {
        strength: 6,
        endurance: 2,
        speed: 0,
        energyCost: 33
    }
};

export const PullUps: Exercise = {
    name: "Pull ups",
    description: "Un exercice de tirage au poids du corps qui développe \n principalement le dos, les biceps et la force de préhension.",
    startingPosition: "Saisis la barre de traction avec les mains légèrement plus \n écartées que les épaules. Suspends-toi avec les bras tendus \n et garde le corps gainé.",
    execution: "Tire ton corps vers le haut en rapprochant ta poitrine de la \n barre. Redescends ensuite de manière contrôlée jusqu'à avoir \n les bras tendus.",
    duration: 10,

    stats: {
        strength: 7,
        endurance: 2,
        speed: 0,
        energyCost: 33
    }
};

//Treadmill exercise description

export const Running: Exercise = {
    name: "Running",
    description:"Une course à intensité modérée qui développe principalement \n l'endurance cardiovasculaire.",
    startingPosition:"Monte sur le tapis et adopte une position droite, légèrement \n inclinée vers l'avant.",
    execution:"Cours à un rythme régulier et confortable pendant toute la \n durée de l'exercice.",
    duration: 15,

    stats: {
        strength: 0,
        endurance: 7,
        speed: 0,
        energyCost: 33
    }
};

export const Sprint: Exercise = {
    name: "Sprint",
    description:"Une course très rapide qui développe principalement la \n vitesse et l'explosivité.",
    startingPosition:"Place-toi au centre du tapis, adopte une position légèrement \n inclinée vers l'avant et prépare-toi à accélérer.",
    execution:"Cours à très haute intensité pendant toute la durée de \n l'exercice en maintenant une foulée rapide.",
    duration: 8,
    
    stats: {
        strength: 2,
        endurance: 0,
        speed: 8,
        energyCost: 33
    }
};

export const IntervalRunning: Exercise = {
    name: "Interval Running",
    description: "Une course alternant des phases rapides et des phases de \n récupération afin de développer l'endurance et la vitesse.",
    startingPosition: "Monte sur le tapis et commence par adopter un rythme léger.",
    execution: "Alterne des périodes de course rapide avec des périodes de \n récupération plus lentes jusqu'à la fin de l'exercice.",
    duration: 15,
    
    stats: {
        strength: 0,
        endurance: 8,
        speed: 4,
        energyCost: 33
    }
};

//Rowing machine exercises description

export const Rowing: Exercise = {
    name: "Rowing",

    description:"Un exercice cardiovasculaire complet qui sollicite les jambes, \n le dos et les bras.",
    startingPosition:"Assieds-toi sur le rameur, place tes pieds dans les supports \n et saisis la poignée avec les deux mains. Garde le dos droit.",
    execution:"Pousse d'abord avec les jambes, puis tire la poignée vers ton \n abdomen. Reviens ensuite progressivement à la position \n de départ.",
    duration: 15,
    
    stats: {
        strength: 3,
        endurance: 8,
        speed: 0,
        energyCost: 33
    }
};

//Sled exercises description

export const SledPush: Exercise = {
    name: "Sled Push",
    description: "Un exercice de puissance qui sollicite fortement les jambes \n et développe la force et l'endurance.",
    startingPosition: "Place-toi derrière le sled et saisis les poignées. Penche \n légèrement ton corps vers l'avant en gardant le dos droit.",
    execution: "Pousse le sled vers l'avant en utilisant principalement tes \n jambes. Maintiens une poussée constante jusqu'à avoir parcouru la distance prévue.",
    duration: 10,

    stats: {
        strength: 7,
        endurance: 5,
        speed: 0,
        energyCost: 33
    }
};

export const SledDrag: Exercise = {
    name: "Sled Drag",
    description: "Un exercice qui consiste à tirer une charge vers soi. Il \n développe principalement la force des jambes, du dos et \n l'endurance musculaire.",
    startingPosition: "Place-toi face à l'opposé du sled et saisis la sangle ou la \n corde attachée au traîneau. Garde le dos droit et les genoux \n légèrement fléchis.",
    execution: "Recule progressivement en tirant le sled vers toi. Maintiens \n une posture stable et continue jusqu'à avoir \n parcouru la \n distance prévue.",
    duration: 10,

    stats: {
        strength: 6,
        endurance: 5,
        speed: 0,
        energyCost: 33
    }
};

//Elliptical bike exercises description

export const Elliptical: Exercise = {
    name: "Elliptical Bike",
    description: "Un exercice cardiovasculaire qui développe principalement \n l'endurance tout en sollicitant l'ensemble du corps.",
    startingPosition: "Monte sur l'elliptique, place tes pieds sur les plateformes \n et saisis les poignées.",
    execution: "Effectue un mouvement régulier avec les jambes et les bras \n tout en maintenant un rythme constant.",
    duration: 15,

    stats: {
        strength: 0,
        endurance: 8,
        speed: 0,
        energyCost: 33
    }
};

//Plyo box exercises description

export const BoxJump: Exercise = {
    name: "Box Jumps",
    description: "Un exercice explosif qui développe principalement la \n puissance et la vitesse des jambes.",
    startingPosition: "Place-toi face à la plyo box, les pieds à largeur d'épaules \n et les genoux légèrement fléchis.",
    execution: "Fléchis légèrement les jambes puis saute sur la box de \n manière explosive. Stabilise-toi sur la box avant de \n redescendre et de recommencer.",
    duration: 10,

    stats: {
        speed: 7,
        strength: 4,
        endurance: 2,
        energyCost: 33
    }
};

export const StepUp: Exercise = {
    name: "Step-up",
    description: "Un exercice unilatéral qui développe principalement la force \n et l'endurance des jambes.",
    startingPosition: "Place-toi face à la plyo box, les pieds écartés à largeur de \n hanches. Garde le dos droit et les bras le long du corps.",
    execution: "Place un pied sur la box puis pousse sur cette jambe pour \n monter. Redescends de manière contrôlée et alterne les \n jambes à chaque répétition.",
    duration: 10,

    stats: {
        strength: 5,
        endurance: 4,
        speed: 0,
        energyCost: 33
    }
};

export const DepthJump: Exercise = {
    name: "Depth Jumps",
    description: "Un exercice pliométrique qui développe principalement \n l'explosivité et la puissance des jambes.",
    startingPosition: "Monte sur la plyo box et place-toi près du bord, les \n pieds écartés à largeur de hanches.",
    execution: "Descends de la box sans sauter vers l'avant. À l'atterrissage, \n fléchis rapidement les jambes puis effectue immédiatement un \n saut explosif vers le haut.",
    duration: 10,

    stats: {
        strength: 4,
        endurance: 0,
        speed: 9,
        energyCost: 33
    }
};