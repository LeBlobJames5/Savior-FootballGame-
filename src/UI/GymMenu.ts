import * as ex from "excalibur";
import { Exercise } from "../data/Exercises";
import { GymMachine } from "../actors/Machines";
import { BigStats } from "../State/stats";

export class GymMenu {
    //Class properties
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
            pos: ex.vec(-280, -250),
            font: new ex.Font({
                size: 18,
                family: "monospace",
                color: ex.Color.White,
                textAlign: ex.TextAlign.Left
            }),
            anchor: ex.vec(0.5, 0.5),
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
        //If no machine, displays messages and stops
        if (!this.currentMachine) {
            const label = new ex.Label({
                text: "Mmmhhh pourquoi pas une autre ?",
                pos: ex.vec(-290, -430),
                font: new ex.Font({
                    size: 25,
                    family: "monospace",
                    color: ex.Color.White,
                    textAlign: ex.TextAlign.Left
                }),

                anchor: ex.vec(0.5, 0.5),
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
            color: ex.Color.White,
            textAlign: ex.TextAlign.Center
        }),
        anchor: ex.vec(0.5, 0.5)
    });
        this.background.addChild(title);

    //GymMenu buttons
        this.currentMachine.exercises.forEach((exercise, index) => {

    const button = new ex.Actor({
        x: 0,
        y: -40 + index * 70,
        width: 400,
        height: 55,
        color: ex.Color.fromHex("#3a3a3a")
    });

    const label = new ex.Label({
        text: exercise.name,
        pos: ex.vec(0, 0),
        font: new ex.Font({
            size: 20,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Center
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    button.addChild(label);

    button.on("pointerdown", () => {
        this.showExercise(exercise);
    });
    this.background.addChild(button);
    });
}
    
    private showExercise(exercise: Exercise) {

    //Empties the menu
        for (const child of [...this.background.children]) {
            this.background.removeChild(child);
    }

    // Title of the exercise
    const title = new ex.Label({
        text: exercise.name,
        pos: ex.vec(0, -400),
        font: new ex.Font({
            size: 30,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Center
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    this.background.addChild(title);

    // Description of the exercise
    const descriptionTitle = new ex.Label({
        text: "DESCRIPTION",
        pos: ex.vec(-250, -320),
        font: new ex.Font({
            size: 20,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Left
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    this.background.addChild(descriptionTitle);

    const description = new ex.Label({
        text: exercise.description,
        pos: ex.vec(-250, -280),
        font: new ex.Font({
            size: 16,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Left
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    this.background.addChild(description);

    // Starting Position
    const startingTitle = new ex.Label({
        text: "POSITION DE DÉPART",
        pos: ex.vec(-250, -190),
        font: new ex.Font({
            size: 20,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Left
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    this.background.addChild(startingTitle);

    const startingPosition = new ex.Label({
        text: exercise.startingPosition,
        pos: ex.vec(-250, -150),
        font: new ex.Font({
            size: 16,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Left
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    this.background.addChild(startingPosition);

    // Execution of the exercise
    const executionTitle = new ex.Label({
        text: "EXÉCUTION",
        pos: ex.vec(-250, -60),
        font: new ex.Font({
            size: 20,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Left
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    this.background.addChild(executionTitle);

    const execution = new ex.Label({
        text: exercise.execution,
        pos: ex.vec(-250, -20),
        font: new ex.Font({
            size: 16,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Left
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    this.background.addChild(execution);

    //Duration of the exercise
    const duration = new ex.Label({
        text: `Durée : ${exercise.duration} secondes`,
        pos: ex.vec(-250, 100),
        font: new ex.Font({
            size: 18,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Left
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    this.background.addChild(duration);

    //Returns the cost of the exercise, or 0 if it is not defined
    const energyCost = exercise.stats.energyCost ?? 0;
    //Displays energy remaining et exercise cost
    const energyLabel = new ex.Label({
        text: `Énergie : ${BigStats.Energy} / ${BigStats.MaxEnergy}  |  Coût : ${energyCost}`,
        pos: ex.vec(-250, 160),
        font: new ex.Font({
            size: 18,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Left
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    this.background.addChild(energyLabel);    

    // Start Button for the exercise
    const startButton = new ex.Actor({
        x: 0,
        y: 250,
        width: 350,
        height: 60,
        color: ex.Color.fromHex("#3a3a3a")
    });

    const startLabel = new ex.Label({
        text: "COMMENCER",
        pos: ex.vec(0, 0),
        font: new ex.Font({
            size: 22,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Center
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    startButton.addChild(startLabel);

    startButton.on("pointerdown", () => {

    const energyCost = exercise.stats.energyCost ?? 0;
    //The exercise doesn't start if not enough energy
    if (!BigStats.hasEnoughEnergy(energyCost)) {

        const message = new ex.Label({
            text: "Pas assez d'énergie !",
            pos: ex.vec(-125, 350),
            font: new ex.Font({
                size: 22,
                family: "monospace",
                color: ex.Color.Red,
                textAlign: ex.TextAlign.Left
            }),
            anchor: ex.vec(0.5, 0.5)
        });
        this.background.addChild(message);
        return;
    }
        this.startExercise(exercise);
    });
    this.background.addChild(startButton);
    }

    private startExercise(exercise: Exercise) {
    //Empties the menu
    for (const child of [...this.background.children]) {
        this.background.removeChild(child);
    }

    let remainingTime = exercise.duration;

    const title = new ex.Label({
        text: exercise.name,
        pos: ex.vec(0, -300),
        font: new ex.Font({
            size: 30,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Center
        }),
        anchor: ex.vec(0.5, 0.5)
    });
    this.background.addChild(title);

    //Waiting screen during the exercise
    const status = new ex.Label({
        text: "EXERCICE EN COURS",
        pos: ex.vec(0, -200),
        font: new ex.Font({
            size: 22,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Center
        }),
        anchor: ex.vec(0.5, 0.5)
    });
    this.background.addChild(status);

    const timer = new ex.Label({
        text: `${remainingTime}`,
        pos: ex.vec(0, -50),
        font: new ex.Font({
            size: 60,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Center
        }),
        anchor: ex.vec(0.5, 0.5)
    });
    this.background.addChild(timer);
    //Updates the timer every second
    const interval = setInterval(() => {
        remainingTime--;
        timer.text = `${remainingTime}`;
        // Ends the exercise when the countdown reaches zero
        if (remainingTime <= 0) {
            clearInterval(interval);
            this.finishExercise(exercise);
        }
    }, 1000);
}

private finishExercise(exercise: Exercise) {
    // Update the player's stats based on the exercise's effects
    if (exercise.stats.strength !== undefined) {
        BigStats.addStrength(exercise.stats.strength);
    }
    if (exercise.stats.speed !== undefined) {
        BigStats.addSpeed(exercise.stats.speed);
    }
    if (exercise.stats.endurance !== undefined) {
        BigStats.addEndurance(exercise.stats.endurance);
    }
    // If the exercise has an energy cost, deduct it from the player's energy
    if (exercise.stats.energyCost !== undefined) {
        BigStats.useEnergy(exercise.stats.energyCost);
    }

    //Debug purpose
    console.log("================================");
    console.log("EXERCICE TERMINÉ :", exercise.name);
    console.log("FORCE :", BigStats.Strength);
    console.log("VITESSE :", BigStats.Speed);
    console.log("ENDURANCE :", BigStats.Endurance);
    console.log("ÉNERGIE :", BigStats.Energy);
    console.log("================================");

    this.showExerciseFinished(exercise);
}
//Finished exercise screen
private showExerciseFinished(exercise: Exercise) {

    for (const child of [...this.background.children]) {
        this.background.removeChild(child);
    }

    const title = new ex.Label({
        text: "EXERCICE TERMINÉ !",
        pos: ex.vec(0, -300),
        font: new ex.Font({
            size: 30,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Center
        }),
        anchor: ex.vec(0.5, 0.5)
    });
    this.background.addChild(title);

    const exerciseName = new ex.Label({
        text: exercise.name,
        pos: ex.vec(0, -220),
        font: new ex.Font({
            size: 22,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Center
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    this.background.addChild(exerciseName);

//Prepares list of stats modified by exercise
    const gains: string[] = [];
if (exercise.stats.strength !== undefined) {
    gains.push(`Force : +${exercise.stats.strength}`);
}
if (exercise.stats.speed !== undefined) {
    gains.push(`Vitesse : +${exercise.stats.speed}`);
}
if (exercise.stats.endurance !== undefined) {
    gains.push(`Endurance : +${exercise.stats.endurance}`);
}
if (exercise.stats.energyCost !== undefined) {
    gains.push(`Énergie : ${exercise.stats.energyCost}`);
}

const stats = new ex.Label({
    text: gains.join("\n"),
    pos: ex.vec(0, -100),
    font: new ex.Font({
        size: 22,
        family: "monospace",
        color: ex.Color.White,
        textAlign: ex.TextAlign.Center
    }),
    anchor: ex.vec(0.5, 0.5)
});

this.background.addChild(stats);

    const backButton = new ex.Actor({
        x: 0,
        y: 250,
        width: 350,
        height: 60,
        color: ex.Color.fromHex("#3a3a3a")
    });

    const backLabel = new ex.Label({
        text: "CONTINUER",
        pos: ex.vec(0, 0),
        font: new ex.Font({
            size: 22,
            family: "monospace",
            color: ex.Color.White,
            textAlign: ex.TextAlign.Center
        }),
        anchor: ex.vec(0.5, 0.5)
    });

    backButton.addChild(backLabel);

    backButton.on("pointerdown", () => {
        this.updateMenu();
    });

    this.background.addChild(backButton);
    }
}