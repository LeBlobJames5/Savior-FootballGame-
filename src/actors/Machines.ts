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
            color: ex.Color.Red,
            opacity: 0,
            collisionType: ex.CollisionType.Fixed
        });

        this.machineName = machineName;
        this.exercises = exercises;
    }
}