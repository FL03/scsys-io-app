/*
    Appellation: utils <module>
    Contrib: @FL03
*/
export * from './fmt';
export * from './helpers';
export * from './num';


import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';


export const validateRedirect = (path: string) => {
    revalidatePath(path, 'layout');
    redirect(path);
}