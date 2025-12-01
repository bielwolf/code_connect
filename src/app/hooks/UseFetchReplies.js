import { useQuery } from "@tanstack/react-query";

const fetchReplies = async ({ commentId, slug }) => {
    const results = await fetch(`http://localhost:3000/api/comment/${commentId}/replies?slug=${slug}`);

    if (!results.ok) {
        throw new Error("A resposta de rede não está ok");
    }

    return results.json();
}

export const useFetchReplies = ({ commentId, slug }) => {
    return useQuery({
        queryKey: ['replies', commentId],
        queryFn: async () => fetchReplies({ commentId, slug }),
        enabled: !!commentId && !!slug
    })
}