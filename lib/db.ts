// import { PrismaClient } from "@prisma/client";

// declare global {
//     var prisma: PrismaClient | undefined;
// }

// export const db = globalThis.prisma || new PrismaClient;

// if(process.env.NODE_ENV !== "production") globalThis.prisma = db;


import { PrismaClient } from "@prisma/client";

declare global {
    // Mantemos 'var' aqui porque é uma declaração de tipo
    var prisma: PrismaClient | undefined;
}

// Usa const para declarar a variável de forma mais segura
export const db: PrismaClient =
    globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db; // Reutiliza a instância global em ambientes de desenvolvimento
}