import * as ex from "excalibur";
import { Exercise } from "../data/Exercises";

export class GymMachine extends ex.Actor {

    public machineName: string;
    public exercises: Exercise[];

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        machineName: string,
        exercises: Exercise[]
    ) {

        super({
            x: x,
            y: y,
            width: width,
            height: height,
            // Zone visible pour debug
            color: ex.Color.Red,
            opacity: 0.25,
            //No physical collision with the player
            collisionType: ex.CollisionType.PreventCollision
        });

        this.machineName = machineName;
        this.exercises = exercises;
    }
}