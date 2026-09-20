import * as ex from "excalibur";
import { Exercise } from "../data/Exercises";
import { GymMachine } from "../actors/Machines";

export class GymMenu {

    private scene: ex.Scene;

    private background!: ex.Actor;
    private currentMachine?: GymMachine;

    constructor(scene: ex.Scene) {
        this.scene = scene;
        this.createMenu();
    }

    private createMenu() {
        this.background = new ex.Actor({
            x: 400,
            y: 650,
            width: 600,
            height: 900,
            color: ex.Color.fromHex("#1e1e1e")
        });

        this.background.z = 100;

        this.scene.add(this.background);

    const label = new ex.Label({
            text: "WOW je ferais bien d'aller voir ces machines de plus près",
            pos: ex.vec(-310,-265),
            font: new ex.Font({
                size: 20,
                family: "monospace",
                color: ex.Color.White
            })
        });

        this.background.addChild(label);
    }



    public setMachine(machine: GymMachine) {

        //Prevents from opening more than 1 menu
        if (this.currentMachine === machine) {
            return;
        }
        
        this.currentMachine = machine;
        this.updateMenu();
}

//If no Machine is detected, clear GymMenu
    public clearMachine() {
        if (!this.currentMachine) {
            return;
        }


        this.currentMachine = undefined;


        this.updateMenu();
    }   


        private updateMenu() {

        for (const child of [...this.background.children]) {
            this.background.removeChild(child);
        }

        if (!this.currentMachine) {

            const label = new ex.Label({
                text: "Mmmhhh pourquoi pas autre ?",
                pos: ex.vec(-310, -265),
                font: new ex.Font({
                    size: 25,
                    family: "monospace",
                    color: ex.Color.White
                })
            });

            this.background.addChild(label);
            return;
        }



        const title = new ex.Label({
            text: this.currentMachine.machineName,
            pos: ex.vec(0, -120),
            font: new ex.Font({
                size: 28,
                family: "monospace",
                color: ex.Color.White
            })
        });

        this.background.addChild(title);


    //GymMenu buttons
        this.currentMachine.exercises.forEach((exercise, index) => {

            const button = new ex.Actor({
                x: 0,
                y: -60 + index * 60,
                width: 300,
                height: 45,
                color: ex.Color.fromHex("#3a3a3a")
            });

            const label = new ex.Label({
                text: exercise.name,
                pos: ex.vec(0, 0),
                font: new ex.Font({
                    size: 18,
                    family: "monospace",
                    color: ex.Color.White
                })
            });

            button.addChild(label);

            button.on("pointerdown", () => {
                this.showExercise(exercise);
            });

            this.background.addChild(button);
        });
    }

        private showExercise(exercise: Exercise) {

        console.log("================================");
        console.log("EXERCICE :", exercise.name);
        console.log("DESCRIPTION :", exercise.description);
        console.log("FORCE :", exercise.strength);
        console.log("ENDURANCE :", exercise.endurance);
        console.log("VITESSE :", exercise.speed);
        console.log("ÉNERGIE :", exercise.energyCost);
        console.log("================================");

    }
}

