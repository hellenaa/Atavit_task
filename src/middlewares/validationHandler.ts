import { Request, Response, NextFunction } from "express";
import Joi, { Schema } from "joi";

class ValidationHandler {
    private joi;
    constructor() {
        this.joi = Joi;
        this.getTeamsSchema = this.getTeamsSchema.bind(this);
        this.getGamesSchema = this.getGamesSchema.bind(this);
        this.validateRequest = this.validateRequest.bind(this);
    }

    getTeamsSchema(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            page: Joi.string().required(),
            per_page: Joi.string().required(),
        });

        this.validateRequest(req, next, schema);
    }

    getGamesSchema(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            page: Joi.string().required(),
            per_page: Joi.string().required(),
            season: Joi.string().required(),
            teamId: Joi.string(),
        });

        this.validateRequest(req, next, schema);
    }


    validateRequest(req: Request, next: NextFunction, schema: Schema) {
        const options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        const { error, value } = schema.validate(req.query, options);

        if (error) {
            next(Error(`Validation errors: ${error.details.map((x: any) => x.message).join(", ")}`));

        } else {
            req.query = value;
            next();
        }
    }
}

export default new ValidationHandler();
