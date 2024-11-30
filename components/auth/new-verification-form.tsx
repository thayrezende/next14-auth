"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "./card-wrapper";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const NewVerficationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const SearchParams = useSearchParams();
    
    const token = SearchParams.get("token");

    const onSubmit = useCallback(() => {
        if(success || error) return;

        if (!token) {
            setError("Token não encontrado!");
            return;
        }

        newVerification(token)
        .then((data) => {
            setSuccess(data.success);
            setError(data.error)
        })
        .catch(() => {
            setError("Algo deu errado!");
        })
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return(
        <CardWrapper
        headerLabel="Confirmando sua verificação..."
        backButtonLabel="Voltar para página de login"
        backButtonHref="/auth/login"
        >

            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                <BeatLoader />
                )}
                <FormSuccess message={success} />
                {!success && (
                <FormError message={error} />
                )}


            </div>

        </CardWrapper>

    )
}