/*
  Appellation: pages <types>
  Contrib: @FL03
*/
export type SearchParameters = { [key: string]: string | string[] | undefined };

export type PagePropsWithParams<T = { id: string }, S = SearchParameters> = {
  params: Promise<T>;
  searchParams?: Promise<S>;
};

export type TitledProps = { description?: import("react").ReactNode | null; title?: React.ReactNode | null };

export type DashboardProps = TitledProps;

export type BaseFormProps<T = unknown> = {
  defaultValues?: T;
  values?: T;
};

export type FormComponentProps<T = unknown> = React.ComponentProps<'form'> & BaseFormProps<T>;



export type HandlerOpts = {
  redirectTo?: string;
};