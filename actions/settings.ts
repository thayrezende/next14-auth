"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


export const settings =  async (
    values: z.infer<typeof SettingsSchema>
) => {
    const user = await currentUser();

    if(!user) {
        return { error: "Unauthorized" }
    }

    const dbUser = await getUserById(user.id as string);

    if(!dbUser) {
        return { error: "Unauthorized" }
    }

    if(user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newpassword = undefined;
    values.isTwoFactorEnabled = undefined;
    }

    if(values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email)

        if(existingUser && existingUser.id !== user.id){
            return { error: "E-mail already in use!"}
        }

        const verificationToken = await generateVerificationToken(
            values.email
        );
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Verification email sent!"};
    }


    if(values.password && values.newpassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password,
        );

        if(!passwordMatch) {
            return { error: "Incorrect Password!"};
        }

        const hashedPassword = await bcrypt.hash(
            values.newpassword,
            10,
        );

        values.password = hashedPassword;
        values.newpassword = undefined;
    }


    await db.user.update({

        where: { id: dbUser.id },
        data: {
            ...values,
        }
    });

    return { success: "Settings Updated!" }

}