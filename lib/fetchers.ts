import axios from "axios";

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const linksFetcher = async () => await fetcher("/api/links");
export const usersFetcher = async () => await fetcher("/api/users");
