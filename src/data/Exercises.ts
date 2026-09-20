import * as ex from "excalibur";
import { Resources } from "../resources";

export interface Exercise {
    name: string;
    description: string;
    image?: ex.ImageSource;
    duration: number;
    strength: number;
    endurance: number;
    speed: number;
    energyCost: number;
} 

export const Squat: Exercise = {
    name: "Squat",

    description:
        "Exercice polyarticulaire ciblant principalement les quadriceps, les fessiers et les ischio-jambiers.",

    duration: 30,

    strength: 8,
    endurance: 3,
    speed: 0,

    energyCost: 20
};


export const BenchPress: Exercise = {
    name: "Développé couché",

    description:
        "Exercice ciblant principalement les pectoraux, les épaules et les triceps.",

    duration: 30,

    strength: 7,
    endurance: 2,
    speed: 0,

    energyCost: 15
};


export const Deadlift: Exercise = {
    name: "Soulevé de terre",

    description:
        "Exercice polyarticulaire ciblant le dos, les jambes et les fessiers.",

    duration: 30,

    strength: 8,
    endurance: 3,
    speed: 1,

    energyCost: 20
};


export const Running: Exercise = {
    name: "Course",

    description:
        "Course sur tapis visant principalement à améliorer l'endurance et la vitesse.",

    duration: 30,

    strength: 0,
    endurance: 8,
    speed: 2,

    energyCost: 15
};


export const Rowing: Exercise = {
    name: "Rameur",

    description:
        "Exercice complet sollicitant le dos, les bras, les jambes et le cardio.",

    duration: 30,

    strength: 6,
    endurance: 6,
    speed: 1,

    energyCost: 15
};


export const PullUps: Exercise = {
    name: "Tractions",

    description:
        "Exercice ciblant principalement le dos et les biceps.",

    duration: 30,

    strength: 7,
    endurance: 3,
    speed: 0,

    energyCost: 15
};