import { Request, Response } from 'express';
import {expressjwt} from "express-jwt";
import jwt from 'jsonwebtoken';

const secret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

/*
    * The JWT authentication middleware authenticates callers using a JWT.
    * The decoded JWT payload is available on the request via the auth property.
    * The default behavior of the module is to extract the JWT from the Authorization header (Bearer + token).
    * https://www.npmjs.com/package/express-jwt
 */
export const authMiddleware = expressjwt({
    algorithms: ['HS256'],
    credentialsRequired: false,
    secret,
    onExpired: (req, err) => {
        // TODO: handle expired token
        /*
            * If the token is expired, the error will be an instance of TokenExpiredError (401).
            * If the token is invalid, the error will be an instance of UnauthorizedError:.
            * If the token is valid, the request object will be decorated with the properties of the JWT payload.
         */
        console.log('onExpired', err);
    }
});

export async function handleLogin(req: Request, res: Response) {
    try {
        const {email, password} = req.body;
        const user = await getUserByEmail(email);
        if (!user || user.password !== password) {
            res.status(401).send('Invalid email or password');
        } else {
            const claims = {sub: user.id, email: user.email};
            const token = jwt.sign(claims, secret,{
                expiresIn: '1h',
                algorithm: 'HS256'
            });
            res.json({token});
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal server error');
    }

}

const getUserByEmail = async (email: string) => {
    // TODO: implement
    return {id: '1', email, password: 'password'};
}

export const getUser = async (id: string) => {
    // TODO: implement
    return {id, email: 'test@mail.com'}
};