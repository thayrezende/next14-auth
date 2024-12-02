import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient;

if(process.env.NODE_ENV !== "production") globalThis.prisma = db;



// import { PrismaClient } from "@prisma/client";

// // Estende `globalThis` para adicionar o tipo da propriedade `prisma`
// declare global {
//     namespace NodeJS {
//         interface Global {
//             prisma?: PrismaClient;
//         }
//     }
// }

// // Reutiliza ou cria uma nova instância do PrismaClient
// export const db: PrismaClient =
//     global.prisma ?? new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//     global.prisma = db; // Reutiliza a instância em ambientes de desenvolvimento
// }