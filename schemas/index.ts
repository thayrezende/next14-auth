import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema =z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newpassword: z.optional(z.string().min(6)),
})
    .refine((data) => {
        if(data.password && !data.newpassword) {
            return false;
        }

        return true;
    },{
        message: "New Password is required!",
        path: ["newPassword"]
    })

    .refine((data) => {
        
        if(data.newpassword && !data.password){
            return false
        }

        return true;
    },{
        message: "Password is required!",
        path: ["password"]
    })



export const NewPasswordSchema = z.object({
    password: z.string()
    .min(6, { 
        message: "Necessário no mínimo 6 caracteres." ,
    }),
});


export const ResetSchema = z.object({
    email: z.string()
    .min(1, { 
        message: "E-mail não pode estar em branco." ,
    }),
});

export const LoginSchema = z.object({
    email: z.string()
    .min(1, { 
        message: "E-mail não pode estar em branco." ,
    })
    .email({ 
        message: "E-mail inválido, por favor insira um e-mail válido." ,
    }),
    password: z.string()
    .min(1, {
        message: "Senha não pode estar em branco.",
    }),
    code: z.optional(z.string()),
});


export const RegisterSchema = z.object({
    email: z.string()
        .min(1, { 
            message: "E-mail não pode estar em branco." ,
    })
        .email({ 
            message: "E-mail inválido, por favor insira um e-mail válido." ,
    }),
    password: z.string()
        .min(6, {
            message: "Necessário no mínimo 6 caracteres.",
    }),
    name: z.string()
        .min(1,{
            message: "Nome não pode estar em branco." 
    }),
});